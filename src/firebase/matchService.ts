import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { solutionGrid, puzzleData } from '../levels/level1';
import { getDatabase, ref, update } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';

function buildTilePoolFromSolution(
  solutionGrid: string[][],
  prefilledGrid?: any[][],
) {
  const freq: Record<string, number> = {};
  for (let r = 0; r < solutionGrid.length; r++) {
    for (let c = 0; c < solutionGrid[r].length; c++) {
      const ch = (solutionGrid[r][c] ?? '').toString().toUpperCase();
      if (!ch) continue;
      freq[ch] = (freq[ch] || 0) + 1;
    }
  }

  if (Array.isArray(prefilledGrid)) {
    for (let r = 0; r < prefilledGrid.length; r++) {
      for (let c = 0; c < prefilledGrid[r].length; c++) {
        const cell = prefilledGrid[r][c];
        if (!cell) continue;
        if ((cell.type === 'letter' || cell.placed === true) && cell.text) {
          const ch = (cell.text ?? '').toString().toUpperCase();
          if (ch && typeof freq[ch] === 'number' && freq[ch] > 0) {
            freq[ch] = freq[ch] - 1;
          }
        }
      }
    }
  }

  const pool: { id: string; char: string }[] = [];
  Object.entries(freq).forEach(([ch, count]) => {
    for (let i = 0; i < Math.max(0, count); i++) {
      pool.push({
        id: `${ch}-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 6)}`,
        char: ch,
      });
    }
  });

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

function dealHands(
  pool: { id: string; char: string }[],
  playerUids: string[],
  handSize = 5,
) {
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const hands: Record<string, { id: string; char: string }[]> = {};
  for (const uid of playerUids) hands[uid] = [];
  let idx = 0;
  for (const uid of playerUids) {
    for (let i = 0; i < handSize && idx < shuffled.length; i++, idx++) {
      hands[uid].push(shuffled[idx]);
    }
  }
  const drawPile = shuffled.slice(idx);
  return { hands, drawPile };
}

export async function updateMatchSettings(
  matchId: string,
  settings: Record<string, any>,
) {
  const db = getDatabase(getApp());
  await update(ref(db, `matches/${matchId}/matchSettings`), settings);
}

export async function createMatch(
  initialState: any = {},
  playerUids?: string[],
) {
  const uid = auth().currentUser?.uid ?? null;
  const matchId = `m-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  const metaRef = database().ref(`matches/${matchId}/meta`);
  const stateRef = database().ref(`matches/${matchId}/state`);

  let playersList: string[] = [];
  if (Array.isArray(playerUids) && playerUids.length > 0)
    playersList = playerUids;
  else if (uid) playersList = [uid];

  const meta = {
    createdBy: uid,
    createdAt: Date.now(),
    players: playersList.reduce((acc, p) => ({ ...acc, [p]: true }), {}),
  };

  await metaRef.set(meta);

  const prefilledGrid = initialState.grid ?? puzzleData.grid ?? undefined;
  const pool = buildTilePoolFromSolution(solutionGrid, prefilledGrid);
  const { hands, drawPile } = dealHands(pool, playersList, 5);

  const seededState = {
    grid: puzzleData.grid,
    playerHands: hands,
    drawPile,
    currentPlayerUid: playersList[0] ?? uid ?? null,
    players: playersList.reduce(
      (a, p) => ({ ...a, [p]: { joinedAt: Date.now() } }),
      {},
    ),
    scores: playersList.reduce((a, p) => ({ ...a, [p]: 0 }), {}),
    turnPlacements: [],
    lastActionTs: Date.now(),
    ...initialState,
  };

  await stateRef.set(seededState);

  return matchId;
}

export async function joinMatch(matchId: string) {
  const uid = auth().currentUser?.uid;
  if (!uid) throw new Error('not-signed-in');

  await database().ref(`matches/${matchId}/meta/players/${uid}`).set(true);

  await database()
    .ref(`matches/${matchId}/state/players/${uid}`)
    .set({ joinedAt: Date.now() })
    .catch(() => {});

  const snap = await database().ref(`matches/${matchId}/state`).once('value');
  return snap.val();
}

export function listenToMatchState(matchId: string, cb: (state: any) => void) {
  const ref = database().ref(`matches/${matchId}/state`);
  const handler = (snap: any) => {
    console.log(
      '[matchService] onValue',
      matchId,
      'snapshot:',
      snap ? snap.val() : null,
    );
    cb(snap.val());
  };
  ref.on('value', handler);
  console.log('[matchService] Listening to match', matchId);
  return () => ref.off('value', handler);
}

export async function submitTurnTransaction(
  matchId: string,
  payload: any,
  applyFn: (cur: any, payloadArg: any) => any,
) {
  if (!matchId) throw new Error('missing matchId');
  const ref = database().ref(`matches/${matchId}/state`);

  return new Promise<{ committed: boolean; snapshot: any }>(
    (resolve, reject) => {
      ref.transaction(
        (currentState: any) => {
          try {
            const next = applyFn(currentState, payload);
            if (typeof next === 'undefined' || next === null) return undefined;
            return next;
          } catch (err) {
            console.warn('applyFn threw:', err);
            return undefined;
          }
        },
        (err: any, committed: boolean, snapshot: any) => {
          if (err) {
            console.warn('[matchService] transaction error', err);
            return reject(err);
          }
          console.log('[matchService] transaction finished', {
            matchId,
            committed,
            snapshotVal: snapshot ? snapshot.val() : null,
          });
          return resolve({ committed, snapshot });
        },
        false,
      );
    },
  );
}

export async function requestQuickMatch(level: string = 'default') {
  const uid = auth().currentUser?.uid;
  if (!uid) throw new Error('not-signed-in');

  const levelRef = database().ref(`matchmaking/levels/${level}`);

  return new Promise<
    { status: 'waiting' } | { status: 'matched'; matchId: string }
  >((resolve, reject) => {
    levelRef.transaction(
      (current: any) => {
        if (!current)
          current = { waiting: {}, matches: {}, __lastCreated: null };

        const waiting = current.waiting || {};
        const other = Object.keys(waiting).find(k => k !== uid);

        if (other) {
          const matchId = `m-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 6)}`;
          current.matches = current.matches || {};
          current.matches[matchId] = {
            players: { [uid]: true, [other]: true },
            createdAt: Date.now(),
          };
          delete waiting[other];
          delete waiting[uid];
          current.waiting = waiting;
          current.__lastCreated = matchId;
          return current;
        } else {
          waiting[uid] = { ts: Date.now() };
          current.waiting = waiting;
          current.__lastCreated = null;
          return current;
        }
      },
      async (err: any, committed: boolean, snapshot: any) => {
        if (err) return reject(err);
        if (!committed) return resolve({ status: 'waiting' });
        const val = snapshot.val();
        const last = val?.__lastCreated ?? null;
        if (last) {
          return resolve({ status: 'matched', matchId: last });
        } else {
          try {
            await database()
              .ref(`matchmaking/levels/${level}/waiting/${uid}`)
              .onDisconnect()
              .remove();
          } catch (e) {}
          return resolve({ status: 'waiting' });
        }
      },
      false,
    );
  });
}

export async function cancelQuickMatch(level: string = 'default') {
  const uid = auth().currentUser?.uid;
  if (!uid) return;
  await database()
    .ref(`matchmaking/levels/${level}/waiting/${uid}`)
    .remove()
    .catch(() => {});
}

export async function ensureMatchInitialized(
  matchId: string,
  initialState: any = {},
) {
  const uid = auth().currentUser?.uid;
  if (!uid) throw new Error('not signed in');

  await database().ref(`matches/${matchId}/meta/players/${uid}`).set(true);

  const ref = database().ref(`matches/${matchId}/state`);

  await ref.transaction(cur => {
    if (cur) return cur;

    const players = initialState.players ?? { [uid]: { joinedAt: Date.now() } };
    const playerUids = Object.keys(players);

    let playerHands = {};
    let drawPile = [];

    const prefilledGrid = Array.isArray(initialState.grid)
      ? initialState.grid
      : undefined;
    const pool = buildTilePoolFromSolution(solutionGrid, prefilledGrid);
    const dealt = dealHands(pool, playerUids, 5);

    playerHands = dealt.hands;
    drawPile = dealt.drawPile;

    return {
      currentPlayerUid: playerUids[0] ?? uid,
      grid: initialState.grid ?? [],
      players,
      playerHands,
      drawPile,
      scores: playerUids.reduce((a, p) => ({ ...a, [p]: 0 }), {}),
      turnPlacements: [],
      lastActionTs: Date.now(),
      ...initialState,
    };
  });
}

export async function setPresence(
  matchId: string | null,
  uid: string | null,
  online: boolean,
) {
  try {
    if (!matchId || !uid) return;
    const ref = database().ref(`matches/${matchId}/presence/${uid}`);

    if (online) {
      try {
        ref.onDisconnect().remove();
      } catch (e) {}
      await ref.set({ online: true, ts: Date.now() });
    } else {
      try {
        ref.onDisconnect().cancel();
      } catch (e) {}
      await ref.remove();
    }
  } catch (err) {
    console.warn('setPresence failed', err);
  }
}

