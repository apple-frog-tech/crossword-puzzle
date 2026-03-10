import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level16/32.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "CRUEL", id: "top-2", hintDir: "down" },             // RUTHLESS
      { type: "clue", text: "D_O_", id: "top-3", hintDir: "down" },// OR
      { type: "clue", text: "ARMED CONFLICT", id: "top-4", hintDir: "down" },         // WAR
      { type: "clue", text: "BEFORE U", id: "top-5", hintDir: "down" },              // T
      { type: "clue", text: "ONE WHO HATES", id: "top-6", hintDir: "down" },         // HATER
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "DEVELOPMENT", id: "left-1", hintDir: "across" }, // GROWTH
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "ENERGY", id: "left-2", hintDir: "across" }, // AURA
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "clue", text: "AMERICA / DAIRY ITEM", id: "2-5", hintDir: "down" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "_IGH_", id: "left-3", hintDir: "across" }, // RT (fragment)
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "___HM / SLEEP", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "LEFT HAND SIZE", id: "left-4", hintDir: "across" }, // LHS
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "clue", text: "_R_ / C___", id: "4-4", hintDir: "down" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "___ T_ETHE_", id: "left-5", hintDir: "across" }, // ALLOGR (fragment)
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "_____U_", id: "left-6", hintDir: "across" }, // NEEDU (fragment)
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "clue", text: "ALSO", id: "6-6", hintDir: "down" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "_I_____ION", id: "left-7", hintDir: "across" }, // DSPERS
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "SOCIAL STUDIES", id: "left-8", hintDir: "across" }, // SST
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "clue", text: "__ AND FRO", id: "8-4", hintDir: "across" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "G", "R", "O", "W", "T", "H"],
  ["", "A", "U", "R", "A", "", "A"],
  ["", "R", "T", "", "R", "Y", "T"],
  ["", "L", "H", "S", "", "O", "E"],
  ["", "A", "L", "L", "O", "G", "R"],
  ["", "N", "E", "E", "D", "U", ""],
  ["", "D", "S", "P", "E", "R", "S"],
  ["", "S", "S", "T", "", "T", "O"],
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "GROWTH", name: "Row1 GROWTH" },
    { row: 2, startCol: 1, endCol: 4, word: "AURA", name: "Row2 AURA" },
    { row: 2, startCol: 6, endCol: 6, word: "A", name: "Row2 A" },
    { row: 3, startCol: 1, endCol: 2, word: "RT", name: "Row3 RT" },
    { row: 3, startCol: 4, endCol: 6, word: "RYT", name: "Row3 RYT" },
    { row: 4, startCol: 1, endCol: 3, word: "LHS", name: "Row4 LHS" },
    { row: 4, startCol: 5, endCol: 6, word: "OE", name: "Row4 OE" },
    { row: 5, startCol: 1, endCol: 6, word: "ALLOGR", name: "Row5 ALLOGR" },
    { row: 6, startCol: 1, endCol: 5, word: "NEEDU", name: "Row6 NEEDU" },
    { row: 7, startCol: 1, endCol: 6, word: "DSPERS", name: "Row7 DSPERS" },
    { row: 8, startCol: 1, endCol: 3, word: "SST", name: "Row8 SST" },
    { row: 8, startCol: 5, endCol: 6, word: "TO", name: "Row8 TO" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "GARLANDS", name: "Col1 GARLANDS" },
    { col: 2, startRow: 1, endRow: 8, word: "RUTHLESS", name: "Col2 RUTHLESS" },
    { col: 3, startRow: 1, endRow: 2, word: "OR", name: "Col3 OR" },
    { col: 3, startRow: 4, endRow: 8, word: "SLEPT", name: "Col3 SLEPT" },
    { col: 4, startRow: 1, endRow: 3, word: "WAR", name: "Col4 WAR" },
    { col: 4, startRow: 5, endRow: 7, word: "ODE", name: "Col4 ODE" },
    { col: 5, startRow: 1, endRow: 1, word: "T", name: "Col5 T" },
    { col: 5, startRow: 3, endRow: 8, word: "YOGURT", name: "Col5 YOGURT" },
    { col: 6, startRow: 1, endRow: 5, word: "HATER", name: "Col6 HATER" },
    { col: 6, startRow: 7, endRow: 8, word: "SO", name: "Col6 SO" },
  ],
};

const solutionLetters = Array.from(
  new Set(
    solutionGrid
      .flat()
      .filter((s) => s && s.trim() !== "")
      .map((s) => (s ?? "").toUpperCase())
  )
);

// export this instead of a hard-coded list
export const allAvailableLetters = solutionLetters;

// starter letters (changeable)
export const initialLetters = ["A", "D", "E", "G", "H"];