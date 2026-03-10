import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level9/21.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "NAVAL FORCE", id: "top-2", hintDir: "down" },   // NAVY
      { type: "clue", text: "SOVIET UNION", id: "top-3", hintDir: "down" }, // SU
      { type: "clue", text: "UTILITY", id: "top-4", hintDir: "down" },  // USE
      { type: "clue", text: "RESPOND", id: "top-5", hintDir: "down" },         // REACT
      { type: "clue", text: "REWARD", id: "top-6", hintDir: "down" },        // EARNED
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "MAKE CERTAIN", id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "FEELING OF SICKNESS", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level9/18.png"), id: "left-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "clue", text: "HEAR / OUT", id: "3-3", hintDir: "down" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "SECALE CEREAL", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "clue", text: "_A_ / C____B", id: "4-4", hintDir: "down" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "INDEFINITE ARTICLE", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "ELECT / W___", id: "5-2", hintDir: "down" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level9/19.png"), id: "left-6", hintDir: "down" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "clue", text: "AFTER C", id: "6-5", hintDir: "down" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level9/20.png"), id: "left-7", hintDir: "down" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "letter", text: "C", id: "7-3",placed: true, },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "clue", text: "EYE", id: "7-6", hintDir: "down" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "PROPERTY", id: "left-8", hintDir: "across" },
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
  ["", "E", "N", "S", "U", "R", "E"], // row 1
  ["", "N", "A", "U", "S", "E", "A"], // row 2
  ["", "T", "V", "", "E", "A", "R"], // row 3
  ["", "R", "Y", "E", "", "C", "N"], // row 4
  ["", "A", "", "V", "O", "T", "E"], // row 5
  ["", "N", "A", "I", "L", "", "D"], // row 6
  ["", "C", "Y", "C", "L", "E", ""], // row 7
  ["", "E", "S", "T", "A", "T", "E"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "ENSURE", name: "Row1 ENSURE" },
    { row: 2, startCol: 1, endCol: 6, word: "NAUSEA", name: "Row2 NAUSEA" },
    { row: 3, startCol: 1, endCol: 2, word: "TV", name: "Row3 TV" },
    { row: 3, startCol: 4, endCol: 6, word: "EAR", name: "Row3 EAR" },
    { row: 4, startCol: 1, endCol: 3, word: "RYE", name: "Row4 RYE" },
    { row: 4, startCol: 5, endCol: 6, word: "CN", name: "Row4 CN" },
    { row: 5, startCol: 1, endCol: 1, word: "A", name: "Row5 A" },
    { row: 5, startCol: 3, endCol: 6, word: "VOTE", name: "Row5 VOTE" },
    { row: 6, startCol: 1, endCol: 4, word: "NAIL", name: "Row6 NAIL" },
    { row: 6, startCol: 6, endCol: 6, word: "D", name: "Row6 D" },
    { row: 7, startCol: 1, endCol: 5, word: "CYCLE", name: "Row7 CYCLE" },
    { row: 8, startCol: 1, endCol: 6, word: "ESTATE", name: "Row8 ESTATE" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "ENTRANCE", name: "Col1 ENTRANCE" },
    { col: 2, startRow: 1, endRow: 4, word: "NAVY", name: "Col2 NAVY" },
    { col: 2, startRow: 6, endRow: 8, word: "AYS", name: "Col2 AYS" },
    { col: 3, startRow: 1, endRow: 2, word: "SU", name: "Col3 SU" },
    { col: 3, startRow: 4, endRow: 8, word: "EVICT", name: "Col3 EVICT" },
    { col: 4, startRow: 1, endRow: 3, word: "USE", name: "Col4 USE" },
    { col: 4, startRow: 5, endRow: 8, word: "OLLA", name: "Col4 OLLA" },
    { col: 5, startRow: 1, endRow: 5, word: "REACT", name: "Col5 REACT" },
    { col: 5, startRow: 7, endRow: 8, word: "ET", name: "Col5 ET" },
    { col: 6, startRow: 1, endRow: 6, word: "EARNED", name: "Col6 EARNED" },
    { col: 6, startRow: 8, endRow: 8, word: "E", name: "Col6 E" },
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

// pick a small starter set (changeable)
export const initialLetters = ["C", "U", "S", "A", "N"];