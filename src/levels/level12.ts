import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "SEND", id: "top-1", hintDir: "down" },           // TRANSFER
      { type: "clue", text: "DISLIKE", id: "top-2", hintDir: "down" },     // HATE / ATE
      { type: "clue", text: "OBSERVE", id: "top-3", hintDir: "down" },   // IT / WATCH
      { type: "clue", text: "PEN POINT", id: "top-4", hintDir: "down" },      // NIB / MIHE (fragment)
      { type: "clue", text: "_ HOURS", id: "top-5", hintDir: "down" },         // GOLDEN / A
      { type: "clue", text: "_IG_", id: "top-6", hintDir: "down" },                // SN / INGOT
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "ITEMS", id: "left-1", hintDir: "across" }, // THINGS
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "PORTION", id: "left-2", hintDir: "across" }, // RATION
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "PREPOSITION", id: "left-3", hintDir: "across" }, // AT + BL fragments
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "__OW / SEE", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "clue", text: "METAL BAR", id: "3-6", hintDir: "down" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "FRESH", id: "left-4", hintDir: "across" }, // NEW + DI
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "clue", text: "__E / __S__ARD", id: "4-4", hintDir: "down" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "Same", id: "left-5", hintDir: "across" }, // S + AMEN
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "PRAYER / EAT", id: "5-2", hintDir: "down" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "OUTCOME", id: "left-6", hintDir: "across" }, // FATING (grid)
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "ENGRAVE", id: "left-7", hintDir: "across" }, // ETCH + O
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "clue", text: "ROUND / BEFORE B", id: "7-5", hintDir: "down" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "HEAT AGAIN", id: "left-8", hintDir: "across" }, // REHEAT
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""], // row 0 - top clues
  ["", "T", "H", "I", "N", "G", "S"], // row 1
  ["", "R", "A", "T", "I", "O", "N"], // row 2
  ["", "A", "T", "", "B", "L", ""], // row 3
  ["", "N", "E", "W", "", "D", "I"], // row 4
  ["", "S", "", "A", "M", "E", "N"], // row 5
  ["", "F", "A", "T", "I", "N", "G"], // row 6
  ["", "E", "T", "C", "H", "", "O"], // row 7
  ["", "R", "E", "H", "E", "A", "T"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "THINGS", name: "Row1 THINGS" },
    { row: 2, startCol: 1, endCol: 6, word: "RATION", name: "Row2 RATION" },
    { row: 3, startCol: 1, endCol: 2, word: "AT", name: "Row3 AT" },
    { row: 3, startCol: 4, endCol: 5, word: "BL", name: "Row3 BL" },
    { row: 4, startCol: 1, endCol: 3, word: "NEW", name: "Row4 NEW" },
    { row: 4, startCol: 5, endCol: 6, word: "DI", name: "Row4 DI" },
    { row: 5, startCol: 1, endCol: 1, word: "S", name: "Row5 S" },
    { row: 5, startCol: 3, endCol: 6, word: "AMEN", name: "Row5 AMEN" },
    { row: 6, startCol: 1, endCol: 6, word: "FATING", name: "Row6 FATING" },
    { row: 7, startCol: 1, endCol: 4, word: "ETCH", name: "Row7 ETCH" },
    { row: 7, startCol: 6, endCol: 6, word: "O", name: "Row7 O" },
    { row: 8, startCol: 1, endCol: 6, word: "REHEAT", name: "Row8 REHEAT" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "TRANSFER", name: "Col1 TRANSFER" },
    { col: 2, startRow: 1, endRow: 4, word: "HATE", name: "Col2 HATE" },
    { col: 2, startRow: 6, endRow: 8, word: "ATE", name: "Col2 ATE" },
    { col: 3, startRow: 1, endRow: 2, word: "IT", name: "Col3 IT" },
    { col: 3, startRow: 4, endRow: 8, word: "WATCH", name: "Col3 WATCH" },
    { col: 4, startRow: 1, endRow: 3, word: "NIB", name: "Col4 NIB" },
    { col: 4, startRow: 5, endRow: 8, word: "MIHE", name: "Col4 MIHE" },
    { col: 5, startRow: 1, endRow: 6, word: "GOLDEN", name: "Col5 GOLDEN" },
    { col: 5, startRow: 8, endRow: 8, word: "A", name: "Col5 A" },
    { col: 6, startRow: 1, endRow: 2, word: "SN", name: "Col6 SN" },
    { col: 6, startRow: 4, endRow: 8, word: "INGOT", name: "Col6 INGOT" },
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

// small starter set (changeable)
export const initialLetters = ["W", "H", "O", "A", "T"];