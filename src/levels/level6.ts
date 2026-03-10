import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "WINNER", id: "top-1", hintDir: "down" },     
      { type: "clue", text: "_N__IA", id: "top-2", hintDir: "down" },      
      { type: "clue", text: "SOUTH AMERICA", id: "top-3", hintDir: "down" }, 
      { type: "clue", text: "__APE", id: "top-4", hintDir: "down" },
      { type: "clue", text: "LETTER", id: "top-5", hintDir: "down" },     
      { type: "clue", text: "HEARING ORGANS", id: "top-6", hintDir: "down" },// EARS - IMAGE
    ],

    // ---------- ROW 1 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level6/15.png"), id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level6/16.png"), alt: "bamboo", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "clue", text: "ALPHABET / ELON MUSK", id: "2-5", hintDir: "down" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "BEFORE NOON", id: "left-3", hintDir: "across" },
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "M___IX / PAST", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "BEFORE N", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "clue", text: "GORILLAS / CURVE", id: "4-2", hintDir: "down" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "SHEETS OF PAPER", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "clue", text: "1", id: "5-6", hintDir: "down" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "_S__", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "clue", text: "__AN / TOWARDS", id: "6-4", hintDir: "down" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "ORANGE COUNTY", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1"},
      { type: "empty", text: "", id: "7-2" },
      { type: "clue", text: "SUNBURN / SIP", id: "7-3", hintDir: "down" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "NOT", id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1"},
      { type: "clue", text: "__LO", id: "8-2",  hintDir: "across"  }, 
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "clue", text: "EEL", id: "8-5",  hintDir: "across"  },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["",    "",  "",  "",  "",  "",  ""],
  ["",   "C", "A", "S", "T", "L", "E"], // row 1
  ["",   "H", "E", "A", "R", "",  "A"], // row 2
  ["",   "A", "M", "", "A", "T", "R"], // row 3
  ["",   "M", "", "A", "P",  "E", "S"], // row 4
  ["",   "P", "A", "G", "E", "S", ""], // row 5
  ["",   "I", "R", "O", "", "L", "O"], // row 6
  ["",   "O", "C", "", "T", "A", "N"], // row 7
  ["",   "N", " ", "S", "O", "", "E"], // row 8 (space treated as empty in puzzleData)
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "CASTLE", name: "Row1 CASTLE" },
    { row: 2, startCol: 1, endCol: 4, word: "HEAR", name: "Row2 HEAR" },
    { row: 2, startCol: 6, endCol: 6, word: "A", name: "Row2 A" },
    { row: 3, startCol: 1, endCol: 2, word: "AM", name: "Row3 AM" },
    { row: 3, startCol: 4, endCol: 6, word: "ATR", name: "Row3 ATR" },
    { row: 4, startCol: 1, endCol: 1, word: "M", name: "Row4 M" },
    { row: 4, startCol: 3, endCol: 6, word: "APES", name: "Row4 APES" },
    { row: 5, startCol: 1, endCol: 5, word: "PAGES", name: "Row5 PAGES" },
    { row: 6, startCol: 1, endCol: 3, word: "IRO", name: "Row6 IRO" },
    { row: 6, startCol: 5, endCol: 6, word: "LO", name: "Row6 LO" },
    { row: 7, startCol: 1, endCol: 2, word: "OC", name: "Row7 OC" },
    { row: 7, startCol: 4, endCol: 6, word: "TAN", name: "Row7 TAN" },
    { row: 8, startCol: 1, endCol: 1, word: "N", name: "Row8 N" },
    { row: 8, startCol: 3, endCol: 4, word: "SO", name: "Row8 SO" },
    { row: 8, startCol: 6, endCol: 6, word: "E", name: "Row8 E" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "CHAMPION", name: "Col1 CHAMPION" },
    { col: 2, startRow: 1, endRow: 3, word: "AEM", name: "Col2 AEM" },
    { col: 2, startRow: 5, endRow: 7, word: "ARC", name: "Col2 ARC" },
    { col: 3, startRow: 1, endRow: 2, word: "SA", name: "Col3 SA" },
    { col: 3, startRow: 4, endRow: 6, word: "AGO", name: "Col3 AGO" },
    { col: 3, startRow: 8, endRow: 8, word: "S", name: "Col3 S" },
    { col: 4, startRow: 1, endRow: 5, word: "TRAPE", name: "Col4 TRAPE" },
    { col: 4, startRow: 7, endRow: 8, word: "TO", name: "Col4 TO" },
    { col: 5, startRow: 1, endRow: 1, word: "L", name: "Col5 L" },
    { col: 5, startRow: 3, endRow: 7, word: "TESLA", name: "Col5 TESLA" },
    { col: 6, startRow: 1, endRow: 4, word: "EARS", name: "Col6 EARS" },
    { col: 6, startRow: 6, endRow: 8, word: "ONE", name: "Col6 ONE" },
  ],
};


const solutionLetters = Array.from(
  new Set(
    solutionGrid
      .flat()
      .filter(s => s && s.trim() !== "") // remove empty strings and lone spaces
      .map(s => (s ?? "").toUpperCase())
  )
);

// export this instead of a hard-coded list
export const allAvailableLetters = solutionLetters;

// small starter set (change as you like)
export const initialLetters = ["P", "C", "I", "A", "A"];