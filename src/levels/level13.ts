import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "GO WRONG", id: "top-1", hintDir: "down" },    // BACKFIRE
      { type: "clue", text: "VEHICLE", id: "top-2", hintDir: "down" },    // RIDE
      { type: "clue", text: "__P", id: "top-3", hintDir: "down" },// IM
      { type: "clue", text: "DOG", id: "top-4", hintDir: "down" },             // D
      { type: "icon", text: "", imageLocal: require("../assets/levels/level13/29.png"), id: "top-5", hintDir: "down" },
      { type: "clue", text: "___LOGY", id: "top-6", hintDir: "down" },          // ECO
    ],

    // ---------- ROW 1 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level13/27.png"), id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "clue", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level13/28.png"), id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "AIR CONDITIONER", id: "2-4" , hintDir: "down"},
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "COMPACT DISC", id: "left-3", hintDir: "across" },
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "___JI", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "_____T", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "clue", text: "PART OF FOOT", id: "4-6", hintDir: "down" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "FISH", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "F____ / ___T", id: "5-2", hintDir: "down" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "CHILLED", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "clue", text: "BEFORE P", id: "6-5", hintDir: "down" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "CONNECT", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "FINISH", id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "clue", text: "OPERATING SYSTEM", id: "8-5" , hintDir: "across"},
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""], // row 0 - top clues
  ["", "B", "R", "I", "D", "G", "E"], // row 1
  ["", "A", "I", "M", "", "A", "C"], // row 2
  ["", "C", "D", "", "E", "M", "O"], // row 3
  ["", "K", "E", "Y", "S", "E", ""], // row 4
  ["", "F", "", "I", "E", "S", "T"], // row 5
  ["", "I", "C", "E", "D", "", "O"], // row 6
  ["", "R", "E", "L", "A", "T", "E"], // row 7
  ["", "E", "N", "D", "", "O", "S"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "BRIDGE", name: "Row1 BRIDGE" },
    { row: 2, startCol: 1, endCol: 3, word: "AIM", name: "Row2 AIM" },
    { row: 2, startCol: 5, endCol: 6, word: "AC", name: "Row2 AC" },
    { row: 3, startCol: 1, endCol: 2, word: "CD", name: "Row3 CD" },
    { row: 3, startCol: 4, endCol: 6, word: "EMO", name: "Row3 EMO" },
    { row: 4, startCol: 1, endCol: 5, word: "KEYSE", name: "Row4 KEYSE" },
    { row: 5, startCol: 1, endCol: 1, word: "F", name: "Row5 F" },
    { row: 5, startCol: 3, endCol: 6, word: "IEST", name: "Row5 IEST" },
    { row: 6, startCol: 1, endCol: 4, word: "ICED", name: "Row6 ICED" },
    { row: 6, startCol: 6, endCol: 6, word: "O", name: "Row6 O" },
    { row: 7, startCol: 1, endCol: 6, word: "RELATE", name: "Row7 RELATE" },
    { row: 8, startCol: 1, endCol: 3, word: "END", name: "Row8 END" },
    { row: 8, startCol: 5, endCol: 6, word: "OS", name: "Row8 OS" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "BACKFIRE", name: "Col1 BACKFIRE" },
    { col: 2, startRow: 1, endRow: 4, word: "RIDE", name: "Col2 RIDE" },
    { col: 2, startRow: 6, endRow: 8, word: "CEN", name: "Col2 CEN" },
    { col: 3, startRow: 1, endRow: 2, word: "IM", name: "Col3 IM" },
    { col: 3, startRow: 4, endRow: 8, word: "YIELD", name: "Col3 YIELD" },
    { col: 4, startRow: 1, endRow: 1, word: "D", name: "Col4 D" },
    { col: 4, startRow: 3, endRow: 7, word: "ESEDA", name: "Col4 ESEDA" },
    { col: 5, startRow: 1, endRow: 5, word: "GAMES", name: "Col5 GAMES" },
    { col: 5, startRow: 7, endRow: 8, word: "TO", name: "Col5 TO" },
    { col: 6, startRow: 1, endRow: 3, word: "ECO", name: "Col6 ECO" },
    { col: 6, startRow: 5, endRow: 8, word: "TOES", name: "Col6 TOES" },
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

// starter letters (changeable)
export const initialLetters = ["F", "M", "A", "C", "E"];