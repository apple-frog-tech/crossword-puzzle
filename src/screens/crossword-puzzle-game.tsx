"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useGame } from "../context/GameContext";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GridCell, TurnPlacement, DeckItem } from "../types"
import { allAvailableLetters, initialLetters, puzzleData, solutionGrid } from "../levels/level1"
import { styles, CELL_SIZE } from "../styleSheet/styles"
import {
  getCellStyle,
  checkCompletedWords,
  refillLetterDeck,
  aiTurn,
  placeLetter,
  passTurn,
  resetGame,
  recordTentativePlacement,
  placeLetterAt,
  placeLetterByChar,
  cancelTentativePlacements,
  submitTurn,
  swapTiles,
  swapTilesAndPass,
  buildSmartDeck,
  detectCompletedWords
} from "../hooks/logic"
import DraggableTileLayer from "../components/DraggableTileLayer";
import LinearGradient from 'react-native-linear-gradient';
import SwapModal from "../components/SwapModal";
import AdBanner from '../components/AdBanner';
import { useHints, HintButton } from "../hooks/useHints";
import { computeAiMove } from "../ai/aiDecision";
import AiBubbleOverlay from "../components/AiBubbleOverlay";
import ScoreOverlay, { ScoreOverlayHandle } from "../components/ScoreOverlay";
import AnimatedScore from "../components/AnimatedScore";
import { submitTurnTransaction } from '../firebase/matchService';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';
import { handleExpireMultiplayer, handleSubmitMultiplayer } from '../utils/multiplayerSubmit';
import TurnTimer from "../components/TurnTimer";
import LivesIndicator from '../components/LivesIndicator';
import Chat from '../components/Chat';
import { useNavigation } from "@react-navigation/native";
import InGameBanner from "../components/InGameBanner";
import { notify } from '../utils/notificationCenter';
import { unstable_batchedUpdates, InteractionManager } from 'react-native';
import PreGameCountdown from "../components/PreGameCountdown";
import OutOfLivesModal from "../components/OutOfLivesModal";
import { getLevelModule } from '../levels';
import { updateMatchSettings } from '../firebase/matchService';



export default function CrosswordPuzzleGame() {
  const navigation = useNavigation<any>();
  const makeId = (ch: string, idx: number) => `d-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).slice(2,6)}`;

  const initialDeck = useMemo<DeckItem[]>(
    () => initialLetters.map((ch, i) => ({ id: makeId(ch, i), char: ch, originalIndex: i })),
    []
  );

  const app = getApp();
const firebaseAuth = getAuth(app);
const firebaseDb = getDatabase(app);

  const [grid, setGrid] = useState<GridCell[][]>(puzzleData.grid)
  const [letterDeck, setLetterDeck] = useState<DeckItem[]>(initialDeck)
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"You" | "Opponent">("You")
  const [scores, setScores] = useState({ You: 0, Opponent: 0 })
  const [gameHistory, setGameHistory] = useState<string[]>([])
  const [completedWords, setCompletedWords] = useState<string[]>([])
  const [turnPlacements, setTurnPlacements] = useState<TurnPlacement[]>([])
  const [reservedVersion, setReservedVersion] = useState(0);
  const reservedRef = useRef<Record<string, { char: string; originalIndex: number }>>({});
  const [tileLayerVersion, setTileLayerVersion] = useState(0);
  const passInProgressRef = useRef(false);
  const [boardVersion, setBoardVersion] = useState(0);
  const [showTileLayer, setShowTileLayer] = useState(true);
  const [tentativePlacements, setTentativePlacements] = useState<TurnPlacement[]>([]);
const [returningIds, setReturningIds] = useState<string[]>([]);

  const [swapModalVisible, setSwapModalVisible] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInProgress, setAiInProgress] = useState(false);
const aiScheduledRef = useRef(false); 

const [levelSolutionGrid, setLevelSolutionGrid] = useState<string[][]>(solutionGrid); // initial imported fallback
const [levelAllAvailableLetters, setLevelAllAvailableLetters] = useState<string[]>(allAvailableLetters);
const [levelPuzzleDataState, setLevelPuzzleDataState] = useState<any>(puzzleData);

 const hints = useHints({ grid, solutionGrid: levelSolutionGrid, letterDeck, freeHints: 2, highlightDurationMs: 5000 });
const hintedSet = useMemo(() => new Set(hints.currentHighlights.map(h => `${h.r}-${h.c}`)), [hints.currentHighlights]);

const [aiOverlayVisible, setAiOverlayVisible] = useState(false);
const [aiOverlayPayload, setAiOverlayPayload] = useState<any>(null);

const congratsShownRef = useRef(false);
const justLoadedLevelRef = useRef(false);
const startTsRef = useRef<number>(Date.now());

const scoreOverlayRef = useRef<ScoreOverlayHandle | null>(null);

const wordsDisplayedRef = useRef<Set<string>>(new Set());

const { state: gameState, dispatch: gameDispatch } = useGame();

const TURN_SECONDS = (gameState?.matchSettings?.turnSeconds as number) ?? 60;

const [lives, setLives] = useState<{ You: number; Opponent: number }>({ You: 3, Opponent: 3 });

const [timerLeft, setTimerLeft] = useState<{ You: number; Opponent: number }>({ You: TURN_SECONDS, Opponent: TURN_SECONDS });


const serverCurrentUid = (gameState as any)?.currentPlayerUid ?? null;
const localUidForTurn = firebaseAuth.currentUser?.uid ?? gameState?.playerId ?? null;

const effectiveCurrentPlayer = gameState?.mode === 'pvp'
  ? (serverCurrentUid ? (serverCurrentUid === localUidForTurn ? "You" : "Opponent") : (gameState.currentPlayer ?? currentPlayer))
  : currentPlayer;

const isMyTurn = effectiveCurrentPlayer === "You";

const showLivesEnabled = !!(
  gameState &&
  gameState.mode === 'pvp' &&
  gameState.matchId &&
  gameState.matchSettings &&
  gameState.matchSettings.timed === true &&
  gameState.matchSettings.quickMatch === true
);

const uiLocked = !isMyTurn || isSubmitting || aiInProgress || (showLivesEnabled && ((lives?.You ?? 0) <= 0));


const seenTurnTsRef = useRef<Set<number | string>>(new Set());

const [preGameVisible, setPreGameVisible] = useState(false);
const prevMatchIdRef = useRef<string | null>(null);
const preGameFiredRef = useRef<Record<string, boolean>>({});

const [outOfLivesVisible, setOutOfLivesVisible] = useState(false);
const [outOfLivesSide, setOutOfLivesSide] = useState<"You" | "Opponent" | null>(null);

const tentativeMap = useMemo(() => {
  const m = new Map<string, TurnPlacement>();
  tentativePlacements.forEach(tp => {
    m.set(`${tp.row}-${tp.col}`, tp);
  });
  return m;
}, [tentativePlacements]);


const mkIdLocal = (ch: string) => `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}-${ch}`;

const rows = grid.length;
const cols = grid[0]?.length ?? 0;

const [scoreBarLayout, setScoreBarLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
const [opponentLayout, setOpponentLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
const [opponentLocalLayout, setOpponentLocalLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);


const [boardLayoutOuter, setBoardLayoutOuter] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
const [boardLayoutInner, setBoardLayoutInner] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

const myUid = firebaseAuth.currentUser?.uid ?? gameState?.playerId ?? null;
const allocations = (gameState as any)?.playerAllocations ?? null;
const myAllocCount = allocations && myUid ? (allocations[myUid]?.length ?? 0) : null;
const oppUid = allocations && myUid ? Object.keys(allocations).find(k => k !== myUid) : null;
const oppAllocCount = allocations && oppUid ? (allocations[oppUid]?.length ?? 0) : null;
  type DeckDerivedTile = { id: string; char: string; originalIndex: number };

  const derivedFromDeck = useMemo<DeckDerivedTile[]>(() => {
    return letterDeck.map((it, idx) => ({ id: it.id, char: it.char, originalIndex: idx }));
  }, [letterDeck]);

  const draggableTiles = useMemo(() => {
  const mapByIndex: Record<number, DeckDerivedTile> = {};
  derivedFromDeck.forEach((t) => {
    mapByIndex[t.originalIndex] = t;
  });

  Object.entries(reservedRef.current).forEach(([id, info]) => {
    mapByIndex[info.originalIndex] = {
      id,
      char: info.char,
      originalIndex: info.originalIndex,
    };
  });

  const indexes = Object.keys(mapByIndex).map((s) => parseInt(s, 10)).sort((a, b) => a - b);
  const arranged = indexes.map((i) => mapByIndex[i]).filter(Boolean);

  const seen = new Set<string>();
  const deduped: DeckDerivedTile[] = [];
  for (const item of arranged) {
    if (!item) continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    deduped.push(item);
  }

  return deduped;
}, [derivedFromDeck, reservedVersion]);




  const logicProps = {
    grid, setGrid,
    letterDeck, setLetterDeck,
    selectedLetterIndex, setSelectedLetterIndex,
    currentPlayer, setCurrentPlayer,
    scores, setScores,
    gameHistory, setGameHistory,
    completedWords, setCompletedWords,
    solutionGrid : levelSolutionGrid,
    puzzleData : levelPuzzleDataState,
    turnPlacements,
    setTurnPlacements,
  }

  const logicWithDeck = { ...logicProps, letterDeck, setLetterDeck }; // used by swap functions

  

const decodeCompleteId = (id: string) => {
  try {
    if (!id || typeof id !== "string") return null;
    if (id.startsWith("complete-row-")) {
      const parts = id.split("-");
      const row = parseInt(parts[2], 10);
      const startCol = parseInt(parts[3], 10);
      const endCol = parts[4] === "end" ? cols - 1 : parseInt(parts[4], 10);
      const cells: { r: number; c: number }[] = [];
      for (let c = startCol; c <= endCol; c++) cells.push({ r: row, c });
      return { cells, points: cells.length };
    }
    if (id.startsWith("complete-col-")) {
      const parts = id.split("-");
      const col = parseInt(parts[2], 10);
      const startRow = parseInt(parts[3], 10);
      const endRow = parts[4] === "end" ? rows - 1 : parseInt(parts[4], 10);
      const cells: { r: number; c: number }[] = [];
      for (let r = startRow; r <= endRow; r++) cells.push({ r, c: col });
      return { cells, points: cells.length };
    }
  } catch (err) {
  }
  return null;
};

const isGridComplete = (g: GridCell[][]) => {
  if (justLoadedLevelRef.current) return false;
  if (!Array.isArray(g) || !Array.isArray(levelSolutionGrid)) return false;
 for (let r = 0; r < levelSolutionGrid.length; r++) {
   for (let c = 0; c < (levelSolutionGrid[r] ?? []).length; c++) {
     const expected = (levelSolutionGrid[r]?.[c] ?? "").toString();
      if (!expected) continue; 
      const cell = g[r]?.[c];
      if (!cell || !cell.text) return false;
      if ((cell.text ?? "").toString().toUpperCase() !== expected.toUpperCase()) return false;
    }
  }
  return true;
};

const pendingSubmitRef = useRef<{
  existingDeck: DeckItem[] | null;
  returns: { id?: string; char: string }[] | null;
} | null>(null);


const handleSubmit = async () => {
  if (passInProgressRef.current || isSubmitting) return;
  passInProgressRef.current = true;
  setIsSubmitting(true);

  const placements = [...tentativePlacements];
  if (placements.length === 0) {
    passInProgressRef.current = false;
    setIsSubmitting(false);
    return;
  }

  if (gameState?.mode === 'pvp' && gameState?.matchId) {
    try {
      const res = await handleSubmitMultiplayer(gameState.matchId, placements, gameDispatch, gameState.playerId);
      if (!res || res.committed === false) {
        setTentativePlacements([]);
        reservedRef.current = {};
        setReservedVersion(v => v + 1);
        setTileLayerVersion(v => v + 1);

        passInProgressRef.current = false;
        setIsSubmitting(false);
        return;
      }

      setTentativePlacements([]);
      reservedRef.current = {};
      setReservedVersion(v => v + 1);
      setTileLayerVersion(v => v + 1);
      passInProgressRef.current = false;
      setIsSubmitting(false);
      return;
    } catch (err) {
      console.warn('handleSubmitMultiplayer failed', err);
      setTentativePlacements([]);
      reservedRef.current = {};
      setReservedVersion(v => v + 1);
      setTileLayerVersion(v => v + 1);
      passInProgressRef.current = false;
      setIsSubmitting(false);
      notify({ type: 'error', message: 'Submit failed — try again.' });
      return;
    }
  }


  const nextGrid = grid.map((row) => row.map(cell => ({ ...cell })));

  const returns: { char: string }[] = [];
  let scoreDelta = 0;

  placements.forEach((p) => {
    const expected = levelSolutionGrid[p.row]?.[p.col] ?? "";
    const placedChar = p.char ?? "";
    const isCorrect = expected && placedChar.toUpperCase() === expected.toUpperCase();

    if (isCorrect) {
      scoreDelta += 1;
      nextGrid[p.row][p.col] = {
        ...nextGrid[p.row][p.col],
        text: placedChar,
        type: "letter",
        placed: true,
        placedBy: "You",
      };
    } else {
      nextGrid[p.row][p.col] = {
        ...nextGrid[p.row][p.col],
        text: "",
        type: "empty",
        placed: false,
      };
      returns.push({ char: placedChar });
    }
  });

  const TARGET = 5;
  const existingDeck = Array.isArray(letterDeck) ? [...letterDeck] : [];
  const returnsWithIds = placements
    .filter((p) => {
      const expected = levelSolutionGrid[p.row]?.[p.col] ?? "";
      return !(expected && (p.char ?? "").toUpperCase() === expected.toUpperCase());
    })
    .map((p) => ({
      id: p.tileId ?? mkIdLocal((p.char ?? "").toString()),
      char: (p.char ?? "").toString().toUpperCase(),
    }));

const builtDeck = buildSmartDeck(existingDeck, returnsWithIds, nextGrid, levelSolutionGrid, levelAllAvailableLetters, TARGET);

  const displayGrid = nextGrid.map((row) => row.map((cell) => ({ ...cell })));
  placements.forEach((p) => {
    const expected = levelSolutionGrid[p.row]?.[p.col] ?? "";
    const isCorrect = expected && (p.char ?? "").toUpperCase() === expected.toUpperCase();
    displayGrid[p.row][p.col] = {
      ...displayGrid[p.row][p.col],
      recentlyScored: isCorrect ? "correct" : "wrong",
    };
  });

  setGrid(displayGrid);
  hints.resetHighlights();  

  const newCompletedIds: string[] = detectCompletedWords(displayGrid, levelSolutionGrid);

  const justAdded = newCompletedIds.filter(id => !completedWords.includes(id));

  const totalBonus = justAdded.reduce((acc, id) => {
    const decoded = decodeCompleteId(id);
    return acc + (decoded ? decoded.points : 0);
  }, 0);

  setTentativePlacements([]);
  

  const letterPromises: Promise<void>[] = [];
  for (const p of placements) {
    const expected = levelSolutionGrid[p.row]?.[p.col] ?? "";
    const isCorrect = expected && (p.char ?? "").toUpperCase() === expected.toUpperCase();
    const pts = isCorrect ? 1 : -1;
    const pr = scoreOverlayRef.current?.showLetterPoints({
      row: p.row,
      col: p.col,
      points: pts,
      owner: "You",
      duration: 700,
      position: "top-right",
    }) ?? Promise.resolve();
    letterPromises.push(pr);
  }

  try {
    await Promise.all(letterPromises);
  } catch (err) {
    console.warn("letter overlay promises failed:", err);
  }

  const letterDelta = scoreDelta;
  const wordBonus = totalBonus;

  const totalDeltaForYou = (letterDelta || 0) + (wordBonus || 0);
  if (totalDeltaForYou !== 0) {
    setScores(prev => ({ ...prev, You: (prev.You ?? 0) + totalDeltaForYou }));
  }

for (const id of justAdded) {
if (wordsDisplayedRef.current.has(id)) continue;
const decoded = decodeCompleteId(id);
if (!decoded) continue;

const decodedSet = new Set<string>();
decoded.cells.forEach(p => decodedSet.add(`${p.r}-${p.c}`));

const highlightedGrid = displayGrid.map(row => row.map(cell => ({ ...cell })));

decodedSet.forEach(key => {
  const [rStr, cStr] = key.split("-");
  const r = parseInt(rStr, 10);
  const c = parseInt(cStr, 10);
  if (!Number.isNaN(r) && !Number.isNaN(c) && highlightedGrid[r] && highlightedGrid[r][c]) {
    const cell = highlightedGrid[r][c];
    const expected = (levelSolutionGrid[r]?.[c] ?? "").toString();
    if (!cell.text && expected) {
      cell.text = expected;
      cell.type = "letter";
      cell.placed = true;
      cell.placedBy = "You";
    }
    cell.wordHighlight = true;
    if (cell.recentlyScored) delete (cell as any).recentlyScored;
    if (cell.tentative) { delete (cell as any).tentative; delete (cell as any).tentativeBy; delete (cell as any).tentativeTileId; }
  }
});

setGrid(highlightedGrid);
setBoardVersion(v => v + 1);
await new Promise<void>((res) => setTimeout(() => res(), 40));
try {
  await (scoreOverlayRef.current?.showWordPoints({
    cells: decoded.cells.map(p => ({ r: p.r, c: p.c })),
    points: decoded.points,
    owner: "You",
    duration: 900,
    position: "center",
  }) ?? Promise.resolve());
} catch (err) { console.warn("word overlay failed:", err); }
await new Promise<void>((res) => setTimeout(() => res(), 240));
setGrid(prev => prev.map(row => row.map(cell => {
  const clone = { ...cell };
  if (clone.wordHighlight) delete clone.wordHighlight;
  return clone;
})));
setBoardVersion(v => v + 1);
wordsDisplayedRef.current.add(id);

}


  setTimeout(() => {
    setGrid(prev => prev.map((row) => row.map((cell) => {
      const copy = { ...cell } as any;
      if (copy.recentlyScored) delete copy.recentlyScored;
      return copy;
    })));
  }, 120);

  setShowTileLayer(false);
  reservedRef.current = {};
  setReservedVersion((v) => v + 1);

  const deckSnapshot = Array.isArray(letterDeck) ? letterDeck.map(d => ({ ...d })) : [];
 
  pendingSubmitRef.current = {
    existingDeck: deckSnapshot,
    returns: returnsWithIds,
  };
  setTileLayerVersion(v => v + 1);

  setTimeout(() => {
    if (gameState?.mode === 'local') {
      if (!aiScheduledRef.current) {
        aiScheduledRef.current = true;
        setCurrentPlayer("Opponent");

        const cleanGridForAI = nextGrid.map(row => row.map(cell => {
          const c = { ...cell } as any;
          if (c.recentlyScored) delete c.recentlyScored;
          return c;
        }));

        startAiSequence({ ...logicProps, grid: cleanGridForAI, letterDeck: deckSnapshot }, 5);
      }
    } else {
      passInProgressRef.current = false;
      setIsSubmitting(false);
    }
  }, 30);

};


const startAiSequence = (propsSnapshot: any, moves = 1) => {
  if (gameState?.mode !== 'local') return;
  try {
    const pending = pendingSubmitRef.current ?? null;
    const forbiddenCounts: Record<string, number> = {};
    if (pending && Array.isArray(pending.existingDeck)) {
      for (const d of pending.existingDeck) {
        const ch = ((d?.char ?? "") + "").toString().toUpperCase();
        if (!ch) continue;
        forbiddenCounts[ch] = (forbiddenCounts[ch] || 0) + 1;
      }
    }

    const aiTarget = Math.max(1, Math.min(5, moves || 5));
    let aiDeck: any[] = [];
    try {
      const cleanGrid = propsSnapshot.grid ?? grid;
aiDeck = buildSmartDeck([], [], cleanGrid, levelSolutionGrid, levelAllAvailableLetters, aiTarget) || [];
    } catch (e) {
      console.warn("[startAiSequence] buildSmartDeck failed:", e);
      aiDeck = Array.isArray(propsSnapshot.letterDeck) ? [...propsSnapshot.letterDeck].slice(0, aiTarget) : [];
    }

    try {
          const cleanGrid: GridCell[][] = Array.isArray(propsSnapshot?.grid) ? propsSnapshot.grid : Array.isArray(grid) ? grid : [];
      if (forbiddenCounts && Object.keys(forbiddenCounts).length > 0) {
        aiDeck = aiDeck.filter(d => {
          const ch = ((d?.char ?? '') + '').toString().toUpperCase();
          return !(forbiddenCounts[ch] && forbiddenCounts[ch] > 0);
        });

        if (aiDeck.length < aiTarget) {
          const candidate = buildSmartDeck([], [], cleanGrid, levelSolutionGrid, levelAllAvailableLetters, Math.max(aiTarget * 3, 10)) || [];
          for (const cand of candidate) {
            if (aiDeck.length >= aiTarget) break;
            const ch = ((cand?.char ?? '') + '').toString().toUpperCase();
            if (!(forbiddenCounts[ch] && forbiddenCounts[ch] > 0)) {
              aiDeck.push(cand);
            }
          }
          aiDeck = aiDeck.slice(0, aiTarget);
        }
      }
    } catch (e) {
      console.warn("[startAiSequence] aiDeck sanitation failed:", e);
    }

    if ((!Array.isArray(aiDeck) || aiDeck.length === 0) && Array.isArray(propsSnapshot.letterDeck)) {
      aiDeck = propsSnapshot.letterDeck.filter((d: { char: any; }) => {
        const ch = ((d?.char ?? '') + '').toString().toUpperCase();
        return !(forbiddenCounts[ch] && forbiddenCounts[ch] > 0);
      }).slice(0, aiTarget);
    }

const result = computeAiMove({
  ...propsSnapshot,
  letterDeck: aiDeck,
  solutionGrid: levelSolutionGrid,                   
  allAvailableLetters: levelAllAvailableLetters,     
}, moves, Object.keys(forbiddenCounts).length > 0 ? { ...forbiddenCounts } : undefined);


    setAiOverlayPayload(result);

    setAiInProgress(true);
    setIsSubmitting(false);

    setAiOverlayVisible(true);
  } catch (err) {
    console.warn("startAiSequence failed:", err);
    try { aiTurn(propsSnapshot as any, moves); } catch (_) {}
  }
};


const boundSubmitTurn = () => {
  if (passInProgressRef.current) return;
  passInProgressRef.current = true;

 
  setTimeout(() => {
    const deckSnapshot = Array.isArray(letterDeck) ? letterDeck.map(d => ({ ...d })) : [];

    submitTurn({ ...logicProps, letterDeck: deckSnapshot }, (existingDeckFromSubmit: DeckItem[] | null, returnsFromSubmit: any[] | null, nextGrid: GridCell[][]) => {
      setGrid(nextGrid);
      setBoardVersion((v) => v + 1);
      setShowTileLayer(false);
      reservedRef.current = {};
      setReservedVersion((v) => v + 1);

      pendingSubmitRef.current = {
        existingDeck: Array.isArray(existingDeckFromSubmit) ? existingDeckFromSubmit.map(d => ({ ...d })) : deckSnapshot,
        returns: Array.isArray(returnsFromSubmit) ? returnsFromSubmit.map(r => ({ ...r })) : [],
      };
      setTileLayerVersion((v) => v + 1);

      if (gameState?.mode === 'local') {
        if (!aiScheduledRef.current) {
          aiScheduledRef.current = true;
          setCurrentPlayer("Opponent");

          const cleanGridForAI = nextGrid.map(row => row.map(cell => {
            const c = { ...cell } as any;
            if (c.recentlyScored) delete c.recentlyScored;
            return c;
          }));

          startAiSequence({ ...logicProps, grid: cleanGridForAI, letterDeck: deckSnapshot }, 5);
        }
      } else {
        passInProgressRef.current = false;
        setIsSubmitting(false);
      }
    });

  }, 30);
};

const boundPassTurn = () => {
  passInProgressRef.current = true;

  passTurn(logicProps, (newDeck, nextGrid) => {
    setGrid(nextGrid);
    setBoardVersion((v) => v + 1);
    setShowTileLayer(false);

    reservedRef.current = {};
    setReservedVersion((v) => v + 1);

    setTimeout(() => {
      setLetterDeck(newDeck);
      setTileLayerVersion((v) => v + 1);
      setShowTileLayer(true);
      passInProgressRef.current = false;

      if (gameState?.mode === 'local') {
      if (!aiScheduledRef.current) {
        aiScheduledRef.current = true;
        setCurrentPlayer("Opponent");

        startAiSequence({ ...logicProps, grid: nextGrid, letterDeck: newDeck }, 3);
      }
    }}, 50);
  });
};

const boundRefillLetterDeck = () => {
  cancelTentativePlacements({ ...logicProps, targetDeckSize: 5 });
}
  const boundResetGame = () => resetGame(logicProps)
  const boundPlaceLetterAt = (r:number,c:number, tileIndex:number) => placeLetterAt(r,c,tileIndex, logicProps)
  const boundPlaceLetter = (rowIndex: number, colIndex: number) => placeLetter(rowIndex, colIndex, logicProps)

  const [boardLayout, setBoardLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const isCellOccupied = (r: number, c: number) => {
  const cell = grid[r]?.[c];
  if (!cell) return true;

  if (cell.type !== "empty") return true;

  if (cell.text) return true;
  return false;
};

  const findDeckIndexForTileId = (tileId: string) => {
    return letterDeck.findIndex(it => it.id === tileId);
  };

const handleTilePick = (tileId: string) => {
  if (passInProgressRef.current || aiInProgress || isSubmitting || effectiveCurrentPlayer !== "You") {
    return;
  }

  const deckIdx = findDeckIndexForTileId(tileId);
  if (deckIdx === -1) return;
  const item = letterDeck[deckIdx];

  reservedRef.current[tileId] = { char: item.char, originalIndex: deckIdx };
  setReservedVersion(v => v + 1);
};




 const handleTileDrop = (tileId: string, r: number | null, c: number | null) => {
  // quick guards
  if (passInProgressRef.current || aiInProgress || isSubmitting || effectiveCurrentPlayer !== "You") {
    return;
  }

  if (r == null || c == null) {
    return;
  }

  const tileInDeck = letterDeck.find(it => it.id === tileId);
  if (!tileInDeck) return;

  const targetCell = grid[r]?.[c];
  if (!targetCell) return;
  if (targetCell.type !== "empty" || targetCell.text) return;
  const newTentativePlacement: TurnPlacement = {
    tileId: tileInDeck.id,
    row: r,
    col: c,
    char: tileInDeck.char,
    originalIndex: typeof tileInDeck.originalIndex === "number" ? tileInDeck.originalIndex : -1,
  };

  unstable_batchedUpdates(() => {
    setGrid(prevGrid => {
      const next = prevGrid.map((rowArr, ridx) =>
        rowArr.map((cellItem, cidx) => {
          if (ridx === r && cidx === c) {
            return {
              ...cellItem,
              text: tileInDeck.char,
              type: "letter",
              tentative: true,
              tentativeBy: "You",
              tentativeTileId: tileInDeck.id,
            } as GridCell;
          }
          return cellItem;
        })
      );
      return next;
    });

    setTentativePlacements(prev => {
      const filtered = prev.filter(p => !(p.row === r && p.col === c));
      return [...filtered, newTentativePlacement];
    });

    setLetterDeck(prev => {
      const idx = prev.findIndex(it => it.id === tileInDeck.id);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });

    if (reservedRef.current && reservedRef.current[tileInDeck.id]) {
      delete reservedRef.current[tileInDeck.id];
    }
    setReservedVersion(v => v + 1);
    setTileLayerVersion(v => v + 1);
  });

};


const PALE_BOARD = ['#F6F2FF', '#E8FAFF', '#F3F6FF']; 
const PALE_CELL_PINK = ['#FFE9F8', '#F8E7FF', '#E9F2FF']; 
const PALE_CELL_BLUE = ['#E6F8FF', '#DCEBFF', '#F0E8FF'];
const PALE_CELL_YELLOW = ['#FFF4D6', '#FFDCC0', '#FFEFE8']; 
const PALE_CELL_WHITE = ['#FFFFFF', '#FBFDFF']; 


const getGradientColors = (cell: GridCell, isTentative = false) => {
  if (cell.type === 'clue') return ['#E6F7FF', '#DFF3FF'];
  if (cell.type === 'icon') return ['#FFFDF7', '#FFF8EE'];
  if (cell.type === 'special') return isTentative
    ? ['#FFEFCF', '#FFE1A8']
    : PALE_CELL_YELLOW;
  if (cell.type === 'letter') return isTentative
    ? ['#FDE9F9', '#ECEBFF'] 
    : PALE_CELL_PINK;
  return PALE_CELL_WHITE;
};

const handleTimerTick = (side: "You" | "Opponent") => (secs: number) => {
  setTimerLeft(prev => ({ ...prev, [side]: secs }));
};


const handleTimerExpire = async (side: "You" | "Opponent") => {
  if (!showLivesEnabled) {
    console.warn('[handleTimerExpire] ignored because showLivesEnabled=false');
    return;
  }
  if (passInProgressRef.current) {
    return;
  }
  passInProgressRef.current = true;

  let droppedToZero = false;
  setLives(prev => {
    const newLives = Math.max(0, (prev as any)[side] - 1);
    const next = { ...prev, [side]: newLives };
    if (newLives <= 0) droppedToZero = true;
    return next;
  });

  try {
    cancelTentativePlacements({ ...logicProps, targetDeckSize: 5 });
    setTentativePlacements([]);
    reservedRef.current = {};
    setReservedVersion(v => v + 1);
    setGrid(prev => prev.map(row => row.map(cell => {
      const c = { ...cell } as any;
      if (c.tentative) {
        delete c.tentative; delete c.tentativeBy; delete c.tentativeTileId;
        c.text = '';
        c.type = 'empty';
      }
      return c;
    })));
    setTileLayerVersion(v => v + 1);
    setShowTileLayer(false);
    setTimeout(() => setShowTileLayer(true), 40);
  } catch (err) {
    console.warn('handleTimerExpire cleanup failed', err);
  }

  if (droppedToZero) {
    if (gameState?.mode === 'pvp' && gameState?.matchId) {
      try {
        const myUid = firebaseAuth.currentUser?.uid ?? gameState.playerId ?? null;
        if (!myUid) {
          finishMatch(side);
        } else {
          const res = await handleExpireMultiplayer(gameState.matchId, myUid);
          if (res && res.committed) {
            if (res.winnerUid) {
              const iAmLoser = (res.winnerUid !== myUid); 
              if (iAmLoser) {
                finishMatch(side);
              } else {
                finishMatch(side);
              }
            }
          } else {
            if (gameState?.mode === 'pvp') {
              gameDispatch({ type: 'SET_CURRENT_PLAYER', player: side === "You" ? "Opponent" : "You" });
            } else {
              boundPassTurn();
            }
          }
        }
      } catch (err) {
        console.warn('handleExpireMultiplayer call failed', err);
        if (gameState?.mode === 'pvp') {
          gameDispatch({ type: 'SET_CURRENT_PLAYER', player: side === "You" ? "Opponent" : "You" });
        } else {
          boundPassTurn();
        }
      } finally {
        setTimeout(() => { passInProgressRef.current = false; }, 350);
      }
    } else {
      finishMatch(side);
      setTimeout(() => { passInProgressRef.current = false; }, 350);
    }
    return;
  }

  try {
    if (gameState?.mode === 'pvp' && gameState?.matchId) {
      const { handlePassMultiplayer } = await import('../utils/multiplayerSubmit');
      try {
        const res = await handlePassMultiplayer(gameState.matchId, gameDispatch, gameState.playerId);
        if (!res || res.committed === false) {
          console.warn('handlePassMultiplayer: not committed or aborted, server snapshot applied');
        }
      } catch (err) {
        console.warn('handlePassMultiplayer call failed', err);
        gameDispatch({ type: 'SET_CURRENT_PLAYER', player: side === "You" ? "Opponent" : "You" });
      }
    } else {
      boundPassTurn();
    }
  } catch (err) {
    console.warn('boundPassTurn failed on timer expire', err);
    if (gameState?.mode === 'pvp' && gameState?.matchId) {
      gameDispatch({ type: 'SET_CURRENT_PLAYER', player: side === "You" ? "Opponent" : "You" });
    } else {
      setCurrentPlayer(side === "You" ? "Opponent" : "You");
    }
  }

  const secs = (gameState?.matchSettings?.turnSeconds as number) ?? TURN_SECONDS;
  setTimerLeft(prev => ({ ...prev, [side]: secs }));
  setTimeout(() => { passInProgressRef.current = false; }, 350);
};


const finishMatch = async (loserSide: "You" | "Opponent") => {
  passInProgressRef.current = true;
  aiScheduledRef.current = false;
  setIsSubmitting(false);
  setAiInProgress(false);

  try {
    cancelTentativePlacements({ ...logicProps, targetDeckSize: 5 });
  } catch (err) {  }

  setTimerLeft({ You: 0, Opponent: 0 });

  const loserUid = loserSide === "You" ? myUid : oppUid;
  const winnerUid = loserUid === myUid ? oppUid : myUid;

  const iAmLoser = !!(loserUid && myUid && loserUid === myUid);

  if (gameState?.mode === 'pvp' && gameState?.matchId) {
    try {
      console.log('[finishMatch] attempting server end-match', { matchId: gameState.matchId, loserSide, loserUid, winnerUid });
      const { handleEndMatchMultiplayer } = await import('../utils/multiplayerSubmit');
      if (typeof handleEndMatchMultiplayer === 'function') {
        const res = await handleEndMatchMultiplayer(gameState.matchId, { winnerUid: winnerUid ?? undefined, finalScores: { } });
        console.log('[finishMatch] handleEndMatchMultiplayer result:', res);

        if (res && res.committed) {
          passInProgressRef.current = false;
          return;
        }

        console.warn('[finishMatch] server end-match did not commit, falling back to local handling', res);
      }
    } catch (err) {
      console.warn('finishMatch: end-match multiplayer call failed', err);
    }
  }

  if (iAmLoser) {
    setOutOfLivesSide(loserSide);
    setOutOfLivesVisible(true);
  } else {
    try {
      navigation.replace('Congratulations', {
        winner: winnerUid === myUid ? 'You' : 'Opponent',
        score: winnerUid === myUid ? scores.You : scores.Opponent,
        moves: gameHistory.length,
        timeSeconds: Math.floor((Date.now() - (startTsRef.current ?? Date.now())) / 1000),
      });
    } catch (e) {
      console.warn('nav fallback failed', e);
    }
  }

  setTimeout(() => { passInProgressRef.current = false; }, 400);
};


useEffect(() => {
  try {
    const lvl = (gameState?.matchSettings?.level as number) ?? 1;
    const module = getLevelModule(lvl);
    if (!module) return;

    const modulePuzzle = module.puzzleData ?? module.puzzleData ?? puzzleData;
    const moduleSolution = module.solutionGrid ?? solutionGrid;
    const moduleInitialLetters = module.initialLetters ?? initialLetters;
    const moduleAllAvailable = module.allAvailableLetters ?? allAvailableLetters;

    setLevelPuzzleDataState(modulePuzzle);
setLevelSolutionGrid(moduleSolution);
setLevelAllAvailableLetters(moduleAllAvailable);
const sanitizeLevelGrid = (g: any[][]) => {
  if (!Array.isArray(g)) return g;
  return g.map(row => row.map(cell => {
    if (!cell) return { type: 'empty', text: '' };

    if (cell.type && cell.type !== 'letter') {
      return { ...cell };
    }
    const isPrefilled = !!((cell as any).prefill) || !!(cell.placed) || (!!(cell.text) && String(cell.text).trim().length > 0);

    if (isPrefilled) {
      return {
        ...cell,
        type: 'letter',
        text: String(cell.text ?? '').toUpperCase(),
        placed: true,
      };
    }

    return { ...cell, text: '', type: 'empty', placed: false, placedBy: undefined };
  }));
};

if (Array.isArray(modulePuzzle?.grid)) {
  justLoadedLevelRef.current = true;

  const cleanedGrid = sanitizeLevelGrid(modulePuzzle.grid);
  setGrid(cleanedGrid);
  setTimeout(() => { justLoadedLevelRef.current = false; }, 300);

} else {
}
    setScores({ You: 0, Opponent: 0 });
    setGameHistory([]);
    setCompletedWords([]);
    setTurnPlacements([]);
    setTentativePlacements([]);
    reservedRef.current = {};
    setReservedVersion(v => v + 1);
    setTileLayerVersion(v => v + 1);
    setBoardVersion(v => v + 1);

    const defaultLives = (gameState?.matchSettings?.lives as number) ?? 3;
    setLives({ You: defaultLives, Opponent: defaultLives });

    const nowKey = Date.now().toString(36);
    const newDeck = (Array.isArray(moduleInitialLetters) ? moduleInitialLetters : []).map((ch: string, i: number) => ({
      id: `lvl-${lvl}-${nowKey}-${i}`,
      char: (String(ch) ?? '').toUpperCase(),
      originalIndex: i,
    }));
    setLetterDeck(newDeck);
    setTileLayerVersion(v => v + 1);

    const secs = (gameState?.matchSettings?.turnSeconds as number) ?? TURN_SECONDS;
    setTimerLeft({ You: secs, Opponent: secs });

   setPreGameVisible(gameState?.mode === 'pvp');

    congratsShownRef.current = false;
    startTsRef.current = Date.now();
  } catch (err) {
    console.warn('[Crossword] load level failed', err);
  }
}, [gameState?.matchSettings?.level]);




useEffect(() => {
  startTsRef.current = Date.now();
  congratsShownRef.current = false; 
}, [gameState?.matchId, gameState?.mode]);


useEffect(() => {
  try {
    if (!gameState || gameState.mode !== "pvp" || !gameState.matchId) {
      prevMatchIdRef.current = null;
      return;
    }

    const cur = gameState.matchId;

    if (prevMatchIdRef.current === cur) return;

    const serverGrid = Array.isArray(gameState.grid) ? gameState.grid : [];
    let hasPlaced = false;
    for (let r = 0; r < serverGrid.length && !hasPlaced; r++) {
      const row = serverGrid[r] ?? [];
      for (let c = 0; c < row.length; c++) {
        const cell = row[c];
        if (cell && (cell.text ?? "").toString().length > 0) {
          hasPlaced = true;
          break;
        }
      }
    }
    prevMatchIdRef.current = cur;

    if (hasPlaced) {
      console.log("[PreGameCountdown] not showing: server grid already has letters for matchId=", cur);
      return;
    }

    if (preGameFiredRef.current[cur]) {
      console.log("[PreGameCountdown] already fired for matchId=", cur);
      return;
    }
    preGameFiredRef.current[cur] = true;

    console.log("[PreGameCountdown] showing for matchId=", cur);
    setPreGameVisible(true);
  } catch (err) {
    console.warn("PreGameCountdown effect failed", err);
  }
}, [gameState?.mode, gameState?.matchId, gameState?.grid]);




  useEffect(() => {
  const t = setTimeout(() => {
    reservedRef.current = {};
    setReservedVersion(v => v + 1);
    setTileLayerVersion(v => v + 1);
  }, 0);
  return () => clearTimeout(t);
}, [letterDeck.map(d => d.id).join('|')]);

useEffect(() => {
  if (scoreBarLayout && opponentLocalLayout) {
    setOpponentLayout({
      x: scoreBarLayout.x + opponentLocalLayout.x,
      y: scoreBarLayout.y + opponentLocalLayout.y,
      width: opponentLocalLayout.width,
      height: opponentLocalLayout.height,
    });
  }
}, [scoreBarLayout, opponentLocalLayout]);

const prevCompletedRef = useRef<string[]>([]);
useEffect(() => {
  const prev = prevCompletedRef.current || [];
  if (completedWords.length > prev.length) {
    const added = completedWords.filter(id => !prev.includes(id));
    added.forEach(id => {
      if (wordsDisplayedRef.current.has(id)) return;

      const decoded = decodeCompleteId(id);
      if (!decoded) return;
      const cells = decoded.cells;

      wordsDisplayedRef.current.add(id);
      scoreOverlayRef.current?.showWordPoints({ cells, points: decoded.points, owner: "Opponent", duration: 900, position: "center" });
    });
  }
  prevCompletedRef.current = completedWords;
}, [completedWords, cols, rows]);

useEffect(() => {
  const placements = gameState?.turnPlacements ?? [];
  if (!placements || placements.length === 0) return;

  const last = placements[placements.length - 1];
  if (!last || typeof last.ts === 'undefined' || seenTurnTsRef.current.has(last.ts)) return;
  seenTurnTsRef.current.add(last.ts);
  const isByMe = last.by === gameState.playerId;
  const ownerLabel = isByMe ? "You" : "Opponent";

  const payload = {
    placements: (last.placements || []).map((p: any) => ({ r: p.row ?? p.r, c: p.col ?? p.c, placed: p.char, correct: p.correct ?? false })),
    newGrid: gameState.grid,
    newDeck: gameState.letterDeck,
    scoreDelta: 0,
    letters: (last.placements || []).map((p: any) => p.char)
  };

  setAiOverlayPayload(payload);
  setAiOverlayVisible(true);

  if (gameState?.mode === 'local') setAiInProgress(true); else setAiInProgress(false);

  (async () => {
    try {
      const letterPromises: Promise<void>[] = [];
      for (const p of payload.placements) {
        try {
          const row = p.r;
          const col = p.c;
          const placedText = (gameState.grid?.[row]?.[col]?.text ?? '').toString().toUpperCase();
          const expected = (levelSolutionGrid[row]?.[col] ?? '').toString().toUpperCase();
          const isCorrect = !!placedText && placedText === expected;

          const pr = scoreOverlayRef.current?.showLetterPoints({
            row,
            col,
            points: isCorrect ? 1 : -1,
            owner: ownerLabel,
            duration: 700,
            position: "top-right",
          }) ?? Promise.resolve();
          letterPromises.push(pr);
        } catch (e) {
          console.warn("PvP: single placement overlay error", e);
          letterPromises.push(Promise.resolve());
        }
      }
      await Promise.all(letterPromises);
    } catch (err) {
      console.warn("PvP: letter overlay failed:", err);
    }

    try {
      const aiCompletedIds: string[] = detectCompletedWords(gameState.grid, levelSolutionGrid);
      const newForAi = aiCompletedIds.filter(id => !completedWords.includes(id) && !wordsDisplayedRef.current.has(id));
      if (newForAi.length > 0) {
        setCompletedWords(prev => ([...prev, ...newForAi]));
        for (const id of newForAi) {
          if (wordsDisplayedRef.current.has(id)) continue;
          const decoded = decodeCompleteId(id);
          if (!decoded) continue;

          const highlightedGrid = (gameState.grid ?? []).map((row: any[]) => row.map((cell) => ({ ...cell })));
          const decodedSet = new Set<string>();
          decoded.cells.forEach(p => decodedSet.add(`${p.r}-${p.c}`));
          decodedSet.forEach(key => {
            const [rStr, cStr] = key.split("-");
            const r = parseInt(rStr, 10);
            const c = parseInt(cStr, 10);
            if (!Number.isNaN(r) && !Number.isNaN(c) && highlightedGrid[r] && highlightedGrid[r][c]) {
              const cell = highlightedGrid[r][c];
              const expected = (levelSolutionGrid[r]?.[c] ?? "").toString();
              if (!cell.text && expected) {
                cell.text = expected;
                cell.type = "letter";
                cell.placed = true;
                cell.placedBy = isByMe ? "You" : "Opponent";
              }
              cell.wordHighlight = true;
              if (cell.recentlyScored) delete (cell as any).recentlyScored;
              if (cell.tentative) { delete (cell as any).tentative; delete (cell as any).tentativeBy; delete (cell as any).tentativeTileId; }
            }
          });

          setGrid(highlightedGrid);
          setBoardVersion(v => v + 1);
          await new Promise<void>((res) => setTimeout(() => res(), 40));
          try {
            await (scoreOverlayRef.current?.showWordPoints({
              cells: decoded.cells.map(p => ({ r: p.r, c: p.c })),
              points: decoded.points,
              owner: ownerLabel,
              duration: 900,
              position: "center",
            }) ?? Promise.resolve());
          } catch (err) { console.warn("PvP: word overlay failed:", err); }
          await new Promise<void>((res) => setTimeout(() => res(), 240));
          setGrid(prev => prev.map(row => row.map(cell => {
            const clone = { ...cell };
            if (clone.wordHighlight) delete clone.wordHighlight;
            return clone;
          })));
          setBoardVersion(v => v + 1);
          wordsDisplayedRef.current.add(id);
        }
      }
    } catch (err) {
      console.warn("PvP: word detection/overlay failed:", err);
    } finally {
      setAiOverlayVisible(false);
      setAiOverlayPayload(null);
    }
  })();

}, [gameState.turnPlacements, gameState.grid, gameState.letterDeck, gameState.playerId]);



useEffect(() => {
  if (!gameState || gameState.mode !== 'pvp' || !gameState.matchId) return;
  if (Array.isArray(gameState.grid) && gameState.grid.length) {
    setGrid(gameState.grid);
    setBoardVersion(v => v + 1);
  }

  const coerceToArray = (maybeArrOrObj: any) => {
  if (!maybeArrOrObj) return null;
  if (Array.isArray(maybeArrOrObj)) return maybeArrOrObj;
  if (typeof maybeArrOrObj === 'object') {
    try {
      const keys = Object.keys(maybeArrOrObj)
        .map(k => ({ k, n: Number(k) }))
        .sort((a,b) => (Number.isFinite(a.n) && Number.isFinite(b.n)) ? a.n - b.n : a.k.localeCompare(b.k))
        .map(x => x.k);
      return keys.map(k => maybeArrOrObj[k]).filter(Boolean);
    } catch (e) {
      return Object.values(maybeArrOrObj).filter(Boolean);
    }
  }
  return null;
};

const serverDeck = (() => {
  try {
    console.log('[CROSSWORD] raw gameState.letterDeck:', gameState?.letterDeck);
    console.log('[CROSSWORD] raw gameState.playerHands:', (gameState as any)?.playerHands);

    const ph = (gameState as any).playerHands;
    const myUidLocal = firebaseAuth.currentUser?.uid ?? gameState?.playerId ?? null;
    const coerceToArrayLocal = (maybeArrOrObj: any) => {
      if (!maybeArrOrObj) return null;
      if (Array.isArray(maybeArrOrObj)) return maybeArrOrObj;
      if (typeof maybeArrOrObj === 'object') {
        try {
          const keys = Object.keys(maybeArrOrObj)
            .map(k => ({ k, n: Number(k) }))
            .sort((a,b) => (Number.isFinite(a.n) && Number.isFinite(b.n)) ? a.n - b.n : a.k.localeCompare(b.k))
            .map(x => x.k);
          return keys.map(k => maybeArrOrObj[k]).filter(Boolean);
        } catch (e) {
          return Object.values(maybeArrOrObj).filter(Boolean);
        }
      }
      return null;
    };

    if (ph && typeof ph === 'object' && myUidLocal && Object.prototype.hasOwnProperty.call(ph, myUidLocal)) {
      return coerceToArrayLocal(ph[myUidLocal]) ?? null;
    }

    return coerceToArrayLocal(gameState?.letterDeck ?? null) ?? null;
  } catch (e) {
    console.warn('[CROSSWORD] serverDeck coercion error', e);
    return null;
  }
})();

if (serverDeck) {
  const normalized = serverDeck.map((d: any, idx: number) => {
    const incomingId = d?.id ?? d?.key ?? d?.uid ?? null;
    const rawChar = (d?.char ?? d?.ch ?? d?.letter ?? '') + '';
    const char = rawChar.toString().toUpperCase();
    const origIndex = (typeof d?.originalIndex === 'number' && d.originalIndex >= 0) ? d.originalIndex : idx;
    const id = incomingId ? String(incomingId) : `srv-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).slice(2,6)}`;
    return { id, char, originalIndex: origIndex } as DeckItem;
  });

  console.log('[CROSSWORD] applying normalized serverDeck -> length=', normalized.length, normalized.map(x => ({id:x.id,char:x.char,orig:x.originalIndex})));

  setLetterDeck(normalized);
  setTileLayerVersion(v => v + 1);

  reservedRef.current = {};
  setReservedVersion(v => v + 1);
}
// if (serverDeck) {
//   setLetterDeck(serverDeck);
//   setTileLayerVersion(v => v + 1);
// }

  try {
    const me = gameState.playerId;
    if (gameState.scores && me) {
      const youScore = (gameState.scores as any)[me] ?? 0;
      const otherUid = Object.keys((gameState.scores as any) || {}).find(id => id !== me);
      const opponentScore = otherUid ? (gameState.scores as any)[otherUid] ?? 0 : (gameState.scores as any)['Opponent'] ?? 0;
      setScores({ You: youScore, Opponent: opponentScore });
    }
  } catch (e) {
  }

  if (Array.isArray(gameState.completedWords)) setCompletedWords(gameState.completedWords);
  if (Array.isArray(gameState.turnPlacements)) setTurnPlacements(gameState.turnPlacements);
}, [gameState?.mode, gameState?.matchId, gameState?.grid, gameState?.letterDeck, gameState?.scores, gameState?.completedWords, gameState?.turnPlacements]);


useEffect(() => {
  try {
    if (gameState?.mode === 'pvp' && gameState?.matchId && !gameState?.playerId) {
      const uid = firebaseAuth.currentUser?.uid ?? null;
      if (uid) {
        console.warn('[Crossword] fallback: setting playerId in GameContext =>', uid);
        gameDispatch({ type: 'SET_MATCH', matchId: gameState.matchId, playerId: uid });
      }
    }
  } catch (e) {
    console.warn('[Crossword] fallback set playerId failed', e);
  }
}, [gameState?.mode, gameState?.matchId, gameState?.playerId]);

useEffect(() => {
}, [gameState?.matchId, gameState?.playerId, gameState?.currentPlayer, firebaseAuth.currentUser?.uid, currentPlayer, effectiveCurrentPlayer, uiLocked]);

useEffect(() => {
  const secs = (gameState?.matchSettings?.turnSeconds as number) ?? 60;
  setTimerLeft({ You: secs, Opponent: secs });
}, [gameState?.matchSettings?.turnSeconds]);

useEffect(() => {
  try {
    if (congratsShownRef.current) return;

    if (!isGridComplete(grid)) return;
    congratsShownRef.current = true;
    const waitForInFlightWorkToFinish = async (timeoutMs = 5000) => {
      const start = Date.now();
      while ((aiScheduledRef.current || aiInProgress || pendingSubmitRef.current) && (Date.now() - start) < timeoutMs) {
        await new Promise<void>(res => setTimeout(() => res(), 50));
      }
      await new Promise<void>(res => setTimeout(() => res(), 160));
    };

    (async () => {
      try {
        const youScore = (scores?.You ?? 0);
        const oppScore = (scores?.Opponent ?? 0);
        const currentLevel = (gameState?.matchSettings?.level ?? 1);
        const nextLevel = currentLevel + 1;

        if (gameState?.mode === 'local') {
          await waitForInFlightWorkToFinish(5000);

          const finalYou = (scores?.You ?? youScore);
          const finalOpp = (scores?.Opponent ?? oppScore);

          setTimeout(() => {
            if (finalYou > finalOpp) {
              try {
                navigation.replace('Congratulations', {
                  winner: 'You',
                  score: finalYou,
                  moves: Array.isArray(gameHistory) ? gameHistory.length : undefined,
                  timeSeconds: Math.floor((Date.now() - (startTsRef.current ?? Date.now())) / 1000),
                  nextLevel,
                });
              } catch (e) {
                console.warn('Navigation to Congratulations failed (local):', e);
                Alert.alert('You win!', 'Congratulations — you beat the AI!', [
                  { text: 'OK', onPress: () => navigation.replace('TestMultiplayer', { startLevel: nextLevel }) }
                ], { cancelable: false });
              }
            } else {
              Alert.alert('You lose', 'You Lose — Play another game to beat the AI.', [
                { text: 'OK', onPress: () => navigation.replace('TestMultiplayer') }
              ], { cancelable: false });
            }
          }, 400);

          return;
        }

        if (gameState?.mode === 'pvp') {
          try {
            await waitForInFlightWorkToFinish(4000);

            if (gameState.matchId && typeof updateMatchSettings === 'function') {
              await updateMatchSettings(gameState.matchId, { ...(gameState.matchSettings || {}), level: nextLevel });
            } else {
              navigation.replace('Congratulations', {
                winner: youScore > oppScore ? 'You' : youScore < oppScore ? 'Opponent' : 'Draw',
                score: youScore,
                moves: Array.isArray(gameHistory) ? gameHistory.length : undefined,
                timeSeconds: Math.floor((Date.now() - (startTsRef.current ?? Date.now())) / 1000),
              });
            }
          } catch (err) {
            console.warn('Failed to advance PvP round on server (finalize), falling back to local nav', err);
            navigation.replace('Congratulations', {
              winner: youScore > oppScore ? 'You' : youScore < oppScore ? 'Opponent' : 'Draw',
              score: youScore,
              moves: Array.isArray(gameHistory) ? gameHistory.length : undefined,
              timeSeconds: Math.floor((Date.now() - (startTsRef.current ?? Date.now())) / 1000),
            });
          } finally {
            congratsShownRef.current = false;
          }
        }
      } catch (err) {
        console.warn('Congrats finalize failed', err);
        congratsShownRef.current = false;
      }
    })();
  } catch (err) { console.warn('Congrats check failed', err); }
}, [grid, completedWords, scores.You, scores.Opponent, gameHistory.length]);

useEffect(() => {
  try {
    const finished = gameState?.finished ?? null;
    if (!finished) return;

    const winnerUid = finished?.winnerUid ?? (gameState?.winnerUid ?? null);
    const loserUid = finished?.loserUid ?? null;

    const iAmLoser = !!(loserUid && myUid && loserUid === myUid);

    if (iAmLoser) {
      setOutOfLivesSide('You'); 
      setOutOfLivesVisible(true);
    } else {
      const winnerLabel = (winnerUid && winnerUid === myUid) ? 'You' : 'Opponent';
      const scoreForWinner = winnerUid === myUid ? scores.You : scores.Opponent;

      try {
        navigation.replace('Congratulations', {
          winner: winnerLabel,
          score: scoreForWinner,
          moves: Array.isArray(gameHistory) ? gameHistory.length : undefined,
          timeSeconds: Math.floor((Date.now() - (startTsRef.current ?? Date.now())) / 1000),
        });
      } catch (e) {
        console.warn('Navigation to Congratulations failed', e);
      }
    }
  } catch (err) {
    console.warn('finish-match effect failed', err);
  }
}, [gameState?.finished, gameState?.winnerUid, myUid, scores.You, scores.Opponent, gameHistory.length]);


useEffect(() => {
  try {
    if (!showLivesEnabled) return;
    if (!gameState || gameState.mode !== 'pvp' || !gameState.matchId) return;

    const serverLives = (gameState as any).playerLives ?? null;
    if (!serverLives || typeof serverLives !== 'object') return;

    const meUidLocal = firebaseAuth.currentUser?.uid ?? gameState.playerId ?? null;
    const otherUid = meUidLocal ? Object.keys(serverLives).find(u => u !== meUidLocal) ?? null : null;

    const myLives = meUidLocal ? (typeof serverLives[meUidLocal] === 'number' ? serverLives[meUidLocal] : null) : null;
    const oppLives = otherUid ? (typeof serverLives[otherUid] === 'number' ? serverLives[otherUid] : null) : null;

    setLives(prev => {
      const next = { You: typeof myLives === 'number' ? myLives : prev.You, Opponent: typeof oppLives === 'number' ? oppLives : prev.Opponent };
      if (next.You === prev.You && next.Opponent === prev.Opponent) return prev;
      return next;
    });

    if (typeof myLives === 'number' && myLives <= 0) {
      if (!passInProgressRef.current && !outOfLivesVisible) {
        console.log('[Crossword] server reported myLives <= 0 -> finishMatch("You")');
        finishMatch("You");
      }
      return;
    }

    if (typeof oppLives === 'number' && oppLives <= 0) {
      if (!passInProgressRef.current && !outOfLivesVisible) {
        console.log('[Crossword] server reported oppLives <= 0 -> finishMatch("Opponent")');
        finishMatch("Opponent");
      }
      return;
    }

  } catch (err) {
    console.warn('[Crossword] playerLives watch failed', err);
  }
}, [gameState?.playerLives, gameState?.mode, gameState?.matchId, gameState?.playerId, outOfLivesVisible, showLivesEnabled]);


  return (
    <><InGameBanner />
    <PreGameCountdown
  visible={preGameVisible}
  startFrom={3}
  onFinish={() => {
    setPreGameVisible(false);
  }}
/>
{/* Out of lives modal */}
<OutOfLivesModal
  visible={outOfLivesVisible}
  message="You lose — all chances used."
  onClose={() => {
    setOutOfLivesVisible(false);
    navigation.replace('TestMultiplayer');
  }}
  onReturnToLobby={() => navigation.replace('TestMultiplayer')}
/>
    <LinearGradient
      colors={['#2A184D', '#4B2E78', '#8C5CC7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      
      <View style={styles.header}>
        <TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.navigate('TestMultiplayer', {
    startLevel: (gameState?.matchSettings?.level ?? 1)
  })}
>
  <Text style={styles.backButtonText}>←</Text>
</TouchableOpacity>
        <Text style={styles.title}>Puzzle</Text>
      </View>

<LinearGradient
  colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.03)']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.scoreContainerGradient}
  onLayout={(e) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setScoreBarLayout({ x, y, width, height });
  } }
>
  <View style={[styles.scoreSection, { justifyContent: 'flex-start', paddingLeft: 12 }]}>
    <Text style={styles.scoreLabelLight}>You</Text>

    <AnimatedScore value={scores.You} style={[styles.scoreValueLight, { marginLeft: 8 }]} durationMs={600} />

    {showLivesEnabled ? (
      <View style={{ marginLeft: 8, alignItems: 'center' }}>
        <LivesIndicator
          lives={lives.You}
          maxLives={3}
          size={12}
          blinkingIndex={effectiveCurrentPlayer === "You" && timerLeft.You <= 10 && timerLeft.You > 0 ? (lives.You > 0 ? lives.You - 1 : null) : null}
          testID="lives-you" />
      </View>
    ) : null}

    {showLivesEnabled ? (
      <View style={{ position: 'absolute', left: 8 + 0, top: 28 }}>
        <TurnTimer
          side="You"
          size={32}
          strokeWidth={4}
          onExpire={() => handleTimerExpire("You")}
          onTick={handleTimerTick("You")} />
      </View>
    ) : null}
  </View>

  {}<View>
  <Text style={styles.vsTextLight}>VS</Text>
  </View>

  <View
    style={[styles.scoreSection, { justifyContent: 'flex-end', paddingRight: 12 }]}
    onLayout={(e) => {
      const { x, y, width, height } = e.nativeEvent.layout;
      setOpponentLocalLayout({ x, y, width, height });

      if (scoreBarLayout) {
        setOpponentLayout({
          x: scoreBarLayout.x + x,
          y: scoreBarLayout.y + y,
          width,
          height,
        });
      } else {
        setOpponentLayout({ x, y, width, height });
      }
    } }
  >
     {showLivesEnabled ? (
      <View style={{ marginLeft: 8, alignItems: 'center' }}>
        <LivesIndicator
          lives={lives.Opponent}
          maxLives={3}
          size={12}
          blinkingIndex={effectiveCurrentPlayer === "Opponent" && timerLeft.Opponent <= 10 && timerLeft.Opponent > 0 ? (lives.Opponent > 0 ? lives.Opponent - 1 : null) : null}
          testID="lives-opp" />
      </View>
    ) : null}
    <Text style={styles.scoreLabelLight}>Opponent</Text>
    <AnimatedScore value={scores.Opponent} style={[styles.scoreValueLight, { marginLeft: 8 }]} durationMs={600} />

   

    {showLivesEnabled ? (
      <View style={{ position: 'absolute', right: 12, top: 28 }}>
        <TurnTimer
          side="Opponent"
          size={32}
          strokeWidth={4}
          onExpire={() => handleTimerExpire("Opponent")}
          onTick={handleTimerTick("Opponent")} />
      </View>
    ) : null}
  </View>
</LinearGradient>
      {gameState?.mode === 'local' && (
        <AiBubbleOverlay
          visible={aiOverlayVisible}
          resultPayload={aiOverlayPayload}
          opponentLayout={opponentLayout}
          boardLayout={boardLayoutOuter}
          cellSize={CELL_SIZE}
          tileSize={36}
          flightDuration={900}
          onFinish={async (result) => {
            if (!result) {
              setAiOverlayVisible(false);
              setAiOverlayPayload(null);
              aiScheduledRef.current = false;
              passInProgressRef.current = false;
              setIsSubmitting(false);
              setAiInProgress(false);
              setCurrentPlayer("You");
              return;
            }

            if (gameState?.mode === 'pvp') {
              try {
              } catch (err) { console.warn('PvP overlay finish error', err); }
              setAiOverlayVisible(false);
              setAiOverlayPayload(null);
              setAiInProgress(false);
              setIsSubmitting(false);
              return;
            }

            try {
              const aiPlacements = Array.isArray(result.placements) ? result.placements : [];
              const displayGrid = (result.newGrid ?? []).map((row: any[]) => row.map((cell) => ({ ...cell })));

              for (const p of aiPlacements) {
                const r = p.r ?? p.r; 
                const c = p.c ?? p.c;
                if (displayGrid[r] && displayGrid[r][c]) {
                  displayGrid[r][c] = {
                    ...displayGrid[r][c],
                    recentlyScored: p.correct ? "correct" : "wrong",
                  };
                }
              }

              setGrid(displayGrid);
              setTileLayerVersion(v => v + 1);
              setBoardVersion(v => v + 1);
              setShowTileLayer(true);

              const letterPromises: Promise<void>[] = [];
              try {
                if (scoreOverlayRef?.current) {
                  for (const p of aiPlacements) {
                    const row = p.r;
                    const col = p.c;
                    const after = displayGrid[row]?.[col];
                    if (after && after.text && after.placedBy === "Opponent") {
                      const pr = scoreOverlayRef.current.showLetterPoints({
                        row,
                        col,
                        points: p.correct ? 1 : -1,
                        owner: "Opponent",
                        duration: 700,
                        position: "top-right",
                      }) ?? Promise.resolve();
                      letterPromises.push(pr);
                    }
                  }
                }
                await Promise.all(letterPromises);
              } catch (err) {
                console.warn("AI letter overlay promises failed:", err);
              }

              const aiCompletedIds: string[] = detectCompletedWords(result.newGrid, levelSolutionGrid);
              const newForAi = aiCompletedIds.filter(id => !completedWords.includes(id));

              if (newForAi.length > 0) {
                setCompletedWords(prev => ([...prev, ...newForAi]));

                const opponentBonus = newForAi.reduce((acc, id) => {
                  const decoded = decodeCompleteId(id);
                  return acc + (decoded ? decoded.points : 0);
                }, 0);
                if (opponentBonus > 0) {
                  setScores(prev => ({ ...prev, Opponent: (prev.Opponent ?? 0) + opponentBonus }));
                }

                for (const id of newForAi) {
                  if (wordsDisplayedRef.current.has(id)) continue;
                  const decoded = decodeCompleteId(id);
                  if (!decoded) continue;

                  const decodedSet = new Set<string>();
                  decoded.cells.forEach(p => decodedSet.add(`${p.r}-${p.c}`));

                  const highlightedGrid = (result.newGrid ?? []).map((row: any[]) => row.map((cell) => ({ ...cell })));

                  decodedSet.forEach(key => {
                    const [rStr, cStr] = key.split("-");
                    const r = parseInt(rStr, 10);
                    const c = parseInt(cStr, 10);
                    if (!Number.isNaN(r) && !Number.isNaN(c) && highlightedGrid[r] && highlightedGrid[r][c]) {
                      const cell = highlightedGrid[r][c];
                      const expected = (levelSolutionGrid[r]?.[c] ?? "").toString();
                      if (!cell.text && expected) {
                        cell.text = expected;
                        cell.type = "letter";
                        cell.placed = true;
                        cell.placedBy = "Opponent";
                      }
                      cell.wordHighlight = true;
                      if (cell.recentlyScored) delete (cell as any).recentlyScored;
                      if (cell.tentative) { delete (cell as any).tentative; delete (cell as any).tentativeBy; delete (cell as any).tentativeTileId; }
                    }
                  });

                  setGrid(highlightedGrid);
                  setBoardVersion(v => v + 1);
                  await new Promise<void>((res) => setTimeout(() => res(), 40));
                  try {
                    await (scoreOverlayRef.current?.showWordPoints({
                      cells: decoded.cells.map(p => ({ r: p.r, c: p.c })),
                      points: decoded.points,
                      owner: "Opponent",
                      duration: 900,
                      position: "center",
                    }) ?? Promise.resolve());
                  } catch (err) {
                    console.warn("AI word overlay failed:", err);
                  }

                  await new Promise<void>((res) => setTimeout(() => res(), 240));
                  setGrid(prev => prev.map(row => row.map(cell => {
                    const clone = { ...cell };
                    if (clone.wordHighlight) delete clone.wordHighlight;
                    return clone;
                  })));

                  setBoardVersion(v => v + 1);

                  wordsDisplayedRef.current.add(id);
                }
              }

              setTimeout(() => {
                setGrid(prev => prev.map((row) => row.map((cell) => {
                  const copy = { ...cell } as any;
                  if (copy.recentlyScored) delete copy.recentlyScored;
                  return copy;
                })));
              }, 120);

try {
  const aiDeck = Array.isArray(result.newDeck) ? result.newDeck.map(d => ({ ...d })) : null;
  const pending = pendingSubmitRef.current ?? null;

  const finalGrid = Array.isArray(result.newGrid) ? result.newGrid : grid;

  const returnsForPlayer = Array.isArray(pending?.returns) ? pending.returns.map(r => ({
    id: r.id ?? mkIdLocal((r.char ?? '').toString()),
    char: (r.char ?? '').toString().toUpperCase()
  })) : [];

  let baseForPlayerBuild: DeckItem[] = [];
  if (Array.isArray(pending?.existingDeck) && pending.existingDeck.length > 0) {
    baseForPlayerBuild = pending.existingDeck.map(d => ({ ...d }));
  } else if (Array.isArray(aiDeck) && aiDeck.length > 0) {
    baseForPlayerBuild = aiDeck.map(d => ({ ...d }));
  } else {
    baseForPlayerBuild = []; 
  }

  const playerDeckAfterAi = buildSmartDeck(
    baseForPlayerBuild,
    returnsForPlayer,
    finalGrid,
    levelSolutionGrid, 
    levelAllAvailableLetters,
    5
  );

  setLetterDeck(playerDeckAfterAi);
} catch (err) {
  console.warn("Ai onFinish: failed to compute/commit player's deck atomically", err);
  if (Array.isArray(result.newDeck)) setLetterDeck(result.newDeck);
} finally {
  pendingSubmitRef.current = null;
}

setTileLayerVersion(v => v + 1);
setBoardVersion(v => v + 1);
setShowTileLayer(true);

if (typeof result.scoreDelta === "number" && result.scoreDelta !== 0) {
  setScores(prev => ({ ...prev, Opponent: (prev.Opponent ?? 0) + result.scoreDelta }));
}


            } catch (err) {
              console.warn("AI onFinish handler failed:", err);
              try {
                setGrid(result.newGrid);
                if (result.scoreDelta && result.scoreDelta > 0) setScores(prev => ({ ...prev, Opponent: (prev.Opponent ?? 0) + result.scoreDelta }));
              } catch (_) { }
            } finally {
              aiScheduledRef.current = false;
              passInProgressRef.current = false;
              setIsSubmitting(false);
              setAiInProgress(false);
              setCurrentPlayer("You");

              setAiOverlayVisible(false);
              setAiOverlayPayload(null);
            }
          } } />
      )}
      <ScoreOverlay
        ref={scoreOverlayRef}
        boardLayout={boardLayoutOuter ?? boardLayoutInner}
        rows={rows}
        cols={cols}
        cellSize={CELL_SIZE} />


      <View
        style={{ alignSelf: "center", width: cols * CELL_SIZE, position: "relative" }}
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout;
          setBoardLayoutOuter({ x, y, width, height });
        } }
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.boardFrame}
        >
          <View
            key={`board-${boardVersion}`}
            style={[styles.board, { width: cols * CELL_SIZE, height: rows * CELL_SIZE }]}
            onLayout={(e) => {
              const { x, y, width, height } = e.nativeEvent.layout;
              setBoardLayoutInner({ x, y, width, height });
            } }

          >
            {grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, colIndex) => {
                  const tentativeForCell = tentativeMap.get(`${rowIndex}-${colIndex}`);
                  const displayChar = tentativeForCell ? tentativeForCell.char : cell.text;
                  const isNeon = !!(tentativeForCell || (cell.type === 'letter' && (cell.placed || cell.tentative)));

                  const baseStyle = getCellStyle(cell);

                  const hinted = hintedSet.has(`${rowIndex}-${colIndex}`);

return (
  <View
    key={`${rowIndex}-${colIndex}-wrap`}
    style={{
      width: CELL_SIZE,
      height: CELL_SIZE,
      position: 'relative',
      overflow: 'visible', 
    }}
  >
    <TouchableOpacity
      key={`${rowIndex}-${colIndex}`}
      style={[
        ...Array.isArray(baseStyle) ? baseStyle : [baseStyle],
        { width: CELL_SIZE, height: CELL_SIZE, justifyContent: 'center', alignItems: 'center' },
        isNeon && styles.neonCell,
        hinted && styles.hintCell,
        (cell.recentlyScored === 'correct' && styles.scoredCorrect) ||
        (cell.recentlyScored === 'wrong' && styles.scoredWrong) ||
        (cell.wordHighlight && styles.wordHighlightBorder),
      ]}
      onPress={() => boundPlaceLetter(rowIndex, colIndex)}
      disabled={uiLocked}
    >
      {cell.imageLocal ? (
        <Image
          source={cell.imageLocal}
          style={{
            width: Math.round(CELL_SIZE * 0.60),
            height: Math.round(CELL_SIZE * 0.60),
            margin: 0,
          }}
          resizeMode="contain"
          accessibilityLabel={cell.alt ?? ''}
        />
      ) : (() => {
        const typed = (cell as any).hintLines &&
          Array.isArray((cell as any).hintLines) &&
          (cell as any).hintLines.length > 0
            ? (cell as any).hintLines.map((h:any) => ({ text: (h.text||'').trim(), hintDir: h.hintDir }))
            : null;

        const slashParts = (!typed && typeof cell.text === 'string' && cell.text.includes('/'))
          ? cell.text.split('/').map(s => ({ text: s.trim() }))
          : null;

        if (cell.type === 'letter' || (displayChar && displayChar.length === 1 && cell.type !== 'clue')) {
          return (
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={{
                fontSize: Math.round(CELL_SIZE * 0.38),
                lineHeight: Math.round(CELL_SIZE * 0.56),
                fontWeight: '700',
                color: '#fff',
                textAlign: 'center',
                includeFontPadding: false,
              }}
            >
              {displayChar}
            </Text>
          );
        }

        if (cell.type === 'clue' && (typed || slashParts)) {
          const parts = typed ? typed : slashParts!;
          const CLUE_FONT = Math.max(8, Math.round(CELL_SIZE * 0.14));
          return (
            <View style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 2,
              paddingVertical: 2,
            }}>
              {parts.map((hl: any, idx: number) => (
                <View
                  key={idx}
                  style={{
                    width: '100%',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomWidth: idx === parts.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    borderBottomColor: 'rgba(255,255,255,0.14)',
                    paddingVertical: 0,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    allowFontScaling={true}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.45}
                    style={{
                      fontSize: CLUE_FONT + 1,
                      lineHeight: CLUE_FONT + 2,
                      fontWeight: '700',
                      color: '#F3E8FF',
                      textAlign: 'center',
                      includeFontPadding: false,
                      paddingHorizontal: 2,
                    }}
                  >
                    {hl.text}
                  </Text>
                </View>
              ))}
            </View>
          );
        }

        return (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.55}
            style={{
              fontSize: Math.max(9, Math.round(CELL_SIZE * 0.15)),
              lineHeight: Math.round(CELL_SIZE * 0.17) + 2,
              fontWeight: '700',
              color: '#F3E8FF',
              textAlign: 'center',
              includeFontPadding: false,
              paddingHorizontal: 2,
            }}
          >
            {cell.text}
          </Text>
        );
      })()}
    </TouchableOpacity>

    {(() => {
      const typed = (cell as any).hintLines && Array.isArray((cell as any).hintLines) && (cell as any).hintLines.length > 0
        ? (cell as any).hintLines.map((h:any) => ({ text: (h.text||'').trim(), hintDir: h.hintDir }))
        : null;

      const slashParts = (!typed && typeof cell.text === 'string' && cell.text.includes('/'))
        ? cell.text.split('/').map(s => ({ text: s.trim() }))
        : null;

      let showRight = false;
      let showDown = false;

      if (typed) {
        showRight = typed.some((h:any) => h.hintDir === 'across');
        showDown = typed.some((h:any) => h.hintDir === 'down');
        if (!showRight && !showDown && typed.length === 2) { showRight = true; showDown = true; }
      } else if (slashParts) {
        if (slashParts.length >= 2) { showRight = true; showDown = true; }
        else { showRight = cell.hintDir === 'across'; showDown = cell.hintDir === 'down'; }
      } else {
        showRight = cell.hintDir === 'across';
        showDown = cell.hintDir === 'down';
      }

      const eligibleForArrows = (cell.type === 'clue' || cell.type === 'icon');
      const ARROW_SIZE = Math.max(8, Math.round(CELL_SIZE * 0.14));
      const OUTER_OFFSET = Math.round(ARROW_SIZE + 2);

      const rightTop = (typed && typed.length === 2) || (slashParts && slashParts.length >= 2) ? '30%' : '50%';
      const rightMarginTop = -Math.round(ARROW_SIZE / 2);

      return (
        <>
          {eligibleForArrows && showRight && (
            <Text
              allowFontScaling={false}
              style={{
                position: 'absolute',
                right: -OUTER_OFFSET + 4,
                top: rightTop,
                marginTop: rightMarginTop,
                fontSize: ARROW_SIZE,
                lineHeight: ARROW_SIZE,
                color: 'rgba(255,255,255,0.95)',
                fontWeight: '800',
                textShadowColor: 'rgba(0,0,0,0.25)',
                textShadowRadius: 1,
                textShadowOffset: { width: 0, height: 0.5 },
              }}
            >
              ►
            </Text>
          )}

          {eligibleForArrows && showDown && (
            <Text
              allowFontScaling={false}
              style={{
                position: 'absolute',
                bottom: -OUTER_OFFSET + 2,
                left: '50%',
                marginLeft: -Math.round(ARROW_SIZE / 2),
                fontSize: ARROW_SIZE - 2,
                lineHeight: ARROW_SIZE,
                color: 'rgba(255,255,255,0.95)',
                fontWeight: '800',
                textShadowColor: 'rgba(0,0,0,0.25)',
                textShadowRadius: 1,
                textShadowOffset: { width: 0, height: 0.5 },
              }}
            >
              ▼
            </Text>
          )}
        </>
      );
    })()}
  </View>
);



                })}

              </View>
            ))}
          </View>
        </LinearGradient>

        {showTileLayer && boardLayoutInner && isMyTurn && (
          <DraggableTileLayer
            key={`tile-layer-${tileLayerVersion}`}
            tiles={draggableTiles}
            tileLayerVersion={tileLayerVersion}
            boardLayout={boardLayoutInner}
            rows={grid.length}
            cols={grid[0]?.length ?? 6}
            tileSize={42}
            snapThreshold={0.45}
            isCellOccupied={isCellOccupied}
            onTilePick={handleTilePick}
            onTileDropped={(tileId, r, c) => handleTileDrop(tileId, r, c)} />
        )}
      </View>

      <View style={[styles.letterDeckContainer, uiLocked && { opacity: 0.7 }]}>
        {(draggableTiles.length === 0 || aiInProgress || uiLocked) ? (
          <View style={styles.letterDeck}>
            {letterDeck.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.letterTile,
                  selectedLetterIndex === index && styles.selectedLetterTile,
                  uiLocked && { opacity: 0.2 }
                ]}
                onPress={() => { if (!uiLocked) setSelectedLetterIndex(index); } }
                disabled={uiLocked}
                accessibilityState={{ disabled: uiLocked }}
              >
                <Text style={styles.letterTileText}>{item.char}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ height: 70 }} />
        )}
      </View>

      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtonsInner}>
          <TouchableOpacity
            style={styles.shuffleButton}
            onPress={() => setSwapModalVisible(true)}
            disabled={uiLocked}
            accessibilityState={{ disabled: uiLocked }}
          >
            <Image
              source={require("../assets/swap.png")}
              style={{ width: 53, height: 53, resizeMode: "contain" }} />
          </TouchableOpacity>

          <TouchableOpacity
    style={styles.submitInnerBtn}
    onPress={handleSubmit}
    disabled={uiLocked}
    activeOpacity={0.85}
  >
          <LinearGradient
  colors={[ '#8C5CC7','#4B2E78',  '#2A184D']}  
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={[
    styles.submitGradientBtn,
    uiLocked && { opacity: 0.6 },
  ]}
>
  
    <Text style={styles.submitText}>Submit</Text>
  
</LinearGradient>
</TouchableOpacity>

          <HintButton hookResult={hints} disabled={currentPlayer !== "You" || isSubmitting || aiInProgress} />

        </View>
      </View>




      <SwapModal
        visible={swapModalVisible}
        onClose={() => setSwapModalVisible(false)}
        letterDeck={letterDeck}
        onSwap={(selectedIds) => {
          swapTiles({ ...logicProps, letterDeck, setLetterDeck }, selectedIds, (newDeck) => {
            reservedRef.current = {};
            setReservedVersion((v) => v + 1);
            setTileLayerVersion((v) => v + 1);
            setShowTileLayer(true);
          });
        } }
        onSwapAndPass={(selectedIds: string[]) => {
          swapTilesAndPass(
            { ...logicProps, letterDeck, setLetterDeck },
            selectedIds,
            (newDeck: DeckItem[], nextGrid?: GridCell[][]) => {
              reservedRef.current = {};
              setReservedVersion((v) => v + 1);
              setTileLayerVersion((v) => v + 1);
              setShowTileLayer(true);

              if (gameState?.mode === 'local') {
                if (!aiScheduledRef.current) {
                  aiScheduledRef.current = true;
                  setCurrentPlayer("Opponent");

                  const sourceGrid: GridCell[][] = Array.isArray(nextGrid) ? nextGrid : grid;

                  const cleanGridForAI: GridCell[][] = sourceGrid.map((row: GridCell[]) => row.map((cell: GridCell) => {
                    const c = { ...cell } as GridCell & Record<string, any>;
                    if ((c as any).recentlyScored) delete (c as any).recentlyScored;
                    return c;
                  })
                  );

                  startAiSequence({ ...logicProps, grid: cleanGridForAI, letterDeck: newDeck }, 1);
                }
              }
            }
          );
        } } />
      {gameState?.mode === 'pvp' && (
        <Chat matchId={gameState.matchId} playerId={gameState.playerId} visible={true} />
      )}

      <AdBanner />
    </LinearGradient></>
  )
}