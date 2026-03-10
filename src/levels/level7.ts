import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "TOOLS FOR CONNECTIONS", id: "top-1", hintDir: "down" },
      { type: "clue", text: "____ERA", id: "top-2", hintDir: "down" },
      { type: "clue", text: "FAST PLANE", id: "top-3", hintDir: "down" },           
      { type: "clue", text: "UNION TERRITORY", id: "top-4", hintDir: "down" },  
      { type: "clue", text: "SIMPLE", id: "top-5", hintDir: "down" },              
      { type: "clue", text: "VOUCHER", id: "top-6", hintDir: "down" }, 
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "MAKE SMALL CHANGES", id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "FOOD PLAN", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "clue", text: "ZERO / TEEN_____", id: "2-5" , hintDir: "down" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "SUITABLE", id: "left-3", hintDir: "across" },
      { type: "empty", text: "", id: "3-1"},
      { type: "empty", text: "", id: "3-2"},
      { type: "empty", text: "", id: "3-3"},
      { type: "clue", text: "ALASKA / AVENUE", id: "3-4", hintDir: "down" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "PERSONAL TRAINING", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "clue", text: "GROW OLDER / NERVOUS", id: "4-3", hintDir: "down" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "TIME", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "FLAT / TRACK TOUR", id: "5-2", hintDir: "down" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "OLDER PERSON", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "clue", text: "NOT OFF", id: "6-6", hintDir: "down" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "SCRAP OF CLOTH", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "clue", text: "THUS / SIGHT", id: "7-4", hintDir: "down" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level7/17.png"),id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "clue", text: "NUMBER", id: "8-5", hintDir: "across" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["",    "",  "",  "",  "",  "",  ""],
  ["",   "A", "D", "J", "U", "S", "T"], // row 1
  ["",   "D", "I", "E", "T", "",  "O"], // row 2
  ["",   "A", "P", "T", "", "A", "D"], // row 3
  ["",   "P", "T", "", "A",  "G", "E"], // row 4
  ["",   "T", "", "E", "V", "E", "N"], // row 5
  ["",   "E", "L", "D", "E", "R", ""], // row 6
  ["",   "R", "A", "G", "", "S", "O"], // row 7
  ["",   "S", "P", "Y", "S", "", "N"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "ADJUST", name: "Row1 ADJUST" },
    { row: 2, startCol: 1, endCol: 4, word: "DIET", name: "Row2 DIET" },
    { row: 2, startCol: 6, endCol: 6, word: "O", name: "Row2 O" },
    { row: 3, startCol: 1, endCol: 3, word: "APT", name: "Row3 APT" },
    { row: 3, startCol: 5, endCol: 6, word: "AD", name: "Row3 AD" },
    { row: 4, startCol: 1, endCol: 2, word: "PT", name: "Row4 PT" },
    { row: 4, startCol: 4, endCol: 6, word: "AGE", name: "Row4 AGE" },
    { row: 5, startCol: 1, endCol: 1, word: "T", name: "Row5 T" },
    { row: 5, startCol: 3, endCol: 6, word: "EVEN", name: "Row5 EVEN" },
    { row: 6, startCol: 1, endCol: 5, word: "ELDER", name: "Row6 ELDER" },
    { row: 7, startCol: 1, endCol: 3, word: "RAG", name: "Row7 RAG" },
    { row: 7, startCol: 5, endCol: 6, word: "SO", name: "Row7 SO" },
    { row: 8, startCol: 1, endCol: 4, word: "SPYS", name: "Row8 SPYS" },
    { row: 8, startCol: 6, endCol: 6, word: "N", name: "Row8 N" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "ADAPTERS", name: "Col1 ADAPTERS" },
    { col: 2, startRow: 1, endRow: 4, word: "DIPT", name: "Col2 DIPT" },       
    { col: 2, startRow: 6, endRow: 8, word: "LAP", name: "Col2 LAP" },
    { col: 3, startRow: 1, endRow: 3, word: "JET", name: "Col3 JET" },
    { col: 3, startRow: 5, endRow: 8, word: "EDGY", name: "Col3 EDGY" },
    { col: 4, startRow: 1, endRow: 2, word: "UT", name: "Col4 UT" },
    { col: 4, startRow: 4, endRow: 6, word: "AVE", name: "Col4 AVE" },
    { col: 4, startRow: 8, endRow: 8, word: "S", name: "Col4 S" },
    { col: 5, startRow: 1, endRow: 1, word: "S", name: "Col5 S" },
    { col: 5, startRow: 3, endRow: 7, word: "AGERS", name: "Col5 AGERS" },
    { col: 6, startRow: 1, endRow: 5, word: "TODEN", name: "Col6 TODEN" },     
    { col: 6, startRow: 7, endRow: 8, word: "ON", name: "Col6 ON" },
  ],
};

const solutionLetters = Array.from(
  new Set(
    solutionGrid
      .flat()
      .filter(s => s && s.trim() !== "")
      .map(s => (s ?? "").toUpperCase())
  )
);

// export this instead of a hard-coded list
export const allAvailableLetters = solutionLetters;

// small starter set (changeable)
export const initialLetters = ["D", "Y", "S", "A", "P"];