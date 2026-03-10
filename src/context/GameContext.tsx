import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import type { GridCell, DeckItem, TurnPlacement, Scores } from '../types';
import {
  listenToMatchState,
  setPresence,
  joinMatch,
  createMatch,
} from '../firebase/matchService';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';

const STORAGE_PREFIX = 'game_state:';

export type GameState = {
  matchId: string | null;
  playerId: string | null;
  grid: GridCell[][];
  letterDeck: DeckItem[];
  selectedLetterIndex: number | null;
  currentPlayer: 'You' | 'Opponent';
  scores: Scores;
  gameHistory: string[];
  completedWords: string[];
  turnPlacements: TurnPlacement[];
  tentativePlacements: TurnPlacement[];
  isSubmitting: boolean;
  aiInProgress: boolean;
  lastActionTs?: number;
  tileLayerVersion: number;
  boardVersion: number;
  reservedVersion: number;
  mode: 'local' | 'pvp';
  playerAllocations?: Record<string, { id: string; char: string }[]>;
  matchSettings?: {
    timed?: boolean;
    turnSeconds?: number;
    lives?: number;
    quickMatch?: boolean;
    level?: number;
  };
  players?: Record<string, any>;
  matchType?: string;
  playerLives?: Record<string, number>;
  finished?: {
    winnerUid?: string | null;
    loserUid?: string | null;
    endedAt?: number;
    finalScores?: Record<string, number> | null;
  } | null;
  winnerUid?: string | null;
};

const initialGrid: GridCell[][] = [];
const initialState: GameState = {
  matchId: null,
  playerId: null,
  grid: initialGrid,
  letterDeck: [],
  selectedLetterIndex: null,
  currentPlayer: 'You',
  scores: { You: 0, Opponent: 0 },
  gameHistory: [],
  completedWords: [],
  turnPlacements: [],
  tentativePlacements: [],
  isSubmitting: false,
  aiInProgress: false,
  tileLayerVersion: 0,
  boardVersion: 0,
  reservedVersion: 0,
  mode: 'local',
  matchSettings: {
    timed: false,
    turnSeconds: 60,
    lives: 3,
    quickMatch: false,
    level: 1,
  },
  players: {},
  matchType: undefined,
};

type Action =
  | { type: 'SET_MATCH'; matchId: string | null; playerId?: string | null }
  | { type: 'SET_MODE'; mode: 'local' | 'pvp' }
  | { type: 'LOAD_STATE'; state: Partial<GameState> }
  | { type: 'SET_GRID'; grid: GridCell[][] }
  | { type: 'SET_LETTER_DECK'; deck: DeckItem[] }
  | { type: 'SET_SELECTED_INDEX'; idx: number | null }
  | { type: 'SET_CURRENT_PLAYER'; player: 'You' | 'Opponent' }
  | { type: 'SET_SCORES'; scores: Scores }
  | { type: 'INCREMENT_SCORE'; playerId: keyof Scores; delta: number }
  | { type: 'PUSH_GAME_HISTORY'; text: string }
  | { type: 'SET_COMPLETED_WORDS'; completed: string[] }
  | { type: 'SET_TURN_PLACEMENTS'; placements: TurnPlacement[] }
  | { type: 'SET_TENTATIVE_PLACEMENTS'; placements: TurnPlacement[] }
  | { type: 'SET_FLAG'; key: 'isSubmitting' | 'aiInProgress'; value: boolean }
  | {
      type: 'BUMP';
      key: 'tileLayerVersion' | 'boardVersion' | 'reservedVersion';
    }
  | { type: 'SET_PLAYER_ALLOCATIONS'; allocations: Record<string, any[]> }
  | {
      type: 'SET_MATCH_SETTINGS';
      settings: {
        timed?: boolean;
        turnSeconds?: number;
        lives?: number;
        quickMatch?: boolean;
        level?: number;
      };
    };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_MATCH':
      return {
        ...state,
        matchId: action.matchId ?? null,
        playerId: action.playerId ?? state.playerId,
      };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    case 'SET_GRID':
      return { ...state, grid: action.grid };
    case 'SET_LETTER_DECK':
      return { ...state, letterDeck: action.deck };
    case 'SET_SELECTED_INDEX':
      return { ...state, selectedLetterIndex: action.idx };
    case 'SET_CURRENT_PLAYER':
      return { ...state, currentPlayer: action.player };
    case 'SET_SCORES':
      return { ...state, scores: action.scores };
    case 'INCREMENT_SCORE':
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.playerId]:
            (state.scores[action.playerId] || 0) + action.delta,
        },
      };
    case 'PUSH_GAME_HISTORY':
      return { ...state, gameHistory: [...state.gameHistory, action.text] };
    case 'SET_COMPLETED_WORDS':
      return { ...state, completedWords: action.completed };
    case 'SET_TURN_PLACEMENTS':
      return { ...state, turnPlacements: action.placements };
    case 'SET_TENTATIVE_PLACEMENTS':
      return { ...state, tentativePlacements: action.placements };
    case 'SET_FLAG':
      return { ...state, [action.key]: action.value } as GameState;
    case 'BUMP':
      return {
        ...state,
        [action.key]: (state as any)[action.key] + 1,
      } as GameState;
    case 'SET_PLAYER_ALLOCATIONS':
      return { ...state, playerAllocations: action.allocations };
    case 'SET_MATCH_SETTINGS':
      return {
        ...state,
        matchSettings: { ...(state.matchSettings || {}), ...action.settings },
      };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const app = getApp();
  const firebaseAuth = getAuth(app);
  const firebaseDb = getDatabase(app);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const save = useRef(
    debounce(async (s: GameState) => {
      try {
        if (!s.matchId) return;
        if (s.mode === 'pvp') return;
        await AsyncStorage.setItem(
          STORAGE_PREFIX + s.matchId,
          JSON.stringify(s),
        );
      } catch (e) {
        console.warn('Game save failed', e);
      }
    }, 600),
  ).current;

  useEffect(() => {
    (async () => {
      if (!state.matchId) return;

      if (state.mode === 'pvp') {
        return;
      }

      try {
        const raw = await AsyncStorage.getItem(STORAGE_PREFIX + state.matchId);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<GameState>;
          dispatch({ type: 'LOAD_STATE', state: parsed });
        }
      } catch (e) {
        console.warn('Failed to load saved game', e);
      }
    })();
  }, [state.matchId, state.mode]);

  useEffect(() => {
    save(state);
  }, [state, save]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let mounted = true;

    const handleRemoteState = (remoteState: any) => {
      if (!remoteState) return;
      const partial: Partial<GameState> = {};

      if (Array.isArray(remoteState.grid)) partial.grid = remoteState.grid;

      const meUid =
        firebaseAuth.currentUser?.uid ?? state.playerId ?? undefined;
      if (!state.playerId && typeof meUid === 'string')
        partial.playerId = meUid;

      const normalizeTile = (t: any, originalIndex?: number) => {
        if (!t) return null;
        const id =
          t.id ?? t.key ?? t.uid ?? (typeof t === 'string' ? t : undefined);
        const char = ((t.char ?? t.ch ?? '') + '').toString().toUpperCase();
        if (!id || !char) return null;
        const oi =
          typeof originalIndex === 'number'
            ? originalIndex
            : typeof t.originalIndex === 'number'
            ? t.originalIndex
            : -1;
        return { id: String(id), char, originalIndex: oi } as DeckItem;
      };
      const normalizeServerHand = (raw: any): DeckItem[] | undefined => {
        if (!raw) return undefined;
        if (Array.isArray(raw))
          return raw
            .map((r, idx) => normalizeTile(r, idx))
            .filter((x): x is DeckItem => !!x);
        if (typeof raw === 'object') {
          try {
            const keys = Object.keys(raw)
              .map(k => ({ k, n: Number(k) }))
              .sort((a, b) =>
                Number.isFinite(a.n) && Number.isFinite(b.n)
                  ? a.n - b.n
                  : a.k.localeCompare(b.k),
              )
              .map(x => x.k);
            const arr = keys
              .map((k, idx) => normalizeTile(raw[k], Number(k ?? idx)))
              .filter((x): x is DeckItem => !!x);
            if (arr.length) return arr;
          } catch (_) {
            /* fallthrough */
          }
          return Object.values(raw)
            .map((v: any, idx: number) => normalizeTile(v, idx))
            .filter((x): x is DeckItem => !!x);
        }
        return undefined;
      };

      try {
        console.log(
          '[GameContext] remoteState.playerHands keys:',
          remoteState.playerHands
            ? Object.keys(remoteState.playerHands)
            : 'no playerHands',
          'meUid:',
          meUid,
          'remoteState.letterDeck present:',
          typeof remoteState.letterDeck !== 'undefined',
        );

        let appliedDeck: DeckItem[] | undefined = undefined;

        if (
          remoteState.playerHands &&
          typeof remoteState.playerHands === 'object'
        ) {
          if (
            typeof meUid === 'string' &&
            Object.prototype.hasOwnProperty.call(remoteState.playerHands, meUid)
          ) {
            appliedDeck =
              normalizeServerHand(remoteState.playerHands[meUid]) ?? [];
            console.log(
              '[GameContext] using playerHands[meUid], length=',
              appliedDeck.length,
            );
          } else {
            console.log(
              '[GameContext] playerHands present but no entry for meUid -> not overwriting local deck',
            );
          }
        }
        if (
          appliedDeck === undefined &&
          typeof remoteState.letterDeck !== 'undefined'
        ) {
          appliedDeck = normalizeServerHand(remoteState.letterDeck) ?? [];
          console.log(
            '[GameContext] using global letterDeck, length=',
            (appliedDeck && appliedDeck.length) || 0,
          );
        }

        if (appliedDeck !== undefined) {
          partial.letterDeck = appliedDeck;
        }
      } catch (e) {
        console.warn('[GameContext] playerHands normalization failed', e);
      }

      try {
        if (
          typeof remoteState.currentPlayerUid !== 'undefined' &&
          remoteState.currentPlayerUid !== null &&
          typeof meUid === 'string'
        ) {
          if (
            remoteState.currentPlayerUid === meUid &&
            remoteState.playerHands &&
            Object.prototype.hasOwnProperty.call(remoteState.playerHands, meUid)
          ) {
            const forced =
              normalizeServerHand(remoteState.playerHands[meUid]) ?? [];
            partial.letterDeck = forced;
            console.log(
              '[GameContext] forced apply deck on turn arrival, length=',
              forced.length,
            );
          }
        }
      } catch (e) {}

      if (remoteState.scores) partial.scores = remoteState.scores;
      if (Array.isArray(remoteState.completedWords))
        partial.completedWords = remoteState.completedWords;
      if (Array.isArray(remoteState.turnPlacements))
        partial.turnPlacements = remoteState.turnPlacements;
      if (
        remoteState.playerAllocations &&
        typeof remoteState.playerAllocations === 'object'
      )
        partial.playerAllocations = remoteState.playerAllocations;
      if (remoteState.matchSettings) {
        partial.matchSettings = {
          ...(state.matchSettings || {}),
          ...(remoteState.matchSettings || {}),
        };
      }
      if (typeof remoteState.lastActionTs !== 'undefined')
        partial.lastActionTs = remoteState.lastActionTs;
      if (remoteState.playerLives)
        partial.playerLives = remoteState.playerLives;
      if (remoteState.finished) partial.finished = remoteState.finished;
      if (typeof remoteState.winnerUid !== 'undefined')
        partial.winnerUid = remoteState.winnerUid;

      if (
        typeof remoteState.currentPlayerUid !== 'undefined' &&
        remoteState.currentPlayerUid !== null
      ) {
        try {
          const me = firebaseAuth.currentUser?.uid ?? state.playerId;
          partial.currentPlayer =
            remoteState.currentPlayerUid === me ? 'You' : 'Opponent';
        } catch (e) {}
      }

      if (Object.keys(partial).length > 0 && mounted) {
        dispatch({ type: 'LOAD_STATE', state: partial });
      }
    };

    const attachSafely = async () => {
      const matchId = state.matchId;
      if (!matchId || state.mode !== 'pvp') return;

      let triesAuth = 0;
      while (!firebaseAuth.currentUser && triesAuth < 10) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 200));
        triesAuth++;
      }
      if (!firebaseAuth.currentUser) {
        console.warn('[GameContext] auth not ready, abort attach');
        return;
      }

      const MAX_JOIN_ATTEMPTS = 4;
      for (let attempt = 1; attempt <= MAX_JOIN_ATTEMPTS; attempt++) {
        try {
          await joinMatch(matchId);
          console.log(
            `[GameContext] joinMatch succeeded on attempt ${attempt} for ${matchId}`,
          );

          unsubscribe = listenToMatchState(matchId, remoteState => {
            try {
              handleRemoteState(remoteState);
            } catch (err) {
              console.warn('[GameContext] handleRemoteState failed', err);
            }
          });
          console.log('[GameContext] listener attached for', matchId);

          break;
        } catch (err: any) {
          const msg =
            err && (err.code ?? err.message)
              ? `${err.code ?? ''} ${err.message ?? ''}`.trim()
              : String(err);
          console.warn(
            `[GameContext] join+attach attempt ${attempt} failed:`,
            msg,
          );

          if (attempt < MAX_JOIN_ATTEMPTS) {
            await new Promise(res => setTimeout(() => res, 250 * attempt));
            continue;
          } else {
            console.error(
              '[GameContext] join+attach attempts exceeded; will retry when deps change',
              matchId,
            );
            return;
          }
        }
      }

      try {
        const me = firebaseAuth.currentUser?.uid ?? state.playerId ?? null;
        if (me) {
          await setPresence(matchId, me, true);
        }
      } catch (e) {
        console.warn('[GameContext] setPresence failed', e);
      }
    };

    attachSafely();

    return () => {
      mounted = false;
      try {
        const me = firebaseAuth.currentUser?.uid ?? state.playerId ?? null;
        const matchId = state.matchId;
        if (me && matchId && state.mode === 'pvp') {
          try {
            setPresence(matchId, me, false);
          } catch (_) {}
        }
      } catch (_) {}
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [state.matchId, state.mode, state.playerId]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
export default GameProvider;
