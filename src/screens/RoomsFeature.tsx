import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator, Share } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase, ServerValue } from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { createMatch, joinMatch } from '../firebase/matchService';
import { useGame } from '../context/GameContext';
import { ensureSignedInAnonymously } from '../firebase';
import { puzzleData } from '../levels/level1';
import { notify } from '../utils/notificationCenter';
import LinearGradient from 'react-native-linear-gradient';
import { getRandomLevel } from '../levels';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { getLevelModule } from '../levels'; 


function roomRef(roomId?: string) {
  const db = getDatabase();
  return roomId ? db.ref(`rooms/${roomId}`) : db.ref('rooms');
}

const SERVER_TS = ServerValue.TIMESTAMP;

export async function createRoomOnServer(
  settings: { maxPlayers?: number; matchSettings?: Record<string, any> } = {}
) {
  const app = getApp();
  const firebaseAuth = getAuth(app);
  const db = getDatabase(app);
  const uid = firebaseAuth.currentUser?.uid ?? null;
  if (!uid) throw new Error('Not signed in');

  const ref = db.ref('rooms').push();
  const roomId = ref.key as string;

  const payload = {
    host: uid,
    settings: {
      maxPlayers: settings.maxPlayers ?? 2,
      ...(settings.matchSettings ? { matchSettings: settings.matchSettings } : {}),
    },
    status: 'open',
    createdAt: SERVER_TS,
    players: { [uid]: { uid, joinedAt: SERVER_TS } },
  } as any;

  await ref.set(payload);

  try { await ref.child(`players/${uid}`).onDisconnect().remove(); } catch (e) { /* best-effort */ }

  return roomId;
}

async function waitForAuthReady(timeoutMs = 3000) {
  const start = Date.now();
  while (!auth().currentUser && (Date.now() - start) < timeoutMs) {
    await new Promise(res => setTimeout(() => res, 120));
  }
  return auth().currentUser ?? null;
}

export async function joinRoomOnServer(roomId: string) {
  try { await ensureSignedInAnonymously(); } catch (e) { /* fallback below */ }

  const currentUser = await waitForAuthReady(4000);
  const uid = currentUser?.uid ?? auth().currentUser?.uid ?? null;
  if (!uid) throw new Error('Not signed in — cannot join room');

  const app = getApp();
  const db = database();

  try {
    const roomSnap = await db.ref(`rooms/${roomId}`).once('value');
    console.log('[joinRoomOnServer] debug app:', app.name, app.options?.projectId, app.options?.databaseURL);
    console.log('[joinRoomOnServer] debug uid =', uid);
    console.log('[joinRoomOnServer] debug roomVal =', roomSnap.val());
  } catch (e) {
    console.warn('[joinRoomOnServer] debug read failed', e);
  }

  const playersRef = db.ref(`rooms/${roomId}/players`);
  const snap = await playersRef.once('value');
  const cur = snap.val() ?? {};
  const currentCount = Object.keys(cur).length;
  const maxPlayers = 2;
  if (currentCount >= maxPlayers) throw new Error('Room is full');

  const myRef = db.ref(`rooms/${roomId}/players/${uid}`);

  const payload = { uid, joinedAt: Date.now() };

  try {
    await myRef.set(payload);
    try { await myRef.onDisconnect().remove(); } catch (e) { /* ignore */ }
    console.log('[joinRoomOnServer] set succeeded');
    return true;
  } catch (e:any) {
    console.error('[joinRoomOnServer] set failed', e?.code ?? e?.message ?? e);
    if (e?.code && e.code.includes('permission-denied')) {
      throw new Error('Permission denied writing to rooms. Check Firebase DB rules & Authentication.');
    }
    throw e;
  }
}


export async function leaveRoomOnServer(roomId: string) {
  const app = getApp();
  const firebaseAuth = getAuth(app);
  const db = getDatabase(app);
  const uid = firebaseAuth.currentUser?.uid ?? null;
  if (!uid) return;
  try { await db.ref(`rooms/${roomId}/players/${uid}`).remove(); } catch (e) { /* ignore */ }
}

async function waitForMatchStateReady(matchId: string, timeoutMs = 5000) {
  const db = getDatabase();
  const ref = db.ref(`matches/${matchId}/state`);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const snap = await ref.once('value');
      const st = snap.val();
      if (st && (Array.isArray(st.grid) || (st.playerHands && Object.keys(st.playerHands || {}).length > 0))) {
        return st;
      }
    } catch (e) {
      console.warn('[waitForMatchStateReady] read failed (will retry)', e);
    }
    await new Promise<void>((res) => setTimeout(res, 200));
  }
  throw new Error('Timeout waiting for match state readiness');
}



export async function startRoomAsHost(roomId: string) {
  const app = getApp();
  const firebaseAuth = getAuth(app);
  const db = getDatabase(app);
  const uid = firebaseAuth.currentUser?.uid ?? null;
  if (!uid) throw new Error('Not signed in');

  const snap = await db.ref(`rooms/${roomId}`).once('value');
  const room = snap.val();
  if (!room) throw new Error('Room not found');
  if (room.host !== uid) throw new Error('Only host can start');
  if (room.status !== 'open') throw new Error('Room not open');
  const playerUids = room.players ? Object.keys(room.players) : [uid];

  const chosenLevel = room?.settings?.matchSettings?.level ?? 1;
  const module = getLevelModule(chosenLevel);
  const chosenPuzzleData = module?.puzzleData ?? null;
  const initialMatchState: any = {
    grid: Array.isArray(chosenPuzzleData?.grid) ? chosenPuzzleData.grid : [],
    matchSettings: {
      ...(room?.settings?.matchSettings ?? {}),
      level: chosenLevel, 
    },
  };

  const matchId = await createMatch(initialMatchState, playerUids);
  try {
    await waitForMatchStateReady(matchId, 5000);
  } catch (err) {
    console.warn('[startRoomAsHost] match state not ready before marking started (continuing):', err);
  }

  await db.ref(`rooms/${roomId}`).update({ status: 'started', matchId, startedAt: SERVER_TS });

  return { matchId };
}

export function CreateRoomScreen() {
  const [creating, setCreating] = useState(false);
  const navigation = useNavigation<any>();
  const app = getApp();
  const firebaseAuth = getAuth(app);
  const firebaseDb = getDatabase(app);

  const onCreate = async () => {
    setCreating(true);
    try {
      await ensureSignedInAnonymously();
      const uid = firebaseAuth.currentUser?.uid;
      if (!uid) throw new Error('Not signed in');

const level = getRandomLevel();
const id = await createRoomOnServer({ maxPlayers: 2, matchSettings: { level } });
      try {
        Clipboard.setString(id);
      } catch (e) {
      }
      try {
        await Share.share({ message: `Join my game — Room ID: ${id}` });
      } catch (e) {
      }

      notify({ type: 'success', message: `Room created — ID copied to clipboard` });
      navigation.navigate('RoomLobby' as any, { roomId: id });
    } catch (err: any) {
      console.warn('[CreateRoom] failed', err);
      notify({ type: 'error', title: 'Create room failed', message: `${err?.code ?? ''} ${err?.message ?? String(err)}`, durationMs: 4000 });
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Play with Friends</Text>

      <TouchableOpacity style={styles.button} onPress={onCreate} disabled={creating}>
        {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create room</Text>}
      </TouchableOpacity>

      <Text style={{ marginTop: 12, color: '#ddd' }}>Room will support up to 2 players. You will be host.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: '#1E1330', alignItems: 'center', justifyContent: 'center' },
  title: { color: 'white', fontSize: 20, marginBottom: 12 },
  button: { backgroundColor: '#6C4CF5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: '700' },
});

export function RoomLobbyScreen({ route, navigation }: any) {
  const { roomId } = route.params ?? {};
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [starting, setStarting] = useState(false);

  const { dispatch: gameDispatch } = useGame();

  const app = getApp();
  const firebaseAuth = getAuth(app);
  const firebaseDb = getDatabase(app);

  const navigatedRef = React.useRef(false);

  useEffect(() => {
    if (!roomId || !room) return;
    if (room.status === 'started' && room.matchId) {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      (async () => {
        try {
          await ensureSignedInAnonymously();
          const uid = firebaseAuth.currentUser?.uid ?? null;

          const matchId = room.matchId;
          const ref = firebaseDb.ref(`matches/${matchId}/state`);
          const deadline = Date.now() + 5000;
          let ok = false;
          while (Date.now() < deadline) {
            const snap = await ref.once('value');
            const st = snap.val();
            if (st && (Array.isArray(st.grid) || (st.playerHands && uid && Array.isArray(st.playerHands[uid])))) {
              ok = true;
              break;
            }
            await new Promise<void>((res) => setTimeout(res, 200));
          }
          if (!ok) {
            console.warn('[RoomLobby] match state not ready before join; proceeding anyway');
          }

          await joinMatch(room.matchId);

          gameDispatch({ type: 'SET_MODE', mode: 'pvp' });
          gameDispatch({ type: 'SET_MATCH', matchId: room.matchId, playerId: uid });

          navigation.replace('CrosswordPuzzleGame', {});
        } catch (err: any) {
          console.warn('[RoomLobby] auto-join failed', err);
          notify({ type: 'error', title: 'Join failed', message: `Could not join the started match: ${String(err?.message ?? err)}`, durationMs: 4500 });
          navigatedRef.current = false;
        }
      })();
    }
  }, [room, roomId, firebaseDb, firebaseAuth, gameDispatch, navigation]);

  useEffect(() => {
    if (!roomId) return;
    const ref = firebaseDb.ref(`rooms/${roomId}`);
    const handler = (snap: any) => { setRoom(snap.val()); setLoading(false); };
    ref.on('value', handler);
    return () => ref.off('value', handler);
  }, [roomId, firebaseDb]);
  const shareRoom = async () => {
    if (!roomId) return;
    const shareUrl = `myapp://room/${roomId}`;
    try {
      await Share.share({
        message: `Join my game! Room ID: ${roomId}\n(Or paste this into the app) ${shareUrl}`,
      });
    } catch (err) {
      console.warn('share failed', err);
    }
  };

  const copyRoomLink = async () => {
    if (!roomId) return;
    try {
      await Clipboard.setString(roomId);
      notify({ type: 'success', title: 'Copied', message: 'Room ID copied to clipboard — paste it to your friend.', durationMs: 2500 });
    } catch (e) {
      console.warn('copy failed', e);
      notify({ type: 'error', title: 'Copy failed', message: 'Unable to copy room id to clipboard.', durationMs: 3000 });
    }
  };

 const onJoin = async () => {
  if (!roomId) return;
  setJoining(true);
  try {
    await ensureSignedInAnonymously();
    const uid = firebaseAuth.currentUser?.uid ?? null;
    console.log('[RoomLobby.onJoin] signing in as uid=', uid);
    if (!uid) throw new Error('Not signed in (uid missing)');

    await joinRoomOnServer(roomId);
    notify({ type: 'success', title: 'Joined', message: 'Successfully joined room. Wait for host to start.', durationMs: 3000 });
  } catch (err:any) {
    console.warn('[RoomLobby.onJoin] failed', err);
    notify({ type: 'error', title: 'Join failed', message: String(err?.message ?? err), durationMs: 4000 });
  } finally {
    setJoining(false);
  }
};

  const onStart = async () => {
    if (!roomId) return;
    setStarting(true);
    try {
      const { matchId } = await startRoomAsHost(roomId);

      await joinMatch(matchId); 

      gameDispatch({ type: 'SET_MODE', mode: 'pvp' });
      const uid = firebaseAuth.currentUser?.uid ?? null;
      gameDispatch({ type: 'SET_MATCH', matchId, playerId: uid });

      navigation.replace('CrosswordPuzzleGame', {});
    } catch (err:any) {
      notify({ type: 'error', title: 'Start failed', message: String(err?.message ?? err), durationMs: 4000 });
    } finally { setStarting(false); }
  };

  if (loading) return <View style={stylesLocal.screen}><ActivityIndicator /></View>;
  if (!room) return <View style={stylesLocal.screen}><Text style={{ color: '#fff' }}>Room not found or closed.</Text></View>;

  const uid = firebaseAuth.currentUser?.uid ?? null;
  const isHost = room.host === uid;
  const players = room.players ? Object.keys(room.players).map(k => ({ uid: k })) : [];

  return (
    <View style={stylesLocal.screen}>
      <LinearGradient
        colors={['#3b1b67', '#5e2fc0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={stylesLocal.headerCard}
      >
        <Text style={stylesLocal.headerTitle}>Room</Text>

        <View style={stylesLocal.roomRowColumn}>
  <View style={stylesLocal.roomIdBox}>
    <Text selectable style={stylesLocal.roomIdText}>{roomId}</Text>
  </View>

  <View style={stylesLocal.hostBlock}>
    <Text style={stylesLocal.hostLabel}>Host</Text>
    <Text style={stylesLocal.hostId}>{room.host}</Text>
    <Text style={stylesLocal.smallMuted}>{room.status === 'open' ? 'Waiting for players' : 'Started'}</Text>
  </View>
</View>

      </LinearGradient>

      <View style={stylesLocal.playersWrap}>
        <Text style={stylesLocal.sectionTitle}>Players ({players.length})</Text>
        <FlatList
          data={players}
          keyExtractor={it => it.uid}
          renderItem={({ item }) => (
            <View style={stylesLocal.playerRow}>
              <View style={stylesLocal.avatarPlaceholder}><Text style={{ color: '#fff', fontWeight: '700' }}>{item.uid?.slice(0,2).toUpperCase()}</Text></View>
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: '#fff' }}>{item.uid}</Text>
                <Text style={{ color: '#c9cfe0', fontSize: 12 }}>Joined</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          style={{ width: '100%' }}
        />
      </View>

      <View style={stylesLocal.actionsCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <TouchableOpacity style={stylesLocal.actionBtn} onPress={shareRoom}>
            <Text style={stylesLocal.actionBtnText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[stylesLocal.actionBtn, stylesLocal.ghostActionBtn]} onPress={copyRoomLink}>
            <Text style={[stylesLocal.actionBtnText, { color: '#c9cfe0' }]}>Copy ID</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 12 }} />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {isHost ? (
            <TouchableOpacity style={[stylesLocal.primaryBtn, (starting || players.length < 2) && { opacity: 0.6 }]} onPress={onStart} disabled={starting || players.length < 2}>
              <Text style={stylesLocal.primaryBtnText}>{starting ? 'Starting...' : 'Start Game'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[stylesLocal.primaryBtn, joining && { opacity: 0.6 }]} onPress={onJoin} disabled={joining}>
              <Text style={stylesLocal.primaryBtnText}>{joining ? 'Joining...' : 'Join Room'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={stylesLocal.ghostLink} onPress={async () => { try { await leaveRoomOnServer(roomId); navigation.goBack(); } catch (e) { navigation.goBack(); } }}>
            <Text style={{ color: '#c9cfe0' }}>Leave</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const stylesLocal = StyleSheet.create({
  screen: { flex: 1, padding: 18, backgroundColor: '#1E1330', alignItems: 'center' },
  headerCard: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center'
  },
  headerTitle: { color: '#FFF', fontSize: 16, opacity: 0.9, marginBottom: 6, fontWeight:600 },

  roomRowColumn: {
  flexDirection: 'column',
  alignItems: 'center',  
},

hostBlock: {
  marginTop: 15,
  alignItems: 'center', 
  width: '100%',
  paddingHorizontal: 6,
},

  roomIdBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomIdText: { color: '#fff', fontWeight: '900', letterSpacing: 1.2 },
  hostLabel: { color: '#DDE5FF', fontSize: 16, fontWeight:600 },
  hostId: { color: '#fff', marginTop: 4, fontWeight: '700' },
  smallMuted: { color: '#c9cfe0', fontSize: 12, marginTop: 4 },

  playersWrap: { width: '100%', marginTop: 8, marginBottom: 12 },
  sectionTitle: { color: '#fff', fontWeight: '800', marginBottom: 8 },
  playerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.01)' },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#5135a8', alignItems: 'center', justifyContent: 'center' },

  actionsCard: {
    width: '100%',
    marginTop: 6,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  actionBtn: {
    flex: 1,
    backgroundColor: '#6C4CF5',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  ghostActionBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  actionBtnText: { color: '#fff', fontWeight: '800' },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#FF6A88',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '900' },

  ghostLink: { alignSelf: 'center', paddingHorizontal: 10, justifyContent: 'center' },
});
