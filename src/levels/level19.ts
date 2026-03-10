import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level19/40.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "18TH LETTER", id: "top-2", hintDir: "down" },            
      { type: "clue", text: "EACH", id: "top-3", hintDir: "down" },
      { type: "clue", text: "ATTENDANT", id: "top-4", hintDir: "down" },     
      { type: "clue", text: "TELESCOPE END", id: "top-5", hintDir: "down" },        
      { type: "clue", text: "BA__AM", id: "top-6", hintDir: "down" },       
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "JOURNEY", id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "P_T", id: "left-2", hintDir: "across" }, 
      { type: "empty", text: "", id: "2-1" },
      { type: "clue", text: "SETTLES / DAZZLE", id: "2-2", hintDir: "down"  },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5"},
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "NIMBLE", id: "left-3", hintDir: "across" }, 
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "clue", text: "ROCKY DEBRIS", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level19/41.png"), id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "STRATEGY", id: "left-5", hintDir: "across" }, 
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "BEFORE NOW", id: "left-6", hintDir: "across" }, 
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "clue", text: "ERBIUM / Y__D", id: "6-4" , hintDir: "down" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "HA__", id: "left-7", hintDir: "across" }, 
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "clue", text: "EXPERT / 6TH LETTER", id: "7-3" , hintDir: "down"},
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "SPEED", id: "left-8", hintDir: "across" }, 
      { type: "empty", text: "", id: "8-1" },
      { type: "clue", text: "GRATIS", id: "8-2",  hintDir: "across" },
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "T", "R", "A", "V", "E", "L"],
  ["", "O", "", "P",  "A", "Y", "P"],
  ["", "A", "G", "I", "L", "E", ""],
  ["", "S", "L", "E", "E", "P", "S"],
  ["", "T", "A", "C", "T", "I", "C"],
  ["", "E", "R", "E", "", "E", "R"],
  ["", "R", "E", "", "A", "C", "E"],
  ["", "S", "", "F", "R", "E", "E"],
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "TRAVEL", name: "Row1 TRAVEL" },
    { row: 2, startCol: 1, endCol: 1, word: "O", name: "Row2 O" },
    { row: 2, startCol: 3, endCol: 6, word: "PAYP", name: "Row2 PAYP" },
    { row: 3, startCol: 1, endCol: 5, word: "AGILE", name: "Row3 AGILE" },
    { row: 4, startCol: 1, endCol: 6, word: "SLEEPS", name: "Row4 SLEEPS" },
    { row: 5, startCol: 1, endCol: 6, word: "TACTIC", name: "Row5 TACTIC" },
    { row: 6, startCol: 1, endCol: 3, word: "ERE", name: "Row6 ERE" },
    { row: 6, startCol: 5, endCol: 6, word: "ER", name: "Row6 ER" },
    { row: 7, startCol: 1, endCol: 2, word: "RE", name: "Row7 RE" },
    { row: 7, startCol: 4, endCol: 6, word: "ACE", name: "Row7 ACE" },
    { row: 8, startCol: 1, endCol: 1, word: "S", name: "Row8 S" },
    { row: 8, startCol: 3, endCol: 6, word: "FREE", name: "Row8 FREE" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "TOASTERS", name: "Col1 TOASTERS" },
    { col: 2, startRow: 1, endRow: 1, word: "R", name: "Col2 R" },
    { col: 2, startRow: 3, endRow: 7, word: "GLARE", name: "Col2 GLARE" },
    { col: 3, startRow: 1, endRow: 6, word: "APIECE", name: "Col3 APIECE" },
    { col: 3, startRow: 8, endRow: 8, word: "F", name: "Col3 F" },
    { col: 4, startRow: 1, endRow: 5, word: "VALET", name: "Col4 VALET" },
    { col: 4, startRow: 7, endRow: 8, word: "AR", name: "Col4 AR" },
    { col: 5, startRow: 1, endRow: 8, word: "EYEPIECR", name: "Col5 EYEPIECR" },
    { col: 6, startRow: 1, endRow: 2, word: "SP", name: "Col6 SP" },
    { col: 6, startRow: 4, endRow: 8, word: "SCREE", name: "Col6 SCREE" },
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
export const initialLetters = ["V", "O", "Y", "E", "G"];