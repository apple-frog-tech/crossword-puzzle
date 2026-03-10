import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "MEXICAN WRAP", id: "top-1", hintDir: "down" },  // TORTILLA
      { type: "clue", text: "___NOMY", id: "top-2", hintDir: "down" },       // ECO
      { type: "clue", text: "MOUNTAIN", id: "top-3", hintDir: "down" }, // MT
      { type: "clue", text: "FIERCE DEBATE", id: "top-4", hintDir: "down" }, // POLEMIC
      { type: "clue", text: "NOT CLOSED", id: "top-5", hintDir: "down" },           // OPEN
      { type: "clue", text: "___CESS", id: "top-6", hintDir: "down" },      // SUC
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "MUSICAL SPEEDS", id: "left-1", hintDir: "across" }, // TEMPOS
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "______S", id: "left-2", hintDir: "across" }, // OCTOPU
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "ROMANIA", id: "left-3", hintDir: "across" }, // RO
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "F___Y / ENERGY", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "TAIL", id: "left-4", hintDir: "across" }, // T
      { type: "empty", text: "", id: "4-1" },
      { type: "clue", text: "BALLPOINT / CONNECTED", id: "4-2" , hintDir: "down"},
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "clue", text: "SET OF BELIEF", id: "4-6", hintDir: "down" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "OBJECTS", id: "left-5", hintDir: "across" }, // ITEM
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "clue", text: "MYSELF / FATHER", id: "5-5", hintDir: "down" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "FATS", id: "left-6", hintDir: "across" }, // LIPIDS
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "FRENCH ARTICLE", id: "left-7", hintDir: "across" }, // LE
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "clue", text: "___ERA", id: "7-3",  hintDir: "across" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "M___M", id: "left-8", hintDir: "across" }, // ADA
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "clue", text: "DOUBLE SIDE", id: "8-4",  hintDir: "across" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "T", "E", "M", "P", "O", "S"], // row 1
  ["", "O", "C", "T", "O", "P", "U"], // row 2
  ["", "R", "O", "", "L", "E", "C"], // row 3
  ["", "T", "", "P", "E", "N", ""], // row 4
  ["", "I", "T", "E", "M", "", "I"], // row 5
  ["", "L", "I", "P", "I", "D", "S"], // row 6
  ["", "L", "E", "", "C", "A", "M"], // row 7
  ["", "A", "D", "A", "", "D", "S"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "TEMPOS", name: "Row1 TEMPOS" },
    { row: 2, startCol: 1, endCol: 6, word: "OCTOPU", name: "Row2 OCTOPU" },
    { row: 3, startCol: 1, endCol: 2, word: "RO", name: "Row3 RO" },
    { row: 3, startCol: 4, endCol: 6, word: "LEC", name: "Row3 LEC" },
    { row: 4, startCol: 1, endCol: 1, word: "T", name: "Row4 T" },
    { row: 4, startCol: 3, endCol: 5, word: "PEN", name: "Row4 PEN" },
    { row: 5, startCol: 1, endCol: 4, word: "ITEM", name: "Row5 ITEM" },
    { row: 5, startCol: 6, endCol: 6, word: "I", name: "Row5 I" },
    { row: 6, startCol: 1, endCol: 6, word: "LIPIDS", name: "Row6 LIPIDS" },
    { row: 7, startCol: 1, endCol: 2, word: "LE", name: "Row7 LE" },
    { row: 7, startCol: 4, endCol: 6, word: "CAM", name: "Row7 CAM" },
    { row: 8, startCol: 1, endCol: 3, word: "ADA", name: "Row8 ADA" },
    { row: 8, startCol: 5, endCol: 6, word: "DS", name: "Row8 DS" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "TORTILLA", name: "Col1 TORTILLA" },
    { col: 2, startRow: 1, endRow: 3, word: "ECO", name: "Col2 ECO" },
    { col: 2, startRow: 5, endRow: 8, word: "TIED", name: "Col2 TIED" },
    { col: 3, startRow: 1, endRow: 2, word: "MT", name: "Col3 MT" },
    { col: 3, startRow: 4, endRow: 6, word: "PEP", name: "Col3 PEP" },
    { col: 3, startRow: 8, endRow: 8, word: "A", name: "Col3 A" },
    { col: 4, startRow: 1, endRow: 7, word: "POLEMIC", name: "Col4 POLEMIC" },
    { col: 5, startRow: 1, endRow: 4, word: "OPEN", name: "Col5 OPEN" },
    { col: 5, startRow: 6, endRow: 8, word: "DAD", name: "Col5 DAD" },
    { col: 6, startRow: 1, endRow: 3, word: "SUC", name: "Col6 SUC" },
    { col: 6, startRow: 5, endRow: 8, word: "ISMS", name: "Col6 ISMS" },
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

export const allAvailableLetters = solutionLetters;
export const initialLetters = ["S", "R", "D", "P", "M"];