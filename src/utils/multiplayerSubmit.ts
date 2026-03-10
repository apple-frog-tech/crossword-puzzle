import database from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';
import { submitTurnTransaction } from '../firebase/matchService';
import { solutionGrid, puzzleData } from '../levels/level1';
import type { TurnPlacement } from '../types';
import { Alert } from 'react-native';
import { drawFromAllocation, END_THRESHOLD, splitAllocations } from './endgameAllocation';
import { notify } from '../utils/notificationCenter';


export async function handleSubmitMultiplayer(
  matchId: string,
  placements: TurnPlacement[],
  gameDispatch: any,
  fallbackPlayerId?: string | null
): Promise<{ committed: boolean; snapshot?: any }> {

  if (!matchId) {
    console.warn('handleSubmitMultiplayer called but missing matchId; aborting.');
    return { committed: false };
  }
  const app = getApp();
const firebaseAuth = getAuth(app);
const firebaseDb = getDatabase(app);

  const uid = firebaseAuth.currentUser?.uid ?? (fallbackPlayerId ?? null);
  let payload: any = { placements, playerUid: uid, ts: Date.now() };

  try {
    const ref = database().ref(`matches/${matchId}/state`);
    const snap = await ref.once('value');
    const remote = snap.val() || {};

    console.log(`[preflight] remote snapshot for match ${matchId}:`, {
      grid: !!remote.grid,
      playerHands: !!remote.playerHands,
      scores: !!remote.scores,
    });

    if (remote.currentPlayerUid && remote.currentPlayerUid !== uid) {
      console.warn('[preflight] not our turn on server', remote.currentPlayerUid);
      if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
      if (remote.playerHands && uid && Array.isArray(remote.playerHands[uid])) {
        gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.playerHands[uid] });
      } else if (Array.isArray(remote.letterDeck)) {
        gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.letterDeck });
      }
      if (remote.scores) gameDispatch({ type: 'SET_SCORES', scores: remote.scores });
      notify({ type: 'warning', title: 'State changed', message: 'It is not your turn anymore — board & deck refreshed.' });
      return { committed: false, snapshot: remote };
    }

    const placementsCopy = placements.map(p => ({ ...p }));
    const serverHands = remote.playerHands && typeof remote.playerHands === 'object' ? remote.playerHands : {};
    const myServerHand = (uid && Array.isArray(serverHands[uid])) ? serverHands[uid] : [];
    console.log(`[preflight] server hand ids for uid=${uid}:`, myServerHand.map((t:any)=>t.id).join(','));

    const serverById = new Map<string, any>();
    const serverByChar: Record<string, any[]> = {};
    for (const t of myServerHand) {
      if (!t) continue;
      if (t.id) serverById.set(t.id, t);
      const ch = (t.char ?? '').toString().toUpperCase();
      if (ch) {
        serverByChar[ch] = serverByChar[ch] || [];
        serverByChar[ch].push(t);
      }
    }

    const assignedServerIds = new Set<string>();

    for (const p of placementsCopy) {
      if (p.tileId && serverById.has(p.tileId)) {
        assignedServerIds.add(p.tileId);
        continue;
      }

      const charKey = (p.char ?? '').toString().toUpperCase();
      let foundMatch: any = null;
      if (charKey && Array.isArray(serverByChar[charKey])) {
        for (const cand of serverByChar[charKey]) {
          if (!assignedServerIds.has(cand.id)) { foundMatch = cand; break; }
        }
      }

      if (foundMatch) {
        console.warn('[preflight] remapping missing tileId', p.tileId, '->', foundMatch.id, `(char ${charKey})`);
        p.tileId = foundMatch.id;
        assignedServerIds.add(foundMatch.id);
        continue;
      }

      console.warn('[preflight] tileId not present in server hand and no char match', p.tileId, p.char);
      if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
      if (remote.playerHands && uid && Array.isArray(remote.playerHands[uid])) {
        gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.playerHands[uid] });
      } else if (Array.isArray(remote.letterDeck)) {
        gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.letterDeck });
      }
      if (remote.scores) gameDispatch({ type: 'SET_SCORES', scores: remote.scores });
notify({ type: 'warning', title: 'Sync required', message: 'Your tiles do not match server. Board & deck refreshed.' });
      return { committed: false, snapshot: remote };
    }

    payload = { placements: placementsCopy, playerUid: uid, ts: payload.ts ?? Date.now() };

    for (const p of payload.placements) {
      const cell = remote.grid?.[p.row]?.[p.col];
      if (!cell) {
        console.warn('[preflight] invalid cell', p);
        if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
notify({ type: 'warning', message: 'Target cell changed on server. Board refreshed.' });
        return { committed: false, snapshot: remote };
      }
      if (cell.type === 'letter' && cell.placed) {
        console.warn('[preflight] someone already placed there', p, cell);
        if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
       notify({ type: 'warning', message: 'Turn not committed — board refreshed (conflict).' });
        return { committed: false, snapshot: remote };
      }
    }
  } catch (preErr) {
    console.warn('[preflight] failed', preErr);
  }

  const HAND_SIZE = 5;

  const applyFn = (currentState: any = {}, payloadArg: any) => {
    const next: any = {
      grid: Array.isArray(currentState.grid) ? currentState.grid.map((r:any)=>r.map((c:any)=>({...c}))) : JSON.parse(JSON.stringify(puzzleData.grid)),
      players: currentState.players ?? {},
      playerHands: (currentState.playerHands && typeof currentState.playerHands === 'object') ? JSON.parse(JSON.stringify(currentState.playerHands)) : {},
      drawPile: Array.isArray(currentState.drawPile) ? [...currentState.drawPile] : [],
      currentPlayerUid: currentState.currentPlayerUid ?? null,
      scores: currentState.scores ?? {},
      completedWords: Array.isArray(currentState.completedWords) ? [...currentState.completedWords] : [],
      turnPlacements: Array.isArray(currentState.turnPlacements) ? [...currentState.turnPlacements] : [],
    };

    const myUid = payloadArg.playerUid;
    if (!myUid) {
      console.warn('[applyFn] abort: submitter has no uid (not signed in?)');
      return undefined;
    }

    if (!next.currentPlayerUid) {
      console.warn('[applyFn] abort: server missing currentPlayerUid');
      return undefined;
    }
    if (next.currentPlayerUid !== myUid) {
      console.warn('[applyFn] abort: not the submitter\'s turn (server says currentPlayerUid != submitter)');
      return undefined;
    }

    const myHand: { id: string; char: string }[] = Array.isArray(next.playerHands[myUid]) ? [...next.playerHands[myUid]] : [];

    const placementsArr: any[] = Array.isArray(payloadArg.placements) ? payloadArg.placements : [];
    if (placementsArr.length === 0) {
      console.warn('[applyFn] abort: no placements provided');
      return undefined;
    }

    for (const p of placementsArr) {
      if (typeof p.row !== 'number' || typeof p.col !== 'number' || !p.tileId) {
        console.warn('[applyFn] abort: invalid placement', p);
        return undefined;
      }
      if (!next.grid[p.row] || typeof next.grid[p.row][p.col] === 'undefined') {
        console.warn('[applyFn] abort: placement out of bounds', p);
        return undefined;
      }
      const serverCell = next.grid[p.row][p.col];
      if (!serverCell) {
        console.warn('[applyFn] abort: server cell missing', p);
        return undefined;
      }
      if (serverCell.type === 'letter' && serverCell.placed) {
        console.warn('[applyFn] abort: target cell already placed on server', { row: p.row, col: p.col, serverCell });
        return undefined;
      }

      const ownedIdx = myHand.findIndex((t) => t.id === p.tileId);
      if (ownedIdx === -1) {
        console.warn('[applyFn] abort: submitter does not own tileId', p.tileId);
        return undefined;
      }
    }

    const usedIds: string[] = [];
    const returns: { id?:string; char: string }[] = [];
    let scoreDeltaForThisTurn = 0;

    placementsArr.forEach((p:any) => {
  const expected = (solutionGrid[p.row] && solutionGrid[p.row][p.col]) ? solutionGrid[p.row][p.col] : '';
  const placedChar = (p.char || '').toUpperCase();
  const isCorrect = expected && placedChar === expected.toUpperCase();

  p.correct = !!isCorrect;

  if (isCorrect) {
    next.grid[p.row][p.col] = { ...next.grid[p.row][p.col], text: p.char, type: 'letter', placed: true, placedBy: myUid };
    scoreDeltaForThisTurn += 1;
  } else {
    next.grid[p.row][p.col] = { ...next.grid[p.row][p.col], text: '', type: 'empty', placed: false };
    returns.push({ id: p.tileId, char: p.char });
  }
  usedIds.push(p.tileId);
});


const newMyHand = myHand.filter((t) => !usedIds.includes(t.id));
let returnedTiles = returns.map(r => ({ id: r.id ?? `${(r.char||'')}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`, char: (r.char || '').toUpperCase() }));

let newDrawPile = Array.isArray(next.drawPile) ? [...next.drawPile] : [];

if ((!next.playerAllocations || Object.keys(next.playerAllocations).length === 0)
    && Array.isArray(newDrawPile) && newDrawPile.length <= END_THRESHOLD) {
  const playerUids = Object.keys(next.players || {});
  next.playerAllocations = splitAllocations(newDrawPile, playerUids);
  newDrawPile = [];
}

for (const t of returnedTiles) {
  if (newMyHand.length < HAND_SIZE) {
    newMyHand.push(t);
  } else {
    if (next.playerAllocations && Array.isArray(next.playerAllocations[myUid])) {
      next.playerAllocations[myUid].push(t);
    } else {
      newDrawPile.push(t);
    }
  }
}

if (next.playerAllocations && Array.isArray(next.playerAllocations[myUid])) {
  const needed = HAND_SIZE - newMyHand.length;
  if (needed > 0) {
    const drawn = drawFromAllocation(next.playerAllocations, myUid, needed);
    for (const d of drawn) newMyHand.push(d);
  }
} else {
  while (newMyHand.length < HAND_SIZE && newDrawPile.length > 0) {
    const nextTile = newDrawPile.shift();
    if (nextTile) newMyHand.push(nextTile);
  }
}


    next.playerHands = { ...(next.playerHands || {}), [myUid]: newMyHand };
    next.drawPile = newDrawPile;
    next.scores = { ...(next.scores || {}), [myUid]: (next.scores?.[myUid] ?? 0) + scoreDeltaForThisTurn };
    next.turnPlacements = (next.turnPlacements || []).concat([{ by: myUid, placements: placementsArr, ts: payloadArg.ts ?? Date.now() }]);

    const playerUids = Object.keys(next.players || {});
    if (playerUids.length > 0) {
      const idx = playerUids.indexOf(myUid);
      const nextIdx = (idx === -1) ? 0 : ((idx + 1) % playerUids.length);
      next.currentPlayerUid = playerUids[nextIdx];
    } else {
      next.currentPlayerUid = myUid;
    }

    next.lastActionTs = Date.now();
    return next;
  };

  try {
    const { committed, snapshot } = await submitTurnTransaction(matchId, payload, applyFn);
    console.log('submitTurnTransaction result', { committed, snapshot });

    if (!committed) {
      console.warn('Transaction aborted - conflict or invalid turn');
      notify({ type: 'warning', title: 'Turn not committed', message: 'Someone placed a letter in one of the same cells, so your move was not applied. The board has been refreshed.', durationMs: 4500 });

      if (snapshot && typeof snapshot.val === 'function' && snapshot.exists && snapshot.exists()) {
        const remote = snapshot.val();
        if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
        const me: string | null = firebaseAuth.currentUser?.uid ?? fallbackPlayerId ?? null;
        if (me && remote.playerHands && typeof remote.playerHands === 'object' && Array.isArray(remote.playerHands[me])) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.playerHands[me] });
        } else if (Array.isArray(remote.letterDeck)) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.letterDeck });
        }
        if (remote.scores) gameDispatch({ type: 'SET_SCORES', scores: remote.scores });
        if (remote.completedWords) gameDispatch({ type: 'SET_COMPLETED_WORDS', completed: remote.completedWords });
      } else if (snapshot) {
        const remote = snapshot;
        if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
        const me2: string | null = firebaseAuth.currentUser?.uid ?? fallbackPlayerId ?? null;
        if (me2 && remote.playerHands && typeof remote.playerHands === 'object' && Array.isArray(remote.playerHands[me2])) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.playerHands[me2] });
        } else if (Array.isArray(remote.letterDeck)) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.letterDeck });
        }
        if (remote.scores) gameDispatch({ type: 'SET_SCORES', scores: remote.scores });
        if (remote.completedWords) gameDispatch({ type: 'SET_COMPLETED_WORDS', completed: remote.completedWords });
      }

      return { committed: false, snapshot: snapshot ? (snapshot.val ? snapshot.val() : snapshot) : undefined };
    }

    notify({ type: 'success', message: 'Turn committed' });
    return { committed: true, snapshot: snapshot ? (snapshot.val ? snapshot.val() : snapshot) : undefined };

  } catch (err) {
    console.warn('submitTurnTransaction failed', err);
    notify({ type: 'error', message: String(err) ?? 'Turn error' });
    return { committed: false };
  }
}

export async function handlePassMultiplayer(
  matchId: string,
  gameDispatch: any,
  fallbackPlayerId?: string | null
): Promise<{ committed: boolean; snapshot?: any }> {
  const app = getApp();
const firebaseAuth = getAuth(app);
const firebaseDb = getDatabase(app);
  if (!matchId) {
    console.warn('handlePassMultiplayer called but missing matchId; aborting.');
    return { committed: false };
  }
  const uid = firebaseAuth.currentUser?.uid ?? (fallbackPlayerId ?? null);
  if (!uid) {
    console.warn('handlePassMultiplayer: no uid available');
    return { committed: false };
  }

  const payload = { pass: true, playerUid: uid, ts: Date.now() };

  const applyFn = (currentState: any = {}, payloadArg: any) => {
    const next: any = {
      grid: Array.isArray(currentState.grid) ? currentState.grid.map((r:any)=>r.map((c:any)=>({...c}))) : null,
      players: currentState.players ?? {},
      playerHands: (currentState.playerHands && typeof currentState.playerHands === 'object') ? JSON.parse(JSON.stringify(currentState.playerHands)) : {},
      drawPile: Array.isArray(currentState.drawPile) ? [...currentState.drawPile] : [],
      currentPlayerUid: currentState.currentPlayerUid ?? null,
      scores: currentState.scores ?? {},
      completedWords: Array.isArray(currentState.completedWords) ? [...currentState.completedWords] : [],
      turnPlacements: Array.isArray(currentState.turnPlacements) ? [...currentState.turnPlacements] : [],
    };

    const myUid = payloadArg.playerUid;
    if (!myUid) return undefined;
    if (!next.currentPlayerUid) return undefined;
    if (next.currentPlayerUid !== myUid) {
      return undefined;
    }

    const playerUids = Object.keys(next.players || {});
    if (playerUids.length === 0) {
      next.currentPlayerUid = myUid;
    } else {
      const idx = playerUids.indexOf(myUid);
      const nextIdx = (idx === -1) ? 0 : ((idx + 1) % playerUids.length);
      next.currentPlayerUid = playerUids[nextIdx];
    }

    next.turnPlacements = (next.turnPlacements || []).concat([{ by: myUid, placements: [], ts: payloadArg.ts ?? Date.now(), type: 'pass' }]);

    next.lastActionTs = Date.now();
    return next;
  };

  try {
    const { committed, snapshot } = await submitTurnTransaction(matchId, payload, applyFn);
    if (!committed) {
      if (snapshot && typeof snapshot.val === 'function' && snapshot.exists && snapshot.exists()) {
        const remote = snapshot.val();
        if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
        const me: string | null = firebaseAuth.currentUser?.uid ?? fallbackPlayerId ?? null;
        if (me && remote.playerHands && typeof remote.playerHands === 'object' && Array.isArray(remote.playerHands[me])) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.playerHands[me] });
        } else if (Array.isArray(remote.letterDeck)) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.letterDeck });
        }
        if (remote.scores) gameDispatch({ type: 'SET_SCORES', scores: remote.scores });
        if (remote.completedWords) gameDispatch({ type: 'SET_COMPLETED_WORDS', completed: remote.completedWords });
      } else if (snapshot) {
        const remote = snapshot;
        if (remote.grid) gameDispatch({ type: 'SET_GRID', grid: remote.grid });
        const me2: string | null = firebaseAuth.currentUser?.uid ?? fallbackPlayerId ?? null;
        if (me2 && remote.playerHands && typeof remote.playerHands === 'object' && Array.isArray(remote.playerHands[me2])) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.playerHands[me2] });
        } else if (Array.isArray(remote.letterDeck)) {
          gameDispatch({ type: 'SET_LETTER_DECK', deck: remote.letterDeck });
        }
        if (remote.scores) gameDispatch({ type: 'SET_SCORES', scores: remote.scores });
        if (remote.completedWords) gameDispatch({ type: 'SET_COMPLETED_WORDS', completed: remote.completedWords });
      }

      return { committed: false, snapshot: snapshot ? (snapshot.val ? snapshot.val() : snapshot) : undefined };
    }

    return { committed: true, snapshot: snapshot ? (snapshot.val ? snapshot.val() : snapshot) : undefined };
  } catch (err) {
    console.warn('handlePassMultiplayer transaction failed', err);
    notify({ type: 'error', title: 'Turn pass error', message: 'Failed to pass turn to opponent. Try reconnecting.', durationMs: 4500 });
    return { committed: false };
  }
}


export async function handleEndMatchMultiplayer(
  matchId: string,
  opts: { winnerUid?: string; finalScores?: Record<string, number> } = {}
): Promise<{ committed: boolean; snapshot?: any }> {
  if (!matchId) {
    console.warn('handleEndMatchMultiplayer called but missing matchId; aborting.');
    return { committed: false };
  }

  const { winnerUid = null, finalScores = undefined } = opts;
  const ref = database().ref(`matches/${matchId}/state`);

  try {
    const result = await ref.transaction((currentState: any) => {
      const s = currentState ?? {};
      if (s.finished) {
        return;
      }

      const playerUids = s.players && typeof s.players === 'object' ? Object.keys(s.players) : [];
      const loserUid = playerUids.find((u: string) => u !== winnerUid) ?? null;

      s.finished = {
        winnerUid: winnerUid ?? null,
        loserUid,
        endedAt: Date.now(),
        finalScores: finalScores ?? s.scores ?? null,
      };

      s.lastActionTs = Date.now();

      return s;
    },undefined,  false);
    if (!result || !result.committed) {
      console.warn('handleEndMatchMultiplayer: transaction not committed or returned falsey result', result);
      return { committed: false, snapshot: result ? result.snapshot : undefined };
    }

    return { committed: true, snapshot: result.snapshot };
  } catch (err) {
    console.warn('handleEndMatchMultiplayer transaction failed', err);
    return { committed: false };
  }
}

export async function handleExpireMultiplayer(matchId: string, loserUid: string) {
  const ref = database().ref(`/matches/${matchId}`);
  try {
    const res = await ref.transaction((current: any) => {
      if (!current) return current; 

      const livesObj = current.playerLives || {};
      const currentLives = typeof livesObj[loserUid] === 'number' ? livesObj[loserUid] : (current.matchSettings?.lives ?? 3);
      const newLives = Math.max(0, currentLives - 1);
      livesObj[loserUid] = newLives;

      current.playerLives = livesObj;

      if (newLives <= 0) {
        const players = current.players || {};
        const otherUid = Object.keys(players).find(u => u !== loserUid) ?? null;
        current.matchOver = true;
        current.winnerUid = otherUid ?? null;
        current.endedAt = Date.now();
      }

      return current;
    }, undefined, false); 

    return { committed: !!res?.committed, winnerUid: res?.snapshot?.val()?.winnerUid ?? null };
  } catch (e) {
    console.warn('handleExpireMultiplayer transaction failed', e);
    return { committed: false };
  }
}