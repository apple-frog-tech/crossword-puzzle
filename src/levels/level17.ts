import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level17/33.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "M_T", id: "top-2", hintDir: "down" },            
      { type: "clue", text: "FO__", id: "top-3", hintDir: "down" },
      { type: "clue", text: "TARGET", id: "top-4", hintDir: "down" },        
      { type: "icon", text: "", imageLocal: require("../assets/levels/level17/35.png"), id: "top-5", hintDir: "down" },
      { type: "clue", text: "COLLEGE TERM", id: "top-6", hintDir: "down" },       
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "GEM WEIGHTS", id: "left-1", hintDir: "across" }, 
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "2ND AFTER G", id: "left-2", hintDir: "across" }, 
      { type: "empty", text: "", id: "2-1" },
      { type: "clue", text: "WEARY / SOLID MATERIALS", id: "2-2" , hintDir: "down" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5"},
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "NAUTICAL MILE", id: "left-3", hintDir: "across" }, 
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "___ENT / TERM", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "RECENT", id: "left-4", hintDir: "across" }, 
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "clue", text: "PA__ / LEGAL ENTITY", id: "4-4", hintDir: "down" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "______", id: "left-5", hintDir: "across" }, 
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "FEMALE HORSE", id: "left-6", hintDir: "across" }, 
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "clue", text: "2ND AFTER R / CH__S", id: "6-5", hintDir: "down" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level17/34.png"), id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "clue", text: "ARAB EMIRATES / HOUR", id: "7-4", hintDir: "down" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "NOVA SCOTIA", id: "left-8", hintDir: "across" }, 
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "clue", text: "___SE", id: "8-3" , hintDir: "across" },
      { type: "empty", text: "", id: "8-4"},
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "C", "A", "R", "A", "T", "S"],
  ["", "I", "",  "T", "I", "R", "E"],
  ["", "N", "M", "", "M", "O", "M"],
  ["", "N", "E", "W", "", "L", "E"],
  ["", "A", "T", "O", "L", "L", "S"],
  ["", "M", "A", "R", "E", "", "T"],
  ["", "O", "L", "D", "", "A", "E"],
  ["", "N", "S", "", "H", "O", "R"],
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "CARATS", name: "Row1 CARATS" },
    { row: 2, startCol: 1, endCol: 1, word: "I", name: "Row2 I" },
    { row: 2, startCol: 3, endCol: 6, word: "TIRE", name: "Row2 TIRE" },
    { row: 3, startCol: 1, endCol: 2, word: "NM", name: "Row3 NM" },
    { row: 3, startCol: 4, endCol: 6, word: "MOM", name: "Row3 MOM" },
    { row: 4, startCol: 1, endCol: 3, word: "NEW", name: "Row4 NEW" },
    { row: 4, startCol: 5, endCol: 6, word: "LE", name: "Row4 LE" },
    { row: 5, startCol: 1, endCol: 6, word: "ATOLLS", name: "Row5 ATOLLS" },
    { row: 6, startCol: 1, endCol: 4, word: "MARE", name: "Row6 MARE" },
    { row: 6, startCol: 6, endCol: 6, word: "T", name: "Row6 T" },
    { row: 7, startCol: 1, endCol: 3, word: "OLD", name: "Row7 OLD" },
    { row: 7, startCol: 5, endCol: 6, word: "AE", name: "Row7 AE" },
    { row: 8, startCol: 1, endCol: 2, word: "NS", name: "Row8 NS" },
    { row: 8, startCol: 4, endCol: 6, word: "HOR", name: "Row8 HOR" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "CINNAMON", name: "Col1 CINNAMON" },
    { col: 2, startRow: 1, endRow: 1, word: "A", name: "Col2 A" },
    { col: 2, startRow: 3, endRow: 8, word: "METALS", name: "Col2 METALS" },
    { col: 3, startRow: 1, endRow: 2, word: "RT", name: "Col3 RT" },
    { col: 3, startRow: 4, endRow: 7, word: "WORD", name: "Col3 WORD" },
    { col: 4, startRow: 1, endRow: 3, word: "AIM", name: "Col4 AIM" },
    { col: 4, startRow: 5, endRow: 6, word: "LE", name: "Col4 LE" },
    { col: 4, startRow: 8, endRow: 8, word: "H", name: "Col4 H" },
    { col: 5, startRow: 1, endRow: 5, word: "TROLL", name: "Col5 TROLL" },
    { col: 5, startRow: 7, endRow: 8, word: "AO", name: "Col5 AO" },
    { col: 6, startRow: 1, endRow: 8, word: "SEMESTER", name: "Col6 SEMESTER" },
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
export const initialLetters = ["A", "R", "I", "H", "T"];