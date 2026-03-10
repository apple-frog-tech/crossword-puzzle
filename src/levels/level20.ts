import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level20/43.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "SUITABLE", id: "top-2", hintDir: "down" },            
      { type: "clue", text: "PAL", id: "top-3", hintDir: "down" },
      { type: "clue", text: "STUDY OF MOTION", id: "top-4", hintDir: "down" },     
      { type: "clue", text: "T__DY", id: "top-5", hintDir: "down" },        
      { type: "clue", text: "TRANSPORT", id: "top-6", hintDir: "down" },       
    ],

    // ---------- ROW 1 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level20/42.png"), id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "PLANT PEST", id: "left-2", hintDir: "across" }, 
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2"  },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5"},
      { type: "clue", text: "TRUTHFUL", id: "2-6" , hintDir: "down"},
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "AMAZE", id: "left-3", hintDir: "across" }, 
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "empty", text: "", id: "3-4" },
      { type: "clue", text: "BUS_ / COFFEE TYPE", id: "3-5" , hintDir:"down"},
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "MEDIUM", id: "left-4", hintDir: "across" }, // SLEEPS IMAGE
      { type: "empty", text: "", id: "4-1" },
      { type: "clue", text: "SHORT NOTE / DUPLIATE", id: "4-2" , hintDir: "down"},
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "__E", id: "left-5", hintDir: "across" }, 
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "clue", text: "HEAVY WEIGHT / __ICE", id: "5-3", hintDir: 'down' },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "", id: "BEGINNERft-6", hintDir: "across" }, 
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "ERAS", id: "left-7", hintDir: "across" }, 
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "DAI__", id: "left-8", hintDir: "across" }, 
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "clue", text: "___ELLITE", id: "8-3", hintDir:"down" },
      { type: "empty", text: "", id: "8-4" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "J", "A", "C", "K", "E", "T"],
  ["", "A", "P", "H",  "I", "D", ""],
  ["", "S", "T", "U", "N", "", "H"],
  ["", "M", "", "M", "E", "M", "O"],
  ["", "I", "C", "", "T", "O", "N"],
  ["", "N", "O", "V", "I", "C", "E"],
  ["", "E", "P", "O", "C", "H", "S"],
  ["", "S", "Y", "", "S", "A", "T"],
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "JACKET", name: "Row1 JACKET" },
    { row: 2, startCol: 1, endCol: 5, word: "APHID", name: "Row2 APHID" },
    { row: 3, startCol: 1, endCol: 4, word: "STUN", name: "Row3 STUN" },
    { row: 3, startCol: 6, endCol: 6, word: "H", name: "Row3 H" },
    { row: 4, startCol: 1, endCol: 1, word: "M", name: "Row4 M" },
    { row: 4, startCol: 3, endCol: 6, word: "MEMO", name: "Row4 MEMO" },
    { row: 5, startCol: 1, endCol: 2, word: "IC", name: "Row5 IC" },
    { row: 5, startCol: 4, endCol: 6, word: "TON", name: "Row5 TON" },
    { row: 6, startCol: 1, endCol: 6, word: "NOVICE", name: "Row6 NOVICE" },
    { row: 7, startCol: 1, endCol: 6, word: "EPOCHS", name: "Row7 EPOCHS" },
    { row: 8, startCol: 1, endCol: 2, word: "SY", name: "Row8 SY" },
    { row: 8, startCol: 4, endCol: 6, word: "SAT", name: "Row8 SAT" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "JASMINES", name: "Col1 JASMINES" },
    { col: 2, startRow: 1, endRow: 3, word: "APT", name: "Col2 APT" },
    { col: 2, startRow: 5, endRow: 8, word: "COPY", name: "Col2 COPY" },
    { col: 3, startRow: 1, endRow: 4, word: "CHUM", name: "Col3 CHUM" },
    { col: 3, startRow: 6, endRow: 7, word: "VO", name: "Col3 VO" },
    { col: 4, startRow: 1, endRow: 8, word: "KINETICS", name: "Col4 KINETICS" },
    { col: 5, startRow: 1, endRow: 2, word: "ED", name: "Col5 ED" },
    { col: 5, startRow: 4, endRow: 8, word: "MOCHA", name: "Col5 MOCHA" },
    { col: 6, startRow: 1, endRow: 1, word: "T", name: "Col6 T" },
    { col: 6, startRow: 3, endRow: 8, word: "HONEST", name: "Col6 HONEST" },
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
export const initialLetters = ["J", "P", "A", "N", "T"];