import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "clue", text: "Tracking Devices", id: "top-1", hintDir: "down" },
      { type: "clue", text: "Charged Particle", id: "top-2", hintDir: "down" },
      { type: "clue", text: "Increasing", id: "top-3", hintDir: "down" },
      { type: "clue", text: "Past Tense Suffix", id: "top-4", hintDir: "down" },
      { type: "clue", text: "Letter Before S", id: "top-5", hintDir: "down" },
      { type: "clue", text: "Tuck In", id: "top-6", hintDir: "down" },
    ],

    // ---------- ROW 1 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level2/8.png"), id: "left-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-1" , hintDir: "across" },
      { type: "empty", text: "", id: "1-2" , hintDir: "across" },
      { type: "letter", text: "G", id: "1-3" ,placed: true, hintDir: "across" },
      { type: "empty", text: "", id: "1-4" , hintDir: "across" },
      { type: "empty", text: "", id: "1-5" , hintDir: "across" },
      { type: "empty", text: "", id: "1-6" , hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "icon", text: "", imageLocal: require("../assets/levels/level2/9.png"), id: "left-2", hintDir: "across" },
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "empty", text: "", id: "2-4" },
      { type: "clue", text: "_AT / Laugh", id: "2-5", hintDir: "down" },
      { type: "empty", text: "", id: "2-6" },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "Black Cuckoo", id: "left-3", hintDir: "across" },
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "letter", text: "I", id: "3-3", placed:true },
      { type: "clue", text: "Greeting/For Example", id: "3-4" , hintDir: "down"},
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "Carbon", id: "left-4", hintDir: "across" },
      { type: "empty", text: "", id: "4-1" },
      { type: "clue", text: "Close By/Part Of Speech", id: "4-2", hintDir: "down" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "Chess Piece", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "empty", text: "", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "letter", text: "T", id: "5-6", placed:true },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "Billion Years", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "clue", text: "Gemini/Senior", id: "6-4", hintDir: "down" },
      { type: "empty", text: "", id: "6-5" },
      { type: "empty", text: "", id: "6-6" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "Floor Covering", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "letter", text: "S", id: "7-4", placed: true },
      { type: "clue", text: "Nitrogen/Roman 1", id: "7-5", hintDir: "down" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "Tin's Symbol", id: "left-8", hintDir: "across" },
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "clue", text: "Equip", id: "8-3", hintDir: "across" },
      { type: "empty", text: "", id: "8-4" },
      { type: "empty", text: "", id: "8-5" },
      { type: "letter", text: "G", id: "8-6", placed: true },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""], // row 0 - top clues
  ["", "T", "I", "G", "E", "R", "S"], // row 1
  ["", "R", "O", "A", "D", "", "H"], // row 2
  ["", "A", "N", "I", "", "H", "I"], // row 3
  ["", "C", "", "N", "E", "A", "R"], // row 4
  ["", "K", "N", "I", "G", "H", "T"], // row 5
  ["", "E", "O", "N", "", "A", "I"], // row 6
  ["", "R", "U", "G", "S", "", "N"], // row 7
  ["", "S", "N", "", "R", "I", "G"], // row 8
];

export const wordPatterns: { completeRows: WordPattern[]; completeColumns: WordPattern[] } = {
  completeRows: [
    { row: 1, startCol: 1, endCol: 6, word: "TIGERS", name: "Row1 TIGERS" },
    { row: 2, startCol: 1, endCol: 4, word: "ROAD", name: "Row2 ROAD" },
    { row: 3, startCol: 1, endCol: 3, word: "ANI", name: "Row3 ANI" },
    { row: 3, startCol: 5, endCol: 6, word: "HI", name: "Row3 HI" },
    { row: 4, startCol: 1, endCol: 1, word: "C", name: "Row4 C" },
    { row: 4, startCol: 3, endCol: 6, word: "NEAR", name: "Row4 NEAR" },
    { row: 5, startCol: 1, endCol: 6, word: "KNIGHT", name: "Row5 KNIGHT" },
    { row: 6, startCol: 1, endCol: 3, word: "EON", name: "Row6 EON" },
    { row: 6, startCol: 5, endCol: 6, word: "AI", name: "Row6 AI" },
    { row: 7, startCol: 1, endCol: 4, word: "RUGS", name: "Row7 RUGS" },
    { row: 8, startCol: 1, endCol: 2, word: "SN", name: "Row8 SN" },
    { row: 8, startCol: 4, endCol: 6, word: "RIG", name: "Row8 RIG" },
  ],
  completeColumns: [
    { col: 1, startRow: 1, endRow: 8, word: "TRACKERS", name: "Col1 TRACKERS" },
    { col: 2, startRow: 1, endRow: 3, word: "ION", name: "Col2 ION" },
    { col: 2, startRow: 5, endRow: 8, word: "NOUN", name: "Col2 NOUN" },
    { col: 3, startRow: 1, endRow: 7, word: "GAINING", name: "Col3 GAINING" },
    { col: 4, startRow: 1, endRow: 2, word: "ED", name: "Col4 ED" },
    { col: 4, startRow: 4, endRow: 7, word: "EG", name: "Col4 EG" },
    { col: 4, startRow: 4, endRow: 7, word: "SR", name: "Col4 SR" },
    { col: 5, startRow: 1, endRow: 1, word: "R", name: "Col5 R" },
    { col: 5, startRow: 3, endRow: 8, word: "HAHA", name: "Col5 HAHA" },
    { col: 5, startRow: 3, endRow: 8, word: "I", name: "Col5 I" },
    { col: 6, startRow: 1, endRow: 6, word: "SHIRTING", name: "Col6 SHIRTING" },
  ],
};

const solutionLetters = Array.from(
  new Set(
    solutionGrid
      .flat()
      .filter(Boolean)
      .map((s) => (s ?? "").toUpperCase())
  )
);

// export this instead of the hard-coded list
export const allAvailableLetters = solutionLetters;

export const initialLetters = ["T", "R", "A", "N", "G"];