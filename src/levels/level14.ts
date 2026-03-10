import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level14/31.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "___INIUM", id: "top-2", hintDir: "down" },     
      { type: "clue", text: "SOCKET", id: "top-3", hintDir: "down" },    
      { type: "clue", text: "TABLE TENNIS", id: "top-4", hintDir: "down" }, 
      { type: "clue", text: "EASY TO READ", id: "top-5", hintDir: "down" },         
      { type: "clue", text: "FUNGI TYPE", id: "top-6", hintDir: "down" },       
    ],

    // ---------- ROW 1 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level14/30.png"), id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "__D", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "clue", text: "___TH", id: "2-3", hintDir: "down" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "___ OF WAR", id: "left-3", hintDir: "across" }, // TUG
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "clue", text: "N__N / THESIS", id: "3-4" , hintDir: "down" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "COMPENSATES", id: "left-4", hintDir: "across" }, // AMENDS
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "TOTAL", id: "left-5", hintDir: "across" }, // T
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "CASTLE DITCH / TOOL", id: "5-2", hintDir: "down" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "__T", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "clue", text: "_A_LE", id: "6-3", hintDir: "down" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "clue", text: "__M", id: "6-6" , hintDir: "down"},
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "SURPASS", id: "left-7", hintDir: "across" }, // EXCELS
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "JAPANESE TEACHER", id: "left-8", hintDir: "across" }, // SENSEI
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
  ["", "P", "A", "S", "T", "R", "Y"], // row 1
  ["", "O", "L", "", "T", "E", "E"], // row 2
  ["", "T", "U", "G", "", "A", "A"], // row 3
  ["", "A", "M", "E", "N", "D", "S"], // row 4
  ["", "T", "", "M", "O", "A", "T"], // row 5
  ["", "O", "A", "", "T", "B", ""], // row 6
  ["", "E", "X", "C", "E", "L", "S"], // row 7
  ["", "S", "E", "N", "S", "E", "I"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "PASTRY", name: "Row1 PASTRY" },
    { row: 2, startCol: 1, endCol: 2, word: "OL", name: "Row2 OL" },
    { row: 2, startCol: 4, endCol: 6, word: "TEE", name: "Row2 TEE" },
    { row: 3, startCol: 1, endCol: 3, word: "TUG", name: "Row3 TUG" },
    { row: 3, startCol: 5, endCol: 6, word: "AA", name: "Row3 AA" },
    { row: 4, startCol: 1, endCol: 6, word: "AMENDS", name: "Row4 AMENDS" },
    { row: 5, startCol: 1, endCol: 1, word: "T", name: "Row5 T" },
    { row: 5, startCol: 3, endCol: 6, word: "MOAT", name: "Row5 MOAT" },
    { row: 6, startCol: 1, endCol: 2, word: "OA", name: "Row6 OA" },
    { row: 6, startCol: 4, endCol: 5, word: "TB", name: "Row6 TB" },
    { row: 7, startCol: 1, endCol: 6, word: "EXCELS", name: "Row7 EXCELS" },
    { row: 8, startCol: 1, endCol: 6, word: "SENSEI", name: "Row8 SENSEI" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "POTATOES", name: "Col1 POTATOES" },
    { col: 2, startRow: 1, endRow: 4, word: "ALUM", name: "Col2 ALUM" },
    { col: 2, startRow: 6, endRow: 8, word: "AXE", name: "Col2 AXE" },
    { col: 3, startRow: 1, endRow: 1, word: "S", name: "Col3 S" },
    { col: 3, startRow: 3, endRow: 5, word: "GEM", name: "Col3 GEM" },
    { col: 3, startRow: 7, endRow: 8, word: "CN", name: "Col3 CN" },
    { col: 4, startRow: 1, endRow: 2, word: "TT", name: "Col4 TT" },
    { col: 4, startRow: 4, endRow: 8, word: "NMTCH", name: "Col4 NMTCH" },
    { col: 5, startRow: 1, endRow: 8, word: "READOBEE", name: "Col5 READOBEE" },
    { col: 6, startRow: 1, endRow: 5, word: "YEAST", name: "Col6 YEAST" },
    { col: 6, startRow: 7, endRow: 8, word: "SI", name: "Col6 SI" },
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
export const initialLetters = ["O", "N", "A", "I", "M"];