import { GridCell, WordPattern } from "../types"

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "SHORT NEWS", id: "top-1", hintDir: "down"},
      { type: "clue", text: "EXPROPRIATE", id: "top-2", hintDir: "down"},
      { type: "clue", text: "ROMAN 1000", id: "top-3", hintDir: "down" },
      { type: "clue", text: "BLOOD PRESSURE", id: "top-4", hintDir: "down" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level1/4.png"), alt: "tree", id: "top-5", hintDir: "down" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level1/5.png"), alt: "olive", id: "top-6", hintDir: "down" },
    ],

    // ---------- ROW 1 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level1/1.png"), alt: "bamboo", id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "letter", text: "A", id: "1-2", placed: true , hintDir: "across"},
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4" , hintDir: "across"},
      { type: "letter", text: "O", id: "1-5", placed: true, hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "USER LICENSE", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "clue", text: "FRIEND / SCRAMBLED...", id: "2-3",hintDir: "down"},
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "UNTRUTH", id: "left-3", hintDir: "across" },
      { type: "letter", text: "L", id: "3-1", placed: true },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "clue", text: "__NG / LOCATION", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level1/2.png"), alt: "legs", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "letter", text: "E", id: "4-2", placed: true },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "clue", text: "ROMAN 5/TIDY", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level1/3.png"), alt: "engine", id: "left-5", hintDir: "across" },
      { type: "letter", text: "E", id: "5-1", placed: true },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "FLAVOR", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "letter", text: "T", id: "6-4", placed: true },
      { type: "empty", text: "", id: "6-5" },
      { type: "clue", text: "TENNESSEE", id: "6-6", hintDir: "down" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "HE, SHE, ...", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "clue", text: "W__HER / LETTER AFTER S", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level1/6.png"), alt: "engine", id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "clue", text: "PAR_ER", id: "8-4", hintDir: "across" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
}

export const solutionGrid: string[][] = [
  ["",   "",  "",  "",  "",  "",  ""], // row 0 - no letters (top clues)
  ["",   "B",  "A",  "M", "B",  "O",  "O"], // row 1
  ["",   "U",  "L",  "",  "P",  "A",  "L"], // row 2
  ["",   "L",  "I",  "E",  "",  "K",  "I"], // row 3
  ["",   "L",  "E",  "G",  "S",  "",  "V"], // row 4
  ["",   "E",  "N",  "G",  "I",  "N",  "E"], // row 5
  ["",   "T",  "A",  "S",  "T",  "E",  ""], // row 6
  ["",   "I",  "T",  "",  "E",  "A",  "T"], // row 7
  ["",   "N",  "E",  "T",  "",  "T",  "N"], // row 8
]

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "BAMBOO", name: "Row1 BAMBOO" },
    { row: 2, startCol: 1, endCol: 2, word: "UL",     name: "Row2 UL" },
    { row: 2, startCol: 4, endCol: 6, word: "PAL",    name: "Row2 PAL" },
    { row: 3, startCol: 1, endCol: 3, word: "LIE",    name: "Row3 LIE" },
    { row: 3, startCol: 5, endCol: 6, word: "KI",     name: "Row3 KI" },
    { row: 4, startCol: 1, endCol: 4, word: "LEGS",   name: "Row4 LEGS" },
    { row: 5, startCol: 1, endCol: 6, word: "ENGINE", name: "Row5 ENGINE" },
    { row: 6, startCol: 1, endCol: 5, word: "TASTE",  name: "Row6 TASTE" },
    { row: 7, startCol: 1, endCol: 2, word: "IT",     name: "Row7 IT" },
    { row: 7, startCol: 4, endCol: 6, word: "EAT",    name: "Row7 EAT" },
    { row: 8, startCol: 1, endCol: 3, word: "NET",    name: "Row8 NET" },
    { row: 8, startCol: 5, endCol: 6, word: "TN",     name: "Row8 TN" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "BULLETIN", name: "Col1 BULLETIN" },
    { col: 2, startRow: 1, endRow: 8, word: "ALIENATE", name: "Col2 ALIENATE" },
    { col: 3, startRow: 3, endRow: 6, word: "EGGS",     name: "Col3 EGGS" },
    { col: 4, startRow: 1, endRow: 2, word: "BP",       name: "Col4 BP" },
    { col: 4, startRow: 4, endRow: 7, word: "SITE",     name: "Col4 SITE" },
    { col: 5, startRow: 1, endRow: 3, word: "OAK",      name: "Col5 OAK" },
    { col: 5, startRow: 5, endRow: 8, word: "NEAT",     name: "Col5 NEAT" },
    { col: 6, startRow: 1, endRow: 5, word: "OLIVE",    name: "Col6 OLIVE" },
    { col: 6, startRow: 7, endRow: 8, word: "TN",       name: "Col6 TN" },
  ],
}

const solutionLetters = Array.from(
  new Set(
    solutionGrid
      .flat()
      .filter(Boolean)
      .map(s => (s ?? "").toUpperCase())
  )
);

// export this instead of the hard-coded list
export const allAvailableLetters = solutionLetters;

export const initialLetters = ["B","A","E","N","T"];
