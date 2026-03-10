import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level3/10.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "___NE", id: "top-2", hintDir: "down" },
      { type: "clue", text: "ATOMIC NO. 28", id: "top-3", hintDir: "down" },
      { type: "clue", text: "FIRST IN SOUTH", id: "top-4", hintDir: "down" },
      { type: "clue", text: "LION OF GOD", id: "top-5", hintDir: "down" },
      { type: "clue", text: "MALE TAILOR", id: "top-6", hintDir: "down" },
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "US STATE", id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across"  },
      { type: "empty", text: "", id: "1-2", hintDir: "across"  },
      { type: "empty", text: "", id: "1-3", hintDir: "across"  },
      { type: "empty", text: "", id: "1-4", hintDir: "across"  },
      { type: "empty", text: "", id: "1-5", hintDir: "across"  },
      { type: "empty", text: "", id: "1-6", hintDir: "across"  },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "___TE", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "clue", text: "MUSICAL NOTE/SUNBURN", id: "2-4",hintDir: "down" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "YO - ", id: "left-3", hintDir: "across" }, // image
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "HOT DRINK/___AL", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "_ +", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "clue", text: "PALM TREE/THROUGH", id: "4-2", hintDir: "down" }, // palm tree image
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "BAKING UNIT", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "letter", text: "N", id: "5-4", placed: true },
      { type: "clue", text: "LETTER AFTER R/1", id: "5-5", hintDir: "down" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "FIRST", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "clue", text: "OVERTIME/PRONOUN", id: "6-4", hintDir: "down" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "RECENTLY ADDED", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "clue", text: "CHEMICAL SUFFIX/ARTICLE", id: "7-3" , hintDir: "down"},
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "letter", text: "E", id: "7-6" , placed: true},
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "ROMAN 500", id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1"},
      { type: "clue", text: "_L___", id: "8-2" , hintDir: "across"},
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["",    "",   "",   "",   "",   "",   ""], // row 0 - top clues
  ["",   "K",  "A",  "N",  "S",  "A",  "S"], // row 1
  ["",   "E",  "L",  "I",  "",   "R",  "E"], // row 2
  ["",   "Y",  "O",  "",   "T",  "E",  "A"], // row 3
  ["",   "B",  "",   "P",  "A",  "L",  "M"], // row 4
  ["",   "O",  "V",  "E",  "N",  "",   "S"], // row 5
  ["",   "A",  "I",  "D",  "",   "O",  "T"], // row 6
  ["",   "R",  "A",  "",   "I",  "N",  "E"], // row 7
  ["",   "D",  "",   "A",  "T",  "E",  "R"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "KANSAS", name: "Row1 KANSAS" },
    { row: 2, startCol: 1, endCol: 3, word: "ELI", name: "Row2 ELI" },
    { row: 2, startCol: 5, endCol: 6, word: "RE", name: "Row2 RE" },
    { row: 3, startCol: 1, endCol: 2, word: "YO", name: "Row3 YO" },
    { row: 3, startCol: 4, endCol: 6, word: "TEA", name: "Row3 TEA" },
    { row: 4, startCol: 1, endCol: 1, word: "B", name: "Row4 B" },
    { row: 4, startCol: 3, endCol: 6, word: "PALM", name: "Row4 PALM" },
    { row: 5, startCol: 1, endCol: 4, word: "OVEN", name: "Row5 OVEN" },
    { row: 5, startCol: 6, endCol: 6, word: "S", name: "Row5 S" },
    { row: 6, startCol: 1, endCol: 3, word: "AID", name: "Row6 AID" },
    { row: 6, startCol: 5, endCol: 6, word: "OT", name: "Row6 OT" },
    { row: 7, startCol: 1, endCol: 2, word: "RA", name: "Row7 RA" },
    { row: 7, startCol: 4, endCol: 6, word: "INE", name: "Row7 INE" },
    { row: 8, startCol: 1, endCol: 1, word: "D", name: "Row8 D" },
    { row: 8, startCol: 3, endCol: 6, word: "ATER", name: "Row8 ATER" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "KEYBOARD", name: "Col1 KEYBOARD" },
    { col: 2, startRow: 1, endRow: 3, word: "ALO", name: "Col2 ALO" },
    { col: 2, startRow: 5, endRow: 7, word: "VIA", name: "Col2 VIA" },
    { col: 3, startRow: 1, endRow: 2, word: "NI", name: "Col3 NI" },
    { col: 3, startRow: 4, endRow: 6, word: "PED", name: "Col3 PED" },
    { col: 3, startRow: 8, endRow: 8, word: "A", name: "Col3 A" },
    { col: 4, startRow: 1, endRow: 1, word: "S", name: "Col4 S" },
    { col: 4, startRow: 3, endRow: 5, word: "TAN", name: "Col4 TAN" },
    { col: 4, startRow: 7, endRow: 8, word: "IT", name: "Col4 IT" },
    { col: 5, startRow: 1, endRow: 4, word: "AREL", name: "Col5 AREL" },
    { col: 5, startRow: 6, endRow: 8, word: "ONE", name: "Col5 ONE" },
    { col: 6, startRow: 1, endRow: 8, word: "SEAMSTER", name: "Col6 SEAMSTER" },
  ],
};

const solutionLetters = Array.from(
  new Set(
    solutionGrid
      .flat()
      .filter(Boolean)
      .map((s) => (s ?? "").toUpperCase())
  )
);

export const allAvailableLetters = solutionLetters;

// starter letters (change as you wish)
export const initialLetters = ["K", "A", "N", "S", "E"];