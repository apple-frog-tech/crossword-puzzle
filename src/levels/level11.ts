import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "SPACE", id: "top-1", hintDir: "down" }, // UNIVERSE
      { type: "clue", text: "EUROPEAN COUNTRY", id: "top-2", hintDir: "down" },       // POLAND
      { type: "icon", text: "", imageLocal: require("../assets/levels/level11/25.png"), id: "top-3", hintDir: "down" },
      { type: "clue", text: "ARTICLE", id: "top-4", hintDir: "down" }, // AN
      { type: "clue", text: "TALK", id: "top-5", hintDir: "down" },               // T (single)
      { type: "clue", text: "NOT HARD", id: "top-6", hintDir: "down" },         // EASY
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "RECENT", id: "left-1", hintDir: "across" }, // UPDATE
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "MIDDAY", id: "left-2", hintDir: "across" }, // NOON
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "clue", text: "ALEXA / CLEANSE", id: "2-5", hintDir: "down" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level11/26.png"), id: "left-3", hintDir: "across" },
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "clue", text: "DUAL SCREEN / _O_O", id: "3-4" , hintDir: "down"},
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "VALLEY", id: "left-4", hintDir: "across" }, // IMAGE VALLEY
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "PASS A LAW", id: "left-5", hintDir: "across" }, // ENACT
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "clue", text: "NEW YORK CITY", id: "5-6", hintDir: "down" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "_A_A_", id: "left-6", hintDir: "across" }, // RDR (fragment)
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "clue", text: "ONTARIO / P__T", id: "6-4", hintDir: "down" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "SEEN", id: "left-7", hintDir: "across" }, // S / OXY fragments
      { type: "empty", text: "", id: "7-1" },
      { type: "clue", text: "CROSS", id: "7-2", hintDir: "down" },
      { type: "clue", text: "___GEN / EAGLE", id: "7-3", hintDir: "down" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "FORMER PARTNER", id: "left-8", hintDir: "across" }, // EXES
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "clue", text: "CLOUD", id: "8-5", hintDir: "down" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""], // row 0 - top clues
  ["", "U", "P", "D", "A", "T", "E"], // row 1
  ["", "N", "O", "O", "N", "", "A"], // row 2
  ["", "I", "L", "L", "", "D", "S"], // row 3
  ["", "V", "A", "L", "L", "E", "Y"], // row 4
  ["", "E", "N", "A", "C", "T", ""], // row 5
  ["", "R", "D", "R", "", "O", "N"], // row 6
  ["", "S", "", "", "O", "X", "Y"], // row 7
  ["", "E", "X", "E", "S", "", "C"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "UPDATE", name: "Row1 UPDATE" },
    { row: 2, startCol: 1, endCol: 4, word: "NOON", name: "Row2 NOON" },
    { row: 2, startCol: 6, endCol: 6, word: "A", name: "Row2 A" },
    { row: 3, startCol: 1, endCol: 3, word: "ILL", name: "Row3 ILL" },
    { row: 3, startCol: 5, endCol: 6, word: "DS", name: "Row3 DS" },
    { row: 4, startCol: 1, endCol: 6, word: "VALLEY", name: "Row4 VALLEY" },
    { row: 5, startCol: 1, endCol: 5, word: "ENACT", name: "Row5 ENACT" },
    { row: 6, startCol: 1, endCol: 3, word: "RDR", name: "Row6 RDR" },
    { row: 6, startCol: 5, endCol: 6, word: "ON", name: "Row6 ON" },
    { row: 7, startCol: 1, endCol: 1, word: "S", name: "Row7 S" },
    { row: 7, startCol: 4, endCol: 6, word: "OXY", name: "Row7 OXY" },
    { row: 8, startCol: 1, endCol: 4, word: "EXES", name: "Row8 EXES" },
    { row: 8, startCol: 6, endCol: 6, word: "C", name: "Row8 C" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "UNIVERSE", name: "Col1 UNIVERSE" },
    { col: 2, startRow: 1, endRow: 6, word: "POLAND", name: "Col2 POLAND" },
    { col: 2, startRow: 8, endRow: 8, word: "X", name: "Col2 X" },
    { col: 3, startRow: 1, endRow: 6, word: "DOLLAR", name: "Col3 DOLLAR" },
    { col: 3, startRow: 8, endRow: 8, word: "E", name: "Col3 E" },
    { col: 4, startRow: 1, endRow: 2, word: "AN", name: "Col4 AN" },
    { col: 4, startRow: 4, endRow: 5, word: "LC", name: "Col4 LC" },
    { col: 4, startRow: 7, endRow: 8, word: "OS", name: "Col4 OS" },
    { col: 5, startRow: 1, endRow: 1, word: "T", name: "Col5 T" },
    { col: 5, startRow: 3, endRow: 7, word: "DETOX", name: "Col5 DETOX" },
    { col: 6, startRow: 1, endRow: 4, word: "EASY", name: "Col6 EASY" },
    { col: 6, startRow: 6, endRow: 8, word: "NYC", name: "Col6 NYC" },
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

// small starter set (changeable)
export const initialLetters = ["X", "O", "S", "R", "A"];