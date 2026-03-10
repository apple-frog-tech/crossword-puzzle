import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "GIVING", id: "top-1", hintDir: "down" },       // OFFERING
      { type: "clue", text: "SWELL UP", id: "top-2", hintDir: "down" },              // BLOAT
      { type: "clue", text: "CONTAINERS", id: "top-3", hintDir: "down" },            // JARS
      { type: "clue", text: "LARGE BIRD", id: "top-4", hintDir: "down" },            // EMU
      { type: "clue", text: "BURIAL GROUND", id: "top-5", hintDir: "down" },         // CEMETERY
      { type: "clue", text: "TAYLOR SWIFT", id: "top-6", hintDir: "down" },          // TS / DATES
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "ITEM", id: "left-1", hintDir: "across" }, // OBJECT
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level10/22.png"), id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "PLACE TO DISCUSS", id: "left-3", hintDir: "across" }, // FORUM
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "clue", text: "", id: "3-6", hintDir: "down" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "___E", id: "left-4", hintDir: "across" }, // EASED
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "clue", text: "EDWARD / GAMING", id: "4-4", hintDir: "down" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "RETURN", id: "left-5", hintDir: "across" }, // RTGTA pattern row
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "clue", text: "GRAND THEFT / BANK MACHINE", id: "5-3", hintDir:"down"},
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "MYSELF", id: "left-6", hintDir: "across" }, // NAPET row fragment
      { type: "empty", text: "", id: "6-1" },
      { type: "clue", text: "_P___IZER / GOLD", id: "6-2", hintDir:"down" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level10/24.png"), id: "left-7", hintDir: "down" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level10/23.png"), id: "left-8", hintDir: "down" },
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "clue", text: "RA__", id: "8-4", hintDir:"across" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""], // row 0 - top clues
  ["", "O", "B", "J", "E", "C", "T"], // row 1
  ["", "F", "L", "A", "M", "E", "S"], // row 2
  ["", "F", "O", "R", "U", "M", ""], // row 3
  ["", "E", "A", "S", "", "E", "D"], // row 4
  ["", "R", "T", "", "G", "T", "A"], // row 5
  ["", "I", "", "A", "P", "E", "T"], // row 6
  ["", "N", "A", "T", "U", "R", "E"], // row 7
  ["", "G", "U", "M", "", "Y", "S"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "OBJECT", name: "Row1 OBJECT" },
    { row: 2, startCol: 1, endCol: 6, word: "FLAMES", name: "Row2 FLAMES" },
    { row: 3, startCol: 1, endCol: 5, word: "FORUM", name: "Row3 FORUM" },
    { row: 4, startCol: 1, endCol: 3, word: "EAS", name: "Row4 EAS" },
    { row: 4, startCol: 5, endCol: 6, word: "ED", name: "Row4 ED" },
    { row: 5, startCol: 1, endCol: 2, word: "RT", name: "Row5 RT" },
    { row: 5, startCol: 4, endCol: 6, word: "GTA", name: "Row5 GTA" },
    { row: 6, startCol: 1, endCol: 1, word: "I", name: "Row6 I" },
    { row: 6, startCol: 3, endCol: 6, word: "APET", name: "Row6 APET" },
    { row: 7, startCol: 1, endCol: 6, word: "NATURE", name: "Row7 NATURE" },
    { row: 8, startCol: 1, endCol: 6, word: "GUMYS", name: "Row8 GUMYS" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "OFFERING", name: "Col1 OFFERING" },
    { col: 2, startRow: 1, endRow: 5, word: "BLOAT", name: "Col2 BLOAT" },
    { col: 2, startRow: 7, endRow: 8, word: "AU", name: "Col2 AU" },
    { col: 3, startRow: 1, endRow: 4, word: "JARS", name: "Col3 JARS" },
    { col: 3, startRow: 6, endRow: 8, word: "ATM", name: "Col3 ATM" },
    { col: 4, startRow: 1, endRow: 3, word: "EMU", name: "Col4 EMU" },
    { col: 4, startRow: 5, endRow: 7, word: "GPU", name: "Col4 GPU" },
    { col: 5, startRow: 1, endRow: 8, word: "CEMETERY", name: "Col5 CEMETERY" },
    { col: 6, startRow: 1, endRow: 2, word: "TS", name: "Col6 TS" },
    { col: 6, startRow: 4, endRow: 8, word: "DATES", name: "Col6 DATES" },
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
export const initialLetters = ["F", "U", "Y", "I", "D"];