import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "WITHOUT ENERGY", id: "top-1", hintDir: "down" },   
      { type: "clue", text: "ARAB LEADER", id: "top-2", hintDir: "down" },            
      { type: "clue", text: "13TH LETTER", id: "top-3", hintDir: "down" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level18/36.png"), id: "top-4", hintDir: "down" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level18/37.png"), id: "top-5", hintDir: "down" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level18/38.png"), id: "top-6", hintDir: "down" },
    ],

    // ---------- ROW 1 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level18/39.png"), id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "L__E", id: "left-2", hintDir: "across" }, 
      { type: "empty", text: "", id: "2-1" },
      { type: "clue", text: "SMALL BITE / MOUTH EDGE", id: "2-2", hintDir: "down"  },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5"},
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "SAND MATERIAL", id: "left-3", hintDir: "across" }, 
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "RUSE", id: "left-4", hintDir: "across" }, 
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "clue", text: "FEE", id: "4-6" , hintDir: "down" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "LARGE", id: "left-5", hintDir: "across" }, 
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "AFTER / ___LOGY", id: "5-2", hintDir: "down"  },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "Z__RA", id: "left-6", hintDir: "across" }, 
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "clue", text: "GREEK LETTER P / GENERAL STAFF", id: "6-3", hintDir: "down"  },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "ALERT", id: "left-7", hintDir: "across" }, 
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "DISTRESS CALL", id: "left-8", hintDir: "across" }, 
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "clue", text: "o__", id: "8-4", hintDir: "down" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "L", "E", "M", "U", "R", "S"],
  ["", "I", "M", "",  "N", "I", "P"],
  ["", "S", "I", "L", "I", "C", "A"],
  ["", "T", "R", "I", "C", "K", ""],
  ["", "L", "", "P", "O", "S", "T"],
  ["", "E", "B", "", "R", "H", "O"],
  ["", "S", "I", "G", "N", "A", "L"],
  ["", "S", "O", "S", "", "W", "L"],
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "LEMURS", name: "Row1 LEMURS" },
    { row: 2, startCol: 1, endCol: 2, word: "IM", name: "Row2 IM" },
    { row: 2, startCol: 4, endCol: 6, word: "NIP", name: "Row2 NIP" },
    { row: 3, startCol: 1, endCol: 6, word: "SILICA", name: "Row3 SILICA" },
    { row: 4, startCol: 1, endCol: 5, word: "TRICK", name: "Row4 TRICK" },
    { row: 5, startCol: 1, endCol: 1, word: "L", name: "Row5 L" },
    { row: 5, startCol: 3, endCol: 6, word: "POST", name: "Row5 POST" },
    { row: 6, startCol: 1, endCol: 2, word: "EB", name: "Row6 EB" },
    { row: 6, startCol: 4, endCol: 6, word: "RHO", name: "Row6 RHO" },
    { row: 7, startCol: 1, endCol: 6, word: "SIGNAL", name: "Row7 SIGNAL" },
    { row: 8, startCol: 1, endCol: 3, word: "SOS", name: "Row8 SOS" },
    { row: 8, startCol: 5, endCol: 6, word: "WL", name: "Row8 WL" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "LISTLESS", name: "Col1 LISTLESS" },
    { col: 2, startRow: 1, endRow: 4, word: "EMIR", name: "Col2 EMIR" },
    { col: 2, startRow: 6, endRow: 8, word: "BIO", name: "Col2 BIO" },
    { col: 3, startRow: 1, endRow: 1, word: "M", name: "Col3 M" },
    { col: 3, startRow: 3, endRow: 5, word: "LIP", name: "Col3 LIP" },
    { col: 3, startRow: 7, endRow: 8, word: "GS", name: "Col3 GS" },
    { col: 4, startRow: 1, endRow: 7, word: "UNICORN", name: "Col4 UNICORN" },
    { col: 5, startRow: 1, endRow: 8, word: "RICKSHAW", name: "Col5 RICKSHAW" },
    { col: 6, startRow: 1, endRow: 3, word: "SPA", name: "Col6 SPA" },
    { col: 6, startRow: 5, endRow: 8, word: "TOLL", name: "Col6 TOLL" },
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
export const initialLetters = ["C", "T", "P", "N", "M"];