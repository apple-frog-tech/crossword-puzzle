import { Alert } from "react-native"
import { LogicProps, GridCell, WordPattern, Scores, TurnPlacement, DeckItem } from "../types"
import { wordPatterns, allAvailableLetters, solutionGrid } from "../levels/level1"
import { styles } from "../styleSheet/styles"

const isEmptyCell = (cell: GridCell) => cell.type === "empty" && !cell.text
const DELAY_MS = 320;

type WordPatternsSource = WordPattern[] | { completeRows?: WordPattern[]; completeColumns?: WordPattern[] };

const normalizePatterns = (src?: WordPatternsSource): WordPattern[] => {
  if (!src) return [];
  if (Array.isArray(src)) return src;
  const rows = Array.isArray((src as any).completeRows) ? (src as any).completeRows : [];
  const cols = Array.isArray((src as any).completeColumns) ? (src as any).completeColumns : [];
  return [...rows, ...cols];
};

export const checkCompletedWords = (
  gridState: GridCell[][],
  completedWords: string[],
  setCompletedWords: LogicProps["setCompletedWords"],
  setScores: LogicProps["setScores"],
  setGameHistory: LogicProps["setGameHistory"],
  solutionGrid: string[][],
  wordPatternsLocal: WordPatternsSource = wordPatterns
) => {
  const newlyCompleted: string[] = [];

  const checkRowPattern = (p: WordPattern) => {
    if (p.row === undefined) return null;
    const r = p.row;
    const sc = (typeof p.startCol === "number") ? p.startCol : 0;
    const ec = (typeof p.endCol === "number") ? p.endCol : (solutionGrid[r]?.length ?? 0) - 1;

    let currentWord = "";
    let letterCount = 0;
    for (let c = sc; c <= ec; c++) {
      const expected = solutionGrid[r]?.[c] ?? "";
      if (!expected) continue;
      const cell = gridState[r][c];
      if (!cell?.text || cell.text.toUpperCase() !== expected.toUpperCase()) {
        return null; 
      }
      currentWord += cell.text.toUpperCase();
      letterCount++;
    }
    if (letterCount === 0) return null;
    return { word: currentWord, count: letterCount };
  };

  const checkColPattern = (p: WordPattern) => {
    if (p.col === undefined) return null;
    const c = p.col;
    const sr = (typeof p.startRow === "number") ? p.startRow : 0;
    const er = (typeof p.endRow === "number") ? p.endRow : (solutionGrid.length - 1);

    let currentWord = "";
    let letterCount = 0;
    for (let r = sr; r <= er; r++) {
      const expected = solutionGrid[r]?.[c] ?? "";
      if (!expected) continue;
      const cell = gridState[r][c];
      if (!cell?.text || cell.text.toUpperCase() !== expected.toUpperCase()) {
        return null;
      }
      currentWord += cell.text.toUpperCase();
      letterCount++;
    }
    if (letterCount === 0) return null;
    return { word: currentWord, count: letterCount };
  };

  const patternsRows = normalizePatterns(wordPatternsLocal);

  patternsRows.forEach((pat) => {
    const id = pat.row !== undefined
      ? `complete-row-${pat.row}-${pat.startCol ?? "0"}-${pat.endCol ?? "end"}`
      : pat.col !== undefined
      ? `complete-col-${pat.col}-${pat.startRow ?? "0"}-${pat.endRow ?? "end"}`
      : `complete-unknown-${pat.name}`;

    if (completedWords.includes(id)) return;

    let res = null;
    if (pat.row !== undefined) {
      res = checkRowPattern(pat);
    } else if (pat.col !== undefined) {
      res = checkColPattern(pat);
    }
    if (res && res.word === (pat.word ?? "").toUpperCase()) {
      newlyCompleted.push(id);
      setScores((prev: Scores) => ({ ...prev, You: prev.You + res.count }));
      setGameHistory((prev: string[]) => [
        ...prev,
        `🎉 Complete ${pat.name} finished! +${res.count} bonus points for: ${res.word}`,
      ]);
    }
  });

  if (newlyCompleted.length > 0) {
    setCompletedWords((prev) => [...prev, ...newlyCompleted]);
  }
};


export const detectCompletedWords = (
  gridState: GridCell[][],
  solutionGridLocal: string[][],
  wordPatternsLocal: WordPatternsSource = wordPatterns
): string[] => {
  const newlyCompleted: string[] = [];

  const checkRowPattern = (p: WordPattern) => {
    if (p.row === undefined) return null;
    const r = p.row;
    const sc = (typeof p.startCol === "number") ? p.startCol : 0;
    const ec = (typeof p.endCol === "number") ? p.endCol : (solutionGridLocal[r]?.length ?? 0) - 1;

    let currentWord = "";
    let letterCount = 0;
    for (let c = sc; c <= ec; c++) {
      const expected = solutionGridLocal[r]?.[c] ?? "";
      if (!expected) continue;
      const cell = gridState[r][c];
      if (!cell?.text || cell.text.toUpperCase() !== expected.toUpperCase()) {
        return null; // not complete
      }
      currentWord += cell.text.toUpperCase();
      letterCount++;
    }
    if (letterCount === 0) return null;
    return { word: currentWord, count: letterCount };
  };

  const checkColPattern = (p: WordPattern) => {
    if (p.col === undefined) return null;
    const c = p.col;
    const sr = (typeof p.startRow === "number") ? p.startRow : 0;
    const er = (typeof p.endRow === "number") ? p.endRow : (solutionGridLocal.length - 1);

    let currentWord = "";
    let letterCount = 0;
    for (let r = sr; r <= er; r++) {
      const expected = solutionGridLocal[r]?.[c] ?? "";
      if (!expected) continue;
      const cell = gridState[r][c];
      if (!cell?.text || cell.text.toUpperCase() !== expected.toUpperCase()) {
        return null;
      }
      currentWord += cell.text.toUpperCase();
      letterCount++;
    }
    if (letterCount === 0) return null;
    return { word: currentWord, count: letterCount };
  };

  const patterns = normalizePatterns(wordPatternsLocal);

  for (const pat of patterns) {
    const id =
      pat.row !== undefined
        ? `complete-row-${pat.row}-${pat.startCol ?? "0"}-${pat.endCol ?? "end"}`
        : pat.col !== undefined
        ? `complete-col-${pat.col}-${pat.startRow ?? "0"}-${pat.endRow ?? "end"}`
        : `complete-unknown-${pat.name ?? Math.random().toString(36).slice(2,6)}`;

    let res = null;
    if (pat.row !== undefined) res = checkRowPattern(pat);
    else if (pat.col !== undefined) res = checkColPattern(pat);

    if (res && res.word === (pat.word ?? "").toUpperCase()) {
      newlyCompleted.push(id);
    }
  }

  return newlyCompleted;
};




const getNeededLetters = (grid: GridCell[][], solutionGrid: string[][]) => {
  const neededLetters: string[] = []
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (isEmptyCell(cell)) {
        const expectedLetter = solutionGrid[rowIndex][colIndex]
        if (expectedLetter && !neededLetters.includes(expectedLetter)) {
          neededLetters.push(expectedLetter)
        }
      }
    })
  })
  return neededLetters
}

const mkId = (ch: string) => `${ch}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`


const getNeededCounts = (grid: GridCell[][], solutionGrid: string[][]): Record<string, number> => {
  const needed: Record<string, number> = {};
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      const expected = (solutionGrid[r]?.[c] ?? "").toUpperCase();
      const cell = grid[r]?.[c];
      if (expected && cell && cell.type === "empty" && !cell.text) {
        needed[expected] = (needed[expected] || 0) + 1;
      }
    }
  }
  return needed;
}

export const buildSmartDeck = (
  existingDeck: DeckItem[] = [],
  returns: { id?: string; char: string }[] = [],
  grid: GridCell[][],
  solutionGrid: string[][],
  allLettersPool: string[] = allAvailableLetters,
  targetSize: number = 5,
  consumedCounts: Record<string, number> = {} 
): DeckItem[] => {

  const REQUESTED = Math.max(0, targetSize);
  const neededCounts = getNeededCounts(grid, solutionGrid); 
  const emptyCellsRemaining = Object.values(neededCounts).reduce((s, v) => s + (v ?? 0), 0);

  const FINAL_TARGET = Math.min(REQUESTED, emptyCellsRemaining);

  if (FINAL_TARGET <= 0) return [];

  const totalSolutionCounts: Record<string, number> = {};
  for (let r = 0; r < solutionGrid.length; r++) {
    for (let c = 0; c < (solutionGrid[r]?.length ?? 0); c++) {
      const ch = (solutionGrid[r]?.[c] ?? '').toString().toUpperCase();
      if (!ch) continue;
      totalSolutionCounts[ch] = (totalSolutionCounts[ch] || 0) + 1;
    }
  }

  const placedCounts: Record<string, number> = {};
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      const t = (grid[r]?.[c]?.text ?? '').toString().toUpperCase();
      if (!t) continue;
      placedCounts[t] = (placedCounts[t] || 0) + 1;
    }
  }

  const existingDeckCounts: Record<string, number> = {};
  for (const d of existingDeck) {
    const ch = (d.char ?? '').toUpperCase();
    if (!ch) continue;
    existingDeckCounts[ch] = (existingDeckCounts[ch] || 0) + 1;
  }

  const returnsCounts: Record<string, number> = {};
  for (const r of returns) {
    const ch = (r.char ?? '').toUpperCase();
    if (!ch) continue;
    returnsCounts[ch] = (returnsCounts[ch] || 0) + 1;
  }

  const allowedForDeck: Record<string, number> = {};
  Object.entries(totalSolutionCounts).forEach(([ch, total]) => {
       const placed = placedCounts[ch] ?? 0;
    const existing = existingDeckCounts[ch] ?? 0;
    const ret = returnsCounts[ch] ?? 0;
    allowedForDeck[ch] = Math.max(0, total - placed - existing - ret);

  });

  const dynamicNeededPool = Object.keys(getNeededCounts(grid, solutionGrid)).map(s => s.toUpperCase());
  let pool: string[] = [];
  if (dynamicNeededPool.length > 0) {
    pool = Array.from(new Set(dynamicNeededPool));
  } else {
    const solPool = computeSolutionPool(solutionGrid);
    pool = solPool.length > 0 ? solPool : Array.from(new Set(allLettersPool.map(s => s.toUpperCase())));
  }

   const existingMapByChar: Record<string, DeckItem[]> = {};
  for (const d of existingDeck) {
    const ch = (d.char ?? "").toUpperCase();
    existingMapByChar[ch] = existingMapByChar[ch] || [];
    existingMapByChar[ch].push({ id: d.id, char: ch, originalIndex: (d as any).originalIndex ?? -1 });
  }

  const built: DeckItem[] = [];
  const countInBuilt = (ch: string) => built.reduce((n, it) => n + ((it.char ?? "").toUpperCase() === ch ? 1 : 0), 0);

  const canAddChar = (chRaw: string) => {
    const ch = (chRaw ?? '').toString().toUpperCase();
    const alreadyInBuilt = countInBuilt(ch);
    const allowed = allowedForDeck[ch] ?? FINAL_TARGET;
    return alreadyInBuilt < allowed && built.length < FINAL_TARGET;
  };


  for (const rItem of returns) {
    if (built.length >= FINAL_TARGET) break;
    const ch = (rItem.char ?? "").toString().toUpperCase();
    if (!ch) continue;
    built.push({ id: rItem.id ?? mkId(ch), char: ch });
  }

  const includedIds = new Set(built.map(b => b.id));
  for (const ch of Object.keys(existingMapByChar)) {
    existingMapByChar[ch] = existingMapByChar[ch].filter(item => !includedIds.has(item.id));
  }

  for (const ch of Object.keys(existingMapByChar)) {
    const list = existingMapByChar[ch];
    for (let i = 0; i < list.length && built.length < FINAL_TARGET; i++) {
      if (!canAddChar(ch)) break;
      built.push({ id: list[i].id, char: ch });
    }
  }

  for (const r of returns) {
    if (built.length >= FINAL_TARGET) break;
    const ch = (r.char ?? "").toString().toUpperCase();
    if (!ch) continue;
    built.push({ id: r.id ?? mkId(ch), char: ch });
  }

  const neededListGenerator = () => {
    const list: string[] = [];
    for (const [ch, need] of Object.entries(neededCounts)) {
      if ((need ?? 0) - countInBuilt(ch) > 0) list.push(ch);
    }
    return list;
  };

  while (built.length < FINAL_TARGET) {
    const needList = neededListGenerator();
    if (needList.length > 0) {
      const pick = needList[Math.floor(Math.random() * needList.length)];
      if (canAddChar(pick)) {
        built.push({ id: mkId(pick), char: pick });
        continue;
      }
    }

    const notPresent = pool.filter(p => countInBuilt(p) === 0 && canAddChar(p));
    if (notPresent.length > 0) {
      const pick = notPresent[Math.floor(Math.random() * notPresent.length)];
      built.push({ id: mkId(pick), char: pick });
      continue;
    }

    const allowedPool = pool.filter(p => canAddChar(p));
    if (allowedPool.length === 0) {
      break;
    }
    const pick = allowedPool[Math.floor(Math.random() * allowedPool.length)];
    built.push({ id: mkId(pick), char: pick });
  }

  const seenIds = new Set<string>();
  const finalCandidate: DeckItem[] = [];
  for (const it of built) {
    if (!it.id) it.id = mkId(it.char);
    if (seenIds.has(it.id)) continue;
    seenIds.add(it.id);
    finalCandidate.push(it);
  }

  const combinedCounts: Record<string, number> = {};
  Object.entries(placedCounts).forEach(([k, v]) => { combinedCounts[k] = v; });

  const finalFiltered: DeckItem[] = [];
  for (const it of finalCandidate) {
    const ch = (it.char ?? '').toString().toUpperCase();
    const curr = combinedCounts[ch] ?? 0;
    const allow = totalSolutionCounts[ch] ?? Number.MAX_SAFE_INTEGER;
    if (curr < allow && finalFiltered.length < FINAL_TARGET) {
      finalFiltered.push(it);
      combinedCounts[ch] = curr + 1;
    } else {
      console.warn("buildSmartDeck: dropped extra char to respect solution counts", { ch, curr, allow });
    }
  }

  while (finalFiltered.length < FINAL_TARGET) {
    const allowedPool = pool.filter(p => {
      const ch = p.toUpperCase();
      const curr = combinedCounts[ch] ?? 0;
      const allow = totalSolutionCounts[ch] ?? Number.MAX_SAFE_INTEGER;
      return curr < allow;
    });
    if (allowedPool.length === 0) break;
    const pick = allowedPool[Math.floor(Math.random() * allowedPool.length)];
    finalFiltered.push({ id: mkId(pick), char: pick });
    combinedCounts[pick] = (combinedCounts[pick] || 0) + 1;
  }

  if (finalFiltered.length > FINAL_TARGET) finalFiltered.splice(FINAL_TARGET);

  return finalFiltered;
}




export const refillLetterDeck = (props: LogicProps, targetSize: number = 5) => {
  const { grid, solutionGrid, setLetterDeck, setGameHistory, letterDeck } = props as any;

  const neededCounts = getNeededCounts(grid, solutionGrid);
  const emptyRemaining = Object.values(neededCounts).reduce((s, v) => s + (v ?? 0), 0);

  const effectiveTarget = Math.min(Math.max(0, targetSize), emptyRemaining);

  const existing = Array.isArray(letterDeck) ? [...letterDeck] : [];
  const returns: { id?: string; char: string }[] = []; // refill path has no returned tiles

  const nextDeck = buildSmartDeck(existing, returns, grid, solutionGrid, allAvailableLetters, effectiveTarget);

  setLetterDeck(nextDeck);
  setGameHistory((prev: string[]) => [...prev, `🔄 New letters provided: ${nextDeck.map(d => d.char).join(", ")}`]);
};



export const recordTentativePlacement = (
  rowIndex: number,
  colIndex: number,
  tileIndexOrChar: { tileIndex?: number; char?: string; originalIndex?: number; tileId?: string },
  props: LogicProps
): boolean => {
  const {
    currentPlayer,
    grid,
    letterDeck,
    setLetterDeck,
    setGrid,
    turnPlacements,
    setTurnPlacements,
  } = props;

  if (currentPlayer === "Opponent") return false;

  const cell = grid[rowIndex]?.[colIndex];
  if (!cell || cell.type !== "empty" || cell.text) return false;

  let char = "";
  let originalIndex = -1;
  let tileId: string | undefined = undefined;

  if (typeof tileIndexOrChar.tileIndex === "number") {
    const idx = tileIndexOrChar.tileIndex;
    if (idx < 0 || idx >= letterDeck.length) return false;
    char = letterDeck[idx].char;
    originalIndex = idx;
    tileId = letterDeck[idx].id;
  } else if (typeof tileIndexOrChar.tileId === "string") {
    tileId = tileIndexOrChar.tileId;
    const idx = letterDeck.findIndex(it => it.id === tileId);
    if (idx !== -1) {
      char = letterDeck[idx].char;
      originalIndex = idx;
    } else if (typeof tileIndexOrChar.char === "string") {
      char = tileIndexOrChar.char;
      originalIndex = typeof tileIndexOrChar.originalIndex === "number" ? tileIndexOrChar.originalIndex : -1;
    } else {
      return false;
    }
  } else if (tileIndexOrChar.char) {
    char = tileIndexOrChar.char;
    originalIndex = typeof tileIndexOrChar.originalIndex === "number" ? tileIndexOrChar.originalIndex : letterDeck.findIndex(it => it.char === char);
  } else {
    return false;
  }

  const finalTileId = tileId ?? `${char}#${Date.now()}#${Math.floor(Math.random() * 10000)}`;

  setGrid((prevGrid) =>
    prevGrid.map((r, ridx) =>
      r.map((c, cidx) => {
        if (ridx === rowIndex && cidx === colIndex) {
          return {
            ...c,
            text: char,
            type: "letter",
            tentative: true,
            tentativeBy: "You",
            tentativeTileId: finalTileId,
          } as GridCell;
        }
        return c;
      })
    )
  );

  if (tileId) {
    setLetterDeck((prev) => prev.filter(it => it.id !== tileId));
  } else if (typeof tileIndexOrChar.tileIndex === "number") {
    setLetterDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      const safeIdx = Math.min(Math.max(0, tileIndexOrChar.tileIndex!), newDeck.length - 1);
      newDeck.splice(safeIdx, 1);
      return newDeck;
    });
  } else {
    setLetterDeck((prevDeck) => {
      if (typeof tileIndexOrChar.originalIndex === "number" && tileIndexOrChar.originalIndex >= 0 && tileIndexOrChar.originalIndex < prevDeck.length) {
        const idx = tileIndexOrChar.originalIndex;
        if (prevDeck[idx].char === char) {
          const newDeck = [...prevDeck];
          newDeck.splice(idx, 1);
          return newDeck;
        }
      }
      const idx = prevDeck.findIndex(it => it.char === char);
      if (idx === -1) return prevDeck;
      const newDeck = [...prevDeck];
      newDeck.splice(idx, 1);
      return newDeck;
    });
  }

  const placement: TurnPlacement = {
    tileId: finalTileId,
    row: rowIndex,
    col: colIndex,
    char,
    originalIndex: originalIndex >= 0 ? originalIndex : (tileIndexOrChar.originalIndex ?? -1),
  };
  setTurnPlacements((prev) => [...prev, placement]);
  return true;
};

export const placeLetter = (rowIndex: number, colIndex: number, props: LogicProps) => {
  const {
    currentPlayer,
    selectedLetterIndex,
    setSelectedLetterIndex,
  } = props

  if (currentPlayer === "Opponent") return
  if (selectedLetterIndex === null) {
    return
  }

  const ok = recordTentativePlacement(rowIndex, colIndex, { tileIndex: selectedLetterIndex }, props)
  if (!ok) {
    return
  }
  setSelectedLetterIndex(null)

}

export const placeLetterAt = (
  rowIndex: number,
  colIndex: number,
  tileIndex: number,
  props: LogicProps
): boolean => {
  return recordTentativePlacement(rowIndex, colIndex, { tileIndex }, props)
}

export const placeLetterByChar = (
  rowIndex: number,
  colIndex: number,
  char: string,
  props: LogicProps & { originalIndex?: number; tileId?: string }
): boolean => {
  return recordTentativePlacement(rowIndex, colIndex, { char, originalIndex: props.originalIndex ?? -1, tileId: props.tileId }, props);
}

export const aiTurn = (props: LogicProps, moves: number = 1) => {
  const {
    grid,
    solutionGrid,
    setScores,
    setGameHistory,
    setGrid,
    setCurrentPlayer
  } = props as any;

  if (!grid || !solutionGrid) {
    if (typeof setCurrentPlayer === "function") setCurrentPlayer("You");
    return;
  }

  const aiAccuracy = 0.95; 
  const emptyCells: { r: number; c: number; expected: string }[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      const cell = grid[r][c];
      if (cell && cell.type === "empty" && !cell.text) {
        const expected = (solutionGrid[r]?.[c] ?? "").toUpperCase();
        emptyCells.push({ r, c, expected });
      }
    }
  }

  if (emptyCells.length === 0) {
    setGameHistory((prev: string[]) => [...prev, `🤖 AI found no empty cells to play.`]);
    if (typeof setCurrentPlayer === "function") setCurrentPlayer("You");
    return;
  }

  const neededCounts = getNeededCounts(grid, solutionGrid);

  const hasDeck = Array.isArray((props as any).letterDeck) && typeof (props as any).setLetterDeck === "function";
  const deckCopy: any[] = hasDeck ? [...(props as any).letterDeck] : [];

const newGrid = grid.map((row: GridCell[]) => row.map((cell: GridCell) => ({ ...cell })));

  const withExpected = emptyCells.filter(e => e.expected && e.expected.length > 0);
  const candidatesExpected = withExpected.filter(e => (neededCounts[e.expected] ?? 0) > 0);

  const pool: { r: number; c: number; expected: string }[] = [];

  if (candidatesExpected.length > 0) pool.push(...candidatesExpected);

  const remainingWithExpected = withExpected.filter(e => !candidatesExpected.includes(e));
  if (remainingWithExpected.length > 0) pool.push(...remainingWithExpected);

  const others = emptyCells.filter(e => !pool.includes(e));
  if (others.length > 0) pool.push(...others);

  const movesToDo = Math.min(moves, pool.length);

  let scoreDelta = 0;
  const placements: { r: number; c: number; placed: string; correct: boolean }[] = [];

for (let i = 0; i < movesToDo; i++) {
  const pickIndex = Math.floor(Math.random() * pool.length);
  const chosen = pool.splice(pickIndex, 1)[0];

  let letterToPlace = "";
  if (chosen.expected && Math.random() < aiAccuracy) {
    letterToPlace = chosen.expected.toUpperCase();
  } else {
    const weightedNeeded: string[] = [];
    Object.entries(neededCounts).forEach(([ch, cnt]) => { for (let k=0;k<cnt;k++) weightedNeeded.push((ch ?? "").toUpperCase()) });
    if (weightedNeeded.length > 0) {
      letterToPlace = weightedNeeded[Math.floor(Math.random() * weightedNeeded.length)];
    } else {
      const solPool = computeSolutionPool(solutionGrid);
      const fallbackPool = solPool.length > 0 ? solPool : Array.from(new Set(allAvailableLetters.map(s => s.toUpperCase())));
      if (fallbackPool.length === 0) break;
      letterToPlace = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
    }
  }

  letterToPlace = (letterToPlace ?? "").toUpperCase();

  if (hasDeck) {
    const idx = deckCopy.findIndex(d => (d.char ?? "").toUpperCase() === letterToPlace);
    if (idx !== -1) deckCopy.splice(idx, 1);
  }

  if (letterToPlace && neededCounts[letterToPlace]) {
    neededCounts[letterToPlace] = Math.max(0, neededCounts[letterToPlace] - 1);
  }

  const r = chosen.r;
  const c = chosen.c;
  const correctLetter = (solutionGrid[r]?.[c] ?? "").toUpperCase();
  const isCorrect = correctLetter && letterToPlace === correctLetter;

  if (isCorrect) {
    newGrid[r][c] = {
      ...newGrid[r][c],
      text: letterToPlace,
      type: "letter",
      placed: true,
      placedBy: "Opponent",
      tentative: false,
      tentativeBy: undefined,
      tentativeTileId: undefined,
    };
    scoreDelta += 1;
    setGameHistory((prev: string[]) => [...prev, `🤖 AI placed ${letterToPlace} correctly at (${r},${c}) — +1`]);
  } else {
    newGrid[r][c] = {
      ...newGrid[r][c],
      text: "",
      type: "empty",
      placed: false,
      placedBy: undefined,
      tentative: false,
      tentativeBy: undefined,
      tentativeTileId: undefined,
    };
    scoreDelta -= 1;
    setGameHistory((prev: string[]) => [...prev, `🤖 AI placed ${letterToPlace} at (${r},${c}) — incorrect (-1)`]);
  }

  placements.push({ r, c, placed: letterToPlace, correct: isCorrect });
}

  if (typeof setScores === "function" && scoreDelta !== 0) {
  setScores((prev: any) => ({ ...prev, Opponent: prev.Opponent + scoreDelta }));
}


  if (typeof setGrid === "function") setGrid(newGrid);

  if (typeof setCurrentPlayer === "function") setCurrentPlayer("You");
};





export const passTurn = (props: LogicProps, onComplete?: (newDeck: DeckItem[], nextGrid: GridCell[][]) => void) => {
  const {
    currentPlayer,
    setCurrentPlayer,
    setGameHistory,
    setLetterDeck,
    turnPlacements,
    setTurnPlacements,
    solutionGrid,
    setGrid,
    setScores,
    grid,
  } = props;

  setGameHistory((prev) => [...prev, `${currentPlayer} passed their turn`]);
  console.log("passTurn: incoming turnPlacements:", JSON.stringify(turnPlacements));
  console.log("passTurn: grid snapshot BEFORE processing:", grid.map(r => r.map(c => c.text)));

  if (currentPlayer === "You") {
    if (turnPlacements && turnPlacements.length > 0) {
      let scoreDelta = 0;
      const returns: { id?: string; char: string; originalIndex: number }[] = [];

const nextGrid: GridCell[][] = grid.map((r: GridCell[]) =>
  r.map((c: GridCell) => ({
    ...c,
    tentative: false,
    tentativeBy: undefined,
    tentativeTileId: undefined,
  }))
);


      turnPlacements.forEach((p) => {
        const expected = solutionGrid[p.row]?.[p.col] ?? "";
        const placedChar = p.char ?? "";
        const isCorrect = expected && placedChar.toUpperCase() === expected.toUpperCase();

        console.log(`passTurn: placement (${p.row},${p.col}) char='${placedChar}' expected='${expected}' -> ${isCorrect ? "CORRECT" : "WRONG"}`);

        if (isCorrect) {
          scoreDelta += 1;
          setGameHistory((prev) => [
            ...prev,
            `✅ Correct! +1 point for ${p.char} at (${p.row},${p.col})`,
          ]);
          nextGrid[p.row][p.col] = {
            ...nextGrid[p.row][p.col],
            text: p.char,
            type: "letter",
            placed: true,
            placedBy: "You",
            tentative: false,
            tentativeBy: undefined,
            tentativeTileId: undefined,
          };
        } else {
         returns.push({ id: p.tileId ?? mkId(p.char), char: (p.char ?? '').toString().toUpperCase(), originalIndex: p.originalIndex ?? -1 });

          setGameHistory((prev) => [
            ...prev,
            `❌ Wrong placement of ${p.char} at (${p.row},${p.col}). Returned to deck.`,
          ]);
          nextGrid[p.row][p.col] = {
            ...nextGrid[p.row][p.col],
            text: "",
            type: "empty",
            placed: false,
            placedBy: undefined,
            tentative: false,
            tentativeBy: undefined,
            tentativeTileId: undefined,
          };
        }
      });

      setGrid(nextGrid);
      console.log("passTurn: nextGrid after processing:", nextGrid.map(r => r.map(c => c.text)));

const TARGET = 5;
const existingDeck = Array.isArray((props as any).letterDeck) ? [...(props as any).letterDeck] : [];
const builtDeck = buildSmartDeck(existingDeck, returns, nextGrid, solutionGrid, allAvailableLetters, TARGET);

setGameHistory((prev) => [...prev, `🔄 Deck updated: ${builtDeck.map(d => d.char).join(", ")}`]);
setTimeout(() => {
  setLetterDeck(builtDeck);
}, DELAY_MS);

if (typeof onComplete === "function") {
  onComplete(builtDeck, nextGrid);
}

      if (scoreDelta > 0) {
        setScores((prev) => ({ ...prev, You: prev.You + scoreDelta }));
      }
      

      setTurnPlacements([]);
    }
  }
  setCurrentPlayer((prev) => (prev === "You" ? "Opponent" : "You"));
};

type SubmitCallback = (
  existingDeckFromSubmit: DeckItem[] | null,
  returnsFromSubmit: { id?: string; char: string }[] | null,
  nextGrid: GridCell[][]
) => void;

export const submitTurn = (
  props: LogicProps & { letterDeck: DeckItem[] },
  onComplete?: SubmitCallback
) => {
  const {
    currentPlayer,
    setCurrentPlayer,
    setGameHistory,
    turnPlacements,
    setTurnPlacements,
    solutionGrid,
    setScores,
    grid,
    letterDeck,
  } = props as LogicProps & { letterDeck: DeckItem[]; setCurrentPlayer: (v: "You" | "Opponent") => void };

  setGameHistory((prev) => [...prev, `${currentPlayer} submitted their tentative placements`]);

  if (currentPlayer !== "You") {
    setGameHistory((prev) => [...prev, `Submission ignored - not your turn.`]);
    if (typeof onComplete === "function") onComplete(letterDeck ?? [],[], grid);
    return;
  }

  let placements: TurnPlacement[] = Array.isArray(turnPlacements) ? [...turnPlacements] : [];

  if (!placements || placements.length === 0) {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell && cell.tentative && cell.tentativeBy === "You") {
          placements.push({
            tileId: cell.tentativeTileId,
            row: r,
            col: c,
            char: cell.text || "",
            originalIndex: -1,
          });
        }
      }
    }
  }

  if (!placements || placements.length === 0) {
    setGameHistory((prev) => [...prev, `No tentative placements to submit.`]);
    if (typeof onComplete === "function") onComplete(letterDeck ?? [],[], grid);
    return;
  }

  let scoreDelta = 0;
  const returns: { id?: string; char: string; originalIndex?: number }[] = [];

  const nextGrid: GridCell[][] = grid.map((row) => row.map((c) => ({ ...c })));
  

  for (const p of placements) {
    const expected = solutionGrid[p.row]?.[p.col] ?? "";
    const placedChar = p.char ?? "";
    const isCorrect = expected && placedChar.toUpperCase() === expected.toUpperCase();

    if (isCorrect) {
      scoreDelta += 1;
      setGameHistory((prev) => [...prev, `✅ Correct! +1 point for ${p.char} at (${p.row},${p.col})`]);
      nextGrid[p.row][p.col] = {
        ...nextGrid[p.row][p.col],
        text: p.char,
        type: "letter",
        placed: true,
        placedBy: "You",
        tentative: false,
        tentativeBy: undefined,
        tentativeTileId: undefined,
      } as GridCell;
    } else {
    returns.push({ id: p.tileId ?? mkId(p.char), char: (p.char ?? '').toString().toUpperCase(), originalIndex: p.originalIndex ?? -1 });

      setGameHistory((prev) => [...prev, `❌ Wrong placement of ${p.char} at (${p.row},${p.col}). Returned to deck.`]);
      nextGrid[p.row][p.col] = {
        ...nextGrid[p.row][p.col],
        text: "",
        type: "empty",
        placed: false,
        placedBy: undefined,
        tentative: false,
        tentativeBy: undefined,
        tentativeTileId: undefined,
      } as GridCell;
    }
  }

  if (scoreDelta > 0) {
    setScores((prev) => ({ ...prev, You: prev.You + scoreDelta }));
  }

const existingDeck = Array.isArray(letterDeck) ? [...letterDeck] : [];

setTurnPlacements([]);

if (typeof onComplete === "function") {
  onComplete(existingDeck, returns, nextGrid);
}

if (typeof setCurrentPlayer === "function") {
  setCurrentPlayer("Opponent");
}
return;

};

export const cancelTentativePlacements = (props: LogicProps & { targetDeckSize?: number }) => {
  const { grid, setGrid, turnPlacements, setTurnPlacements, setLetterDeck, solutionGrid, setGameHistory, letterDeck } = props as LogicProps & { targetDeckSize?: number; letterDeck: DeckItem[] };
  const TARGET = props.targetDeckSize ?? 5;

  const nextGrid = grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      tentative: false,
      tentativeBy: undefined,
      tentativeTileId: undefined,
      text: cell.tentative ? "" : cell.text,
      type: cell.tentative ? "empty" : cell.type,
    }))
  );

  const returns: { id?: string; char: string }[] = [];
  if (turnPlacements && turnPlacements.length > 0) {
    for (const p of turnPlacements) {
      returns.push({ id: p.tileId ?? mkId(p.char), char: (p.char ?? '').toString().toUpperCase() });

    }
  }

const existingDeck = Array.isArray(letterDeck) ? [...letterDeck] : [];
const builtDeck = buildSmartDeck(existingDeck, returns, nextGrid, solutionGrid, allAvailableLetters, TARGET);


  setGrid(nextGrid);
  setLetterDeck(builtDeck);
  setTurnPlacements([]);
  setGameHistory((prev) => [...prev, `↩️ Tentative placements cancelled; deck rebuilt: ${builtDeck.map(d => d.char).join(", ")}`]);
};




export const resetGame = (props: LogicProps) => {
  const { puzzleData, setGrid, setLetterDeck, setSelectedLetterIndex, setCurrentPlayer, setScores, setGameHistory, setCompletedWords, setTurnPlacements } = props
  setGrid(puzzleData.grid)
  const initial = ["L", "H", "A", "O", "E"].map((ch, i) => ({ id: `d-init-${i}-${ch}`, char: ch }))
  setLetterDeck(initial)
  setSelectedLetterIndex(null)
  setCurrentPlayer("You")
  setScores({ You: 0, Opponent: 7 })
  setGameHistory([])
  setCompletedWords([])
  setTurnPlacements([])
}

export const getCellStyle = (cell: GridCell) => {
  switch (cell.type) {
    case "clue":
      return [styles.cell, styles.clueCell]
    case "letter":
      return [styles.cell, styles.letterCell]
    case "empty":
      return [styles.cell, styles.emptyCell]
    case "special":
      return [styles.cell, styles.specialCell]
    case "icon":
      return [styles.cell, styles.iconCell]
    default:
      return [styles.cell, styles.emptyCell]
  }
}

export const swapTiles = (
  props: LogicProps & { letterDeck: DeckItem[] },
  selectedTileIds: string[],
  onComplete?: (newDeck: DeckItem[]) => void
) => {
  const { letterDeck = [], setLetterDeck, setGameHistory, grid, solutionGrid } =
    props as any;

  const TARGET = 5;

  if (!Array.isArray(selectedTileIds) || selectedTileIds.length === 0) {
    if (typeof onComplete === "function") onComplete(letterDeck ?? []);
    return;
  }

  const currentIds = new Set<string>((letterDeck || []).map((d: DeckItem) => d.id));
  const selectedFound = selectedTileIds.filter((id) => currentIds.has(id));

  if (selectedFound.length === 0) {
    console.warn("swapTiles: selected IDs not found in current letterDeck", {
      selectedTileIds,
      deckIds: (letterDeck || []).map((d: DeckItem) => d.id),
    });
    if (typeof onComplete === "function") onComplete(letterDeck ?? []);
    return;
  }

  const existingDeck: DeckItem[] = (letterDeck || []).filter((d: DeckItem) => !selectedFound.includes(d.id));

  const returns: { id?: string; char: string }[] = [];

  const newDeck: DeckItem[] = buildSmartDeck(existingDeck, returns, (grid ?? []), (solutionGrid ?? []), allAvailableLetters, TARGET);

  console.log("swapTiles DEBUG -> selected:", selectedFound, "existingLen:", existingDeck.length, "newLen:", newDeck.length);

  if (typeof setLetterDeck === "function") setLetterDeck(newDeck);

  if (typeof setGameHistory === "function") {
    const swappedChars = selectedFound
      .map(id => (letterDeck || []).find((d: DeckItem) => d.id === id)?.char ?? '?')
      .map(c => (c ?? '').toUpperCase());
    setGameHistory((prev: string[]) => [...prev, `🔁 You swapped ${swappedChars.join(", ")} → ${newDeck.map(d => d.char).join(", ")}`]);
  }

  if (typeof onComplete === "function") onComplete(newDeck);
};


export const swapTilesAndPass = (
  props: LogicProps & { letterDeck: DeckItem[] },
  selectedTileIds: string[],
  onComplete?: (newDeck: DeckItem[], nextGrid?: any) => void
) => {
  const { setCurrentPlayer } = props as any;

  swapTiles(props, selectedTileIds, (newDeck) => {
    if (typeof setCurrentPlayer === "function") setCurrentPlayer("Opponent");

    setTimeout(() => {
      try {
        const propsSnapshot = { ...props, letterDeck: newDeck };

        aiTurn(propsSnapshot as any);

        if (typeof onComplete === "function") onComplete(newDeck);
      } catch (err) {
        console.warn("swapTilesAndPass: aiTurn failed:", err);
        if (typeof onComplete === "function") onComplete(newDeck);
      }
    }, 120); 
  });
};

const computeNeededCountsAsList = (grid: GridCell[][], solutionGridLocal: string[][]): string[] => {
  const needed: Record<string, number> = {};
  if (!Array.isArray(grid) || !Array.isArray(solutionGridLocal)) return [];

  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < (row?.length ?? 0); c++) {
      const expected = (solutionGridLocal[r]?.[c] ?? "").toUpperCase();
      const cell = row[c];
      if (expected && cell && cell.type === "empty" && !cell.text) {
        needed[expected] = (needed[expected] || 0) + 1;
      }
    }
  }

  const expanded: string[] = [];
  Object.entries(needed).forEach(([k, v]) => {
    for (let i = 0; i < v; i++) expanded.push(k);
  });

  if (expanded.length === 0) return [];
  return Array.from(new Set(expanded));
};


export const computeNeededPool = (grid: GridCell[][], solutionGrid: string[][]) => {
  const neededCounts = getNeededCounts(grid, solutionGrid); 
  const keys = Object.keys(neededCounts).map(k => k.toUpperCase());
  return Array.from(new Set(keys));
};

export const computeSolutionPool = (solutionGrid: string[][]) => {
  const flat = solutionGrid.flat().filter(Boolean).map(s => (s ?? "").toUpperCase());
  return Array.from(new Set(flat));
};