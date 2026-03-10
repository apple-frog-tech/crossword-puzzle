import { GridCell, WordPattern } from "../types"

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (Vertical Words) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "RESPONSE", id: "top-1", hintDir: "down"},
      { type: "clue", text: "DISORDER", id: "top-2", hintDir: "down"},
      { type: "icon", text: "", imageLocal: require("../assets/levels/level4/12.png"), id: "top-3", hintDir: "across" },
      { type: "clue", text: "END OF PERIOD", id: "top-4", hintDir: "down" },
      { type: "clue", text: "_EST", id: "top-5", hintDir: "down" },
      { type: "clue", text: "FIGURE OUT - SLANG", id: "top-6", hintDir: "down" },
    ],

    // ---------- ROW 1: ROWERS ----------
    [
      { type: "clue", text: "OARSMEN", id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2: ECHO''U ----------
    [
      { type: "clue", text: "REFLECTED SOUND", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "clue", text: "_ - TURN / SESAME SEED PASTE", id: "2-5", hintDir: "across" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3: ADAPTS ----------
    [
      { type: "clue", text: "ADJUSTS", id: "left-3", hintDir: "across" },
      { type: "letter", text: "A", id: "3-1", placed: true },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "empty", text: "", id: "3-4" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4: C''L''AS ----------
    [
      { type: "clue", text: "CARBON", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "clue", text: "BEFORE M/CURRENCY", id: "4-2", hintDir: "across" },
      { type: "empty", text: "", id: "4-3" },
      { type: "clue", text: "CONJUCTION / PRONOUN", id: "4-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5: TEETH'' ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level4/11.png"), id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "clue", text: "MASTER OF SCIENCE", id: "5-6", hintDir: "down" },
    ],

    // ---------- ROW 6: IU''HIM ----------
    [
      { type: "clue", text: "_C_", id: "left-6", hintDir: "across" },
      { type: "letter", text: "I", id: "6-1", placed: true },
      { type: "empty", text: "", id: "6-2" },
      { type: "clue", text: "HE/__M", id: "6-3", hintDir: "across" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7: ORGANS ----------
    [
      { type: "clue", text: "BODY PARTS", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8: NOETIC ----------
    [
      { type: "clue", text: "INTELLECTUAL", id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "empty", text: "", id: "8-4" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
}

export const solutionGrid: string[][] = [
  ["",    "",  "",  "",  "",  "",  ""], 
  ["",   "R", "O", "W", "E", "R", "S"], // row 1
  ["",   "E", "C", "H", "O", "",  "U"], // row 2
  ["",   "A", "D", "A", "P", "T", "S"], // row 3
  ["",   "C", "",  "L", "",  "A", "S"], // row 4
  ["",   "T", "E", "E", "T", "H", ""], // row 5
  ["",   "I", "U", "",  "H", "I", "M"], // row 6
  ["",   "O", "R", "G", "A", "N", "S"], // row 7
  ["",   "N", "O", "E", "T", "I", "C"], // row 8
]

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "ROWERS", name: "Row1 ROWERS" },
    { row: 2, startCol: 1, endCol: 4, word: "ECHO", name: "Row2 ECHO" },
    { row: 2, startCol: 6, endCol: 6, word: "U", name: "Row2 U" },
    { row: 3, startCol: 1, endCol: 6, word: "ADAPTS", name: "Row3 ADAPTS" },
    { row: 4, startCol: 1, endCol: 1, word: "C", name: "Row4 C" },
    { row: 4, startCol: 3, endCol: 3, word: "L", name: "Row4 L" },
    { row: 4, startCol: 5, endCol: 6, word: "AS", name: "Row4 AS" },
    { row: 5, startCol: 1, endCol: 5, word: "TEETH", name: "Row5 TEETH" },
    { row: 6, startCol: 1, endCol: 2, word: "IU", name: "Row6 IU" },
    { row: 6, startCol: 4, endCol: 6, word: "HIM", name: "Row6 HIM" },
    { row: 7, startCol: 1, endCol: 6, word: "ORGANS", name: "Row7 ORGANS" },
    { row: 8, startCol: 1, endCol: 6, word: "NOETIC", name: "Row8 NOETIC" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "REACTION", name: "Col1 REACTION" },
    { col: 2, startRow: 1, endRow: 3, word: "OCD", name: "Col2 OCD" },
    { col: 2, startRow: 5, endRow: 8, word: "EURO", name: "Col2 EURO" },
    { col: 3, startRow: 1, endRow: 5, word: "WHALE", name: "Col3 WHALE" },
    { col: 3, startRow: 7, endRow: 8, word: "GE", name: "Col3 GE" },
    { col: 4, startRow: 1, endRow: 3, word: "EOP", name: "Col4 EOP" },
    { col: 4, startRow: 5, endRow: 8, word: "THAT", name: "Col4 THAT" },
    { col: 5, startRow: 1, endRow: 1, word: "R", name: "Col5 R" },
    { col: 5, startRow: 3, endRow: 3, word: "T", name: "Col5 T" },
    { col: 5, startRow: 5, endRow: 8, word: "HINI", name: "Col5 HINI" },
    { col: 6, startRow: 1, endRow: 4, word: "SUSS", name: "Col6 SUSS" },
    { col: 6, startRow: 6, endRow: 8, word: "MSC", name: "Col6 MSC" },
  ],
};

const solutionLetters = Array.from(
  new Set(
    solutionGrid
      .flat()
      .filter(Boolean)
      .map(s => (s ?? "").toUpperCase())
  )
);

export const initialLetters = ["E", "L", "S", "E", "H"];