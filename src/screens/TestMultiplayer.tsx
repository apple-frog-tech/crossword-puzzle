import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  requestQuickMatch,
  cancelQuickMatch,
  ensureMatchInitialized,
  joinMatch,
  createMatch,
} from '../firebase/matchService';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';
import { useGame } from '../context/GameContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ensureSignedInAnonymously } from '../firebase';
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { initialLetters, puzzleData } from '../levels/level1';
import Clipboard from '@react-native-clipboard/clipboard';
import { ProfileContext } from '../context/ProfileContext';
import { notify } from '../utils/notificationCenter';
import { createRoomOnServer } from './RoomsFeature';
import PlayerId from '../components/PlayerId';
import { getRandomLevel, getLevelModule } from '../levels';

const AVATARS = [
  require('../assets/avatars/Avatar1.png'),
  require('../assets/avatars/Avatar2.png'),
  require('../assets/avatars/Avatar3.png'),
  require('../assets/avatars/Avatar4.png'),
  require('../assets/avatars/Avatar5.png'),
  require('../assets/avatars/Avatar6.png'),
  require('../assets/avatars/Avatar7.png'),
  require('../assets/avatars/Avatar8.png'),
  require('../assets/avatars/Avatar9.png'),
  require('../assets/avatars/Avatar10.png'),
];

async function fetchChosenLevelGrid(matchId: string) {
  const levelMetaPath = `matchmaking/levels/default/matches/${matchId}`;
  const maxRetries = 5;
  const retryDelayMs = 200;

  try {
    let meta: any = null;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const snap = await database().ref(levelMetaPath).once('value');
      meta = snap.val();
      if (meta && meta.matchSettings && (meta.matchSettings.level !== undefined)) break;
await new Promise<void>(resolve => setTimeout(() => resolve(), retryDelayMs));
    }

    const chosenLevel = meta?.matchSettings?.level ?? (meta?.level ?? null);

    if (chosenLevel != null) {
      try {
        const levelModule = getLevelModule(chosenLevel);
        const chosenGrid = levelModule?.puzzleData?.grid;
        if (Array.isArray(chosenGrid)) {
          return { chosenLevel, chosenGrid };
        }
      } catch (e) {
        console.warn('[fetchChosenLevelGrid] getLevelModule failed', e);
      }
    }

    console.warn('[fetchChosenLevelGrid] falling back to default level1 grid for match', matchId);
    return { chosenLevel: chosenLevel ?? 1, chosenGrid: puzzleData.grid ?? [] };
  } catch (e) {
    console.warn('[fetchChosenLevelGrid] read failed', e);
    return { chosenLevel: 1, chosenGrid: puzzleData.grid ?? [] };
  }
}

export default function TestMultiplayer() {
  const app = getApp();
const firebaseAuth = getAuth(app);
const firebaseDb = getDatabase(app);
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

    const profileCtx = useContext(ProfileContext);
  const profile = profileCtx?.profile;
  const avatarSource = typeof profile?.avatarId === 'number' ? AVATARS[profile.avatarId] : null;
  const idShort = profile?.id ? profile.id.replace(/^anon-/, '').slice(0, 8) : null;
const displayName = profile?.name ?? idShort ?? 'Player';
  const displayFlag = profile?.country?.flagEmoji ?? '';


  const [finding, setFinding] = useState(false);
  const [matchedId, setMatchedId] = useState<string | null>(null);
  const matchmakingListenerRef = useRef<FirebaseDatabaseTypes.Reference | null>(null);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [creating, setCreating] = useState(false);

  const [startingLevelFromCongrats, setStartingLevelFromCongrats] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await ensureSignedInAnonymously();
        console.log('[TestMultiplayer] signed in uid=', firebaseAuth.currentUser?.uid);
      } catch (err) {
        console.warn('[TestMultiplayer] anonymous sign-in failed', err);
        notify({ type: 'error', title: 'Sign-in failed', message: 'Anonymous sign-in failed. Check Firebase config.', durationMs: 3000 });
      }
    })();
  }, []);

 useEffect(() => {
  try {
    const rawLvl = route?.params?.startLevel ?? route?.params?.nextLevel ?? undefined;
    if (typeof rawLvl !== 'undefined' && rawLvl !== null) {
      const lvlNum = typeof rawLvl === 'number' ? rawLvl : parseInt(String(rawLvl), 10);
      if (!Number.isNaN(lvlNum) && lvlNum > 0) {
        console.log('[TestMultiplayer] received start level param ->', lvlNum);
        setStartingLevelFromCongrats(lvlNum);

        try {
          (navigation as any).setParams?.({ startLevel: undefined, nextLevel: undefined });
        } catch (e) { /* ignore */ }
        return;
      }
    }
  } catch (err) {
    console.warn('[TestMultiplayer] startLevel/nextLevel route param read failed', err);
  }
}, [route?.params?.startLevel, route?.params?.nextLevel]);

  useEffect(() => {
    if (route?.params?.startQuickMatch) {
      try { (navigation as any).setParams?.({ startQuickMatch: false }); } catch (e) {}
      findMatch();
    }
  }, [route?.params?.startQuickMatch]);

  useEffect(() => {
    return () => {
      try {
        if (matchmakingListenerRef.current) {
          matchmakingListenerRef.current.off();
          matchmakingListenerRef.current = null;
        }
        cancelQuickMatch('default').catch(() => {});
      } catch (e) {}
    };
  }, []);

  const makeInitialDeck = () => initialLetters.map((ch, i) => ({ id: `init-${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2,6)}`, char: ch, originalIndex: i }));

 const onPlayVsAI = () => {
  const lvl = startingLevelFromCongrats ?? 1;

  gameDispatch({ type: 'SET_MODE', mode: 'local' });

  gameDispatch({ type: 'SET_MATCH_SETTINGS', settings: { ...(gameState.matchSettings || {}), level: lvl } });

  gameDispatch({ type: 'SET_MATCH', matchId: null, playerId: firebaseAuth.currentUser?.uid ?? null });

  setStartingLevelFromCongrats(null);

  (navigation as any).navigate('CrosswordPuzzleGame');
};

  const findMatch = async () => {
    try {
      setFinding(true);
      await ensureSignedInAnonymously();
      const uid = firebaseAuth.currentUser?.uid;
      if (!uid) {
        setFinding(false);
        notify({ type: 'error', title: 'Sign-in failed', message: 'Could not sign in anonymously.', durationMs: 3000 });
 return;
      }

      const res = await requestQuickMatch('default');
    if (res.status === 'matched' && res.matchId) {
  const id = res.matchId;
  setMatchedId(id);

  try {
    const { chosenLevel, chosenGrid } = await fetchChosenLevelGrid(id);

const clientMatchSettings = gameState?.matchSettings ?? {};
const mergedMatchSettings = {
  timed: !!clientMatchSettings.timed,
  turnSeconds: (clientMatchSettings.turnSeconds ?? 60),
  lives: (clientMatchSettings.lives ?? 3),
  quickMatch: !!clientMatchSettings.quickMatch,
  level: chosenLevel,
};

await ensureMatchInitialized(id, {
  grid: Array.isArray(chosenGrid) ? chosenGrid : (puzzleData.grid ?? []),
  players: { [uid]: true },
  currentPlayerUid: uid,
  scores: { [uid]: 0 },
  matchSettings: mergedMatchSettings,
});
  } catch (e) {
    console.warn('[findMatch] ensureMatchInitialized failed', e);
  }

  try { await joinMatch(id); } catch (e) { console.warn('[findMatch] joinMatch failed', e); }

  gameDispatch({ type: 'SET_MODE', mode: 'pvp' });
  gameDispatch({ type: 'SET_MATCH', matchId: id, playerId: uid });
  setFinding(false);
  (navigation as any).navigate('CrosswordPuzzleGame');
  return;
}

      setFinding(true);
      const levelPath = `matchmaking/levels/default`;
      const levelRef = database().ref(levelPath);
      matchmakingListenerRef.current = levelRef;

      const handler = (snap: any) => {
        const val = snap.val();
        if (!val) return;
        const lastCreated = val.__lastCreated;
        const checkMatches = (mid: string) => {
          const matchMeta = val.matches?.[mid];
          if (!matchMeta) return false;
          const players = matchMeta.players || {};
          if (players[uid]) {
            try { levelRef.off('value', handler); } catch (e) {}
            matchmakingListenerRef.current = null;
            setMatchedId(mid);

(async () => {
  try {
    const { chosenLevel, chosenGrid } = await fetchChosenLevelGrid(mid);

const clientMatchSettings = gameState?.matchSettings ?? {};
const mergedMatchSettings = {
  timed: !!clientMatchSettings.timed,
  turnSeconds: (clientMatchSettings.turnSeconds ?? 60),
  lives: (clientMatchSettings.lives ?? 3),
  quickMatch: !!clientMatchSettings.quickMatch,
  level: chosenLevel,
};

await ensureMatchInitialized(mid, {
  grid: Array.isArray(chosenGrid) ? chosenGrid : (puzzleData.grid ?? []),
  players: { [uid]: true },
  currentPlayerUid: uid,
  scores: { [uid]: 0 },
  matchSettings: mergedMatchSettings,
});
  } catch (err) {
    console.warn('[matchmaking handler] ensureMatchInitialized failed', err);
  }

  try { await joinMatch(mid); } catch (e) { console.warn('[matchmaking handler] joinMatch failed', e); }
  gameDispatch({ type: 'SET_MODE', mode: 'pvp' });
  gameDispatch({ type: 'SET_MATCH', matchId: mid, playerId: uid });
  setFinding(false);
  (navigation as any).navigate('CrosswordPuzzleGame');
})();

            return true;
          }
          return false;
        };

        if (lastCreated && val.matches && val.matches[lastCreated]) {
          if (checkMatches(lastCreated)) return;
        } else if (val.matches) {
          for (const mid of Object.keys(val.matches || {})) {
            if (checkMatches(mid)) return;
          }
        }
      };

      levelRef.on('value', handler);
    } catch (err) {
      console.warn('findMatch failed', err);
      notify({ type: 'error', title: 'Find match failed', message: String(err), durationMs: 3500 });
      setFinding(false);
    }
  };

  const cancelFind = async () => {
    try { await cancelQuickMatch('default'); } catch (e) {}
    try { if (matchmakingListenerRef.current) { matchmakingListenerRef.current.off(); matchmakingListenerRef.current = null; } } catch (e) {}
    setFinding(false);
  };

 const onCreateRoom = async () => {
  setCreating(true);
  try {
    await ensureSignedInAnonymously();

    const level = getRandomLevel();

    const id = await createRoomOnServer({
      maxPlayers: 2,
      matchSettings: { level },
    });

    gameDispatch({ type: 'SET_MATCH_SETTINGS', settings: { level } });
    gameDispatch({ type: 'SET_MODE', mode: 'pvp' });

    notify({ type: 'success', message: `Room created — Level ${level} selected. ID copied to clipboard` });
    navigation.navigate('RoomLobby', { roomId: id });
  } catch (err) {
    console.warn('Create room failed', err);
    notify({ type: 'error', title: 'Error', message: 'Unable to create room.', durationMs: 3000 });
  } finally {
    setCreating(false);
  }
};


  const pasteFromClipboard = async () => {
    try {
      const txt = await Clipboard.getString();
      setJoinRoomId(txt ?? '');
    } catch (e) {
      console.warn('Clipboard read failed', e);
      notify({ type: 'warning', title: 'Clipboard failed', message: 'Could not read clipboard.', durationMs: 3000 });
    }
  };

  const openRoom = () => {
    const id = (joinRoomId ?? '').trim();
    if (!id) {
    notify({ type: 'info', title: 'Enter room id', message: 'Please paste the room id you received.', durationMs: 3500 });
    return;
  }
    (navigation as any).navigate('RoomLobby', { roomId: id });
  };

  return (
    <LinearGradient colors={["#0b1220", "#2b0b3a"]} style={styles.screen}>
      <PlayerId />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View
      style={styles.profileBtn}
    >
      <LinearGradient
        colors={avatarSource ? ['#FFEAA7', '#FFD66B'] : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
        style={styles.profileGradient}
      >
        {avatarSource ? (
          <Image source={avatarSource} style={{ width: '170%', height: '170%', borderRadius: 12, resizeMode: 'cover' }} />
        ) : (
          <Text style={styles.profileEmoji}>{(profile?.name?.charAt(0) ?? '🙂')}</Text>
        )}
      </LinearGradient>
    </View>

    <View style={{ marginLeft: 10 }}>
      <Text style={styles.profileName} numberOfLines={1}>{displayName}</Text>
      {displayFlag ? (
        <Text style={styles.profileCountry}>{displayFlag}</Text>
      ) : null}
    </View>
  </View>

  <TouchableOpacity onPress={() => (navigation as any).navigate('SettingsScreen')}>
    <Text style={styles.smallEmoji}>⚙️</Text>
  </TouchableOpacity>
</View>


        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.bigCard, styles.bigCardLeft]} onPress={onPlayVsAI} activeOpacity={0.9}>
            <View style={styles.cardIconWrap}><Text style={styles.cardIcon}>🤖</Text></View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Play vs AI</Text>
              <Text style={styles.cardDesc}>Casual single-player match. Start instantly.</Text>
            </View>
            <View style={styles.cardChevron}><Text style={{ color: '#fff' }}>›</Text></View>
          </TouchableOpacity>

          <TouchableOpacity
  style={[styles.bigCard, finding ? styles.findingCard : styles.bigCardRight]}
  onPress={() => {
    if (finding) {
      cancelFind();
    } else {
      navigation.navigate('ChooseTimeScreen');
    }
  }}
  activeOpacity={0.9}
>
            <View style={styles.cardIconWrap}>{finding ? <ActivityIndicator color="#fff" /> : <Text style={styles.cardIcon}>⚡️</Text>}</View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{finding ? 'Searching…' : 'Quick Match'}</Text>
              <Text style={styles.cardDesc}>{finding ? 'Looking for opponent' : 'Match with anyone now'}</Text>
              {finding ? <Text style={styles.smallNote}>Tap to cancel</Text> : null}
            </View>
            <View style={styles.cardChevron}><Text style={{ color: '#fff' }}>›</Text></View>
          </TouchableOpacity>
        </View>

        <View style={styles.playFriendsCard}>
          <Text style={styles.sectionTitle}>Play with Friends</Text>
          <TextInput
            value={joinRoomId}
            onChangeText={setJoinRoomId}
            placeholder="Paste room id (e.g. m-abc123...)"
            placeholderTextColor="#9AA0B4"
            style={styles.input}
          />
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.ghostBtn} onPress={openRoom}><Text style={styles.ghostText}>Open Room</Text></TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={pasteFromClipboard}><Text style={styles.ghostText}>Paste</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.ghostBtn, styles.createBtn]} onPress={onCreateRoom} disabled={creating}>
              {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.ghostTextWhite}>Create Room</Text>}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={[styles.smallAction, { backgroundColor: '#FF8C69' }]} onPress={() => (navigation as any).navigate('SpinScreen')}>
            <Text style={styles.smallEmoji}>🎡</Text>
            <Text style={styles.smallLabel}>Daily Spin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.smallAction, { backgroundColor: '#FFD54F' }]} onPress={() => (navigation as any).navigate('DailyBonusScreen')}>
            <Text style={styles.smallEmoji}>🎁</Text>
            <Text style={styles.smallLabel}>Daily Bonus</Text>
          </TouchableOpacity>

          
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 18, paddingBottom: 48 , paddingTop: '10%'},
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  appTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  subtitle: { color: '#bfc5d6', fontSize: 13, marginTop: 4 },
  profileBtn: { width: 56, height: 56, borderRadius: 14, overflow: 'hidden', marginLeft: 8 },
  profileGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileEmoji: { fontSize: 22 },

  actionsGrid: { flexDirection: 'column', gap: 12 },

  bigCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00E7FF',
    backgroundColor: 'rgba(255,255,255,0.01)',
    shadowColor: 'rgba(0,235,255,0.10)',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bigCardLeft: {  },
  bigCardRight: { },
  findingCard: { borderColor: 'rgba(108,76,245,0.45)', backgroundColor: 'rgba(108,76,245,0.08)' },

  cardIconWrap: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: 'rgba(255,255,255,0.02)' },
  cardIcon: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cardDesc: { color: '#c9cfe0', fontSize: 13, marginTop: 4 },
  cardChevron: { marginLeft: 8 },
  smallNote: { color: '#d1d5db', marginTop: 6, fontSize: 12 },

  playFriendsCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#00E7FF',
    shadowColor: 'rgba(0,235,255,0.08)',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { color: '#fff', fontWeight: '800', marginBottom: 8 },
  input: { backgroundColor: '#0b1220', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  ghostBtn: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, minWidth: 100, alignItems: 'center', borderColor: '#00E7FF', borderWidth:1 },
  ghostText: { color: '#e6e9f2' },
  createBtn: { backgroundColor: '#6C4CF5' },
  ghostTextWhite: { color: '#fff' },

  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  smallAction: { flex: 1, marginHorizontal: 6, borderRadius: 12, padding: 12, alignItems: 'center', elevation: 6 },
  smallEmoji: { fontSize: 22, marginBottom: 6 },
  smallLabel: { fontSize: 12, fontWeight: '800' },

    profileName: { color: '#fff', fontWeight: '800', marginBottom: 2, maxWidth: 140 },
  profileCountry: { color: '#DDE5FF', fontSize: 12 },


});
