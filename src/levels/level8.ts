import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "FOOD TO GO", id: "top-1", hintDir: "down" },        
      { type: "clue", text: "SCHOOL SCORE", id: "top-2", hintDir: "down" },      
      { type: "clue", text: "ABSOLUTE", id: "top-3", hintDir: "down" },      
      { type: "clue", text: "____T", id: "top-4", hintDir: "down" },       
      { type: "clue", text: "HONORABLE", id: "top-5", hintDir: "down" },         
      { type: "clue", text: "_O__L", id: "top-6", hintDir: "down" },   
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "TEACH", id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "STUNT", id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "SAMURAI SWORD", id: "left-3", hintDir: "across" },
      { type: "empty", text: "", id: "3-1"},
      { type: "empty", text: "", id: "3-2"},
      { type: "empty", text: "", id: "3-3"},
      { type: "empty", text: "", id: "3-4"},
      { type: "empty", text: "", id: "3-5"},
      { type: "empty", text: "", id: "3-6"},
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "BIBLICAL GARDEN", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "clue", text: "LIST / TEST", id: "4-5" , hintDir: "down"},
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "_NG__", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "clue", text: "8 / OBSERVATION", id: "5-4" , hintDir: "down"},
      { type: "empty", text: "", id: "5-5" },
      { type: "clue", text: "BL___", id: "5-6" , hintDir: "down"},
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "_AR_", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "clue", text: "TIC TAC TOE / AFTER Q", id: "6-3", hintDir: "down" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "CAR SAFETY DEVICE", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1"},
      { type: "empty", text: "", id: "7-2"},
      { type: "empty", text: "", id: "7-3"},
      { type: "empty", text: "", id: "7-4"},
      { type: "empty", text: "", id: "7-5"},
      { type: "empty", text: "", id: "7-6"},
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "YOUTH CLUB", id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "clue", text: "MESSAGE", id: "8-3", hintDir: "across" },
      { type: "empty", text: "", id: "8-4"},
      { type: "empty", text: "", id: "8-5"},
      { type: "empty", text: "", id: "8-6"},
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""], // row 0 - top clues
  ["", "T", "A", "U", "G", "H", "T"], // row 1
  ["", "A", "C", "T", "I", "O", "N"], // row 2
  ["", "K", "A", "T", "A", "N", "A"], // row 3
  ["", "E", "D", "E", "N", "", "L"], // row 4
  ["", "A", "E", "R", "", "E", ""], // row 5
  ["", "W", "M", "", "O", "X", "O"], // row 6
  ["", "A", "I", "R", "B", "A", "G"], // row 7
  ["", "Y", "C", "", "S", "M", "S"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "TAUGHT", name: "Row1 TAUGHT" },
    { row: 2, startCol: 1, endCol: 6, word: "ACTION", name: "Row2 ACTION" },
    { row: 3, startCol: 1, endCol: 6, word: "KATANA", name: "Row3 KATANA" },
    { row: 4, startCol: 1, endCol: 4, word: "EDEN", name: "Row4 EDEN" },
    { row: 4, startCol: 6, endCol: 6, word: "L", name: "Row4 L" },
    { row: 5, startCol: 1, endCol: 3, word: "AER", name: "Row5 AER" },
    { row: 5, startCol: 5, endCol: 5, word: "E", name: "Row5 E" },
    { row: 6, startCol: 1, endCol: 2, word: "WM", name: "Row6 WM" },
    { row: 6, startCol: 4, endCol: 6, word: "OXO", name: "Row6 OXO" },
    { row: 7, startCol: 1, endCol: 6, word: "AIRBAG", name: "Row7 AIRBAG" },
    { row: 8, startCol: 1, endCol: 2, word: "YC", name: "Row8 YC" },
    { row: 8, startCol: 4, endCol: 6, word: "SMS", name: "Row8 SMS" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "TAKEAWAY", name: "Col1 TAKEAWAY" },
    { col: 2, startRow: 1, endRow: 8, word: "ACADEMIC", name: "Col2 ACADEMIC" },
    { col: 3, startRow: 1, endRow: 5, word: "UTTER", name: "Col3 UTTER" },
    { col: 3, startRow: 7, endRow: 7, word: "R", name: "Col3 R" },
    { col: 4, startRow: 1, endRow: 4, word: "GIAN", name: "Col4 GIAN" },
    { col: 4, startRow: 6, endRow: 8, word: "OBS", name: "Col4 OBS" },
    { col: 5, startRow: 1, endRow: 3, word: "HON", name: "Col5 HON" },
    { col: 5, startRow: 5, endRow: 8, word: "EXAM", name: "Col5 EXAM" },
    { col: 6, startRow: 1, endRow: 4, word: "TNAL", name: "Col6 TNAL" },
    { col: 6, startRow: 6, endRow: 8, word: "OGS", name: "Col6 OGS" },
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
export const initialLetters = ["X", "M", "D", "S", "I"];