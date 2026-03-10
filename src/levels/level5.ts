import { GridCell, WordPattern } from "../types";

export const puzzleData: { grid: GridCell[][] } = {
  grid: [
    // ---------- ROW 0: Top Clues (down-starting clues) ----------
    [
      { type: "clue", text: "", id: "top-0" },
      { type: "icon", text: "", imageLocal: require("../assets/levels/level5/14.png"), id: "top-1", hintDir: "down" },
      { type: "clue", text: "TO GET TO", id: "top-2", hintDir: "down" },            
      { type: "clue", text: "BEFORE F", id: "top-3", hintDir: "down" },             
      { type: "clue", text: "__AY", id: "top-4", hintDir: "down" },           
      { type: "icon", text: "", imageLocal: require("../assets/levels/level5/13.png"), id: "top-5", hintDir: "down" },
      { type: "clue", text: "PASS", id: "top-6", hintDir: "down" },                
    ],

    // ---------- ROW 1 ----------
    [
      { type: "clue", text: "MAKES", id: "left-1", hintDir: "across" }, 
      { type: "empty", text: "", id: "1-1", hintDir: "across" },
      { type: "empty", text: "", id: "1-2", hintDir: "across" },
      { type: "empty", text: "", id: "1-3", hintDir: "across" },
      { type: "empty", text: "", id: "1-4", hintDir: "across" },
      { type: "empty", text: "", id: "1-5", hintDir: "across" },
      { type: "empty", text: "", id: "1-6", hintDir: "across" },
    ],

    // ---------- ROW 2 ----------
    [
      { type: "clue", text: "MALE PRONOUN", id: "left-2", hintDir: "across" }, 
      { type: "empty", text: "", id: "2-1" },
      { type: "empty", text: "", id: "2-2" },
      { type: "clue", text: "COOKING PAN / CLEANING BAR", id: "2-3" }, 
      { type: "empty", text: "", id: "2-4" },
      { type: "empty", text: "", id: "2-5" },
      { type: "letter", text: "K", id: "2-6", placed: true },
    ],

    // ---------- ROW 3 ----------
    [
      { type: "clue", text: "ASSOC. DEG.", id: "left-3", hintDir: "across" }, 
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "clue", text: "L__NG / RUSSIAN RULER", id: "3-4" , hintDir: "down"},
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],

    // ---------- ROW 4 ----------
    [
      { type: "clue", text: "_AS___", id: "left-4", hintDir: "across" }, 
      { type: "empty", text: "", id: "4-1" },
      { type: "empty", text: "", id: "4-2" },
      { type: "empty", text: "", id: "4-3" },
      { type: "empty", text: "", id: "4-4" },
      { type: "clue", text: "_OT", id: "4-5", hintDir: "down" },
      { type: "empty", text: "", id: "4-6" },
    ],

    // ---------- ROW 5 ----------
    [
      { type: "clue", text: "STAGES", id: "left-5", hintDir: "across" },
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "H", id: "5-2" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "empty", text: "", id: "5-5" },
      { type: "empty", text: "", id: "5-6" },
    ],

    // ---------- ROW 6 ----------
    [
      { type: "clue", text: "ME", id: "left-6", hintDir: "across" },
      { type: "empty", text: "", id: "6-1" },
      { type: "clue", text: "COOKING VESSEL / YES", id: "6-2" , hintDir: "down"},
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "empty", text: "", id: "6-5" },
      { type: "clue", text: "NUMERICAL SYSTEM", id: "6-6", hintDir: "down" },
    ],

    // ---------- ROW 7 ----------
    [
      { type: "clue", text: "OPERATING SYSTEM", id: "left-7", hintDir: "across" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "clue", text: "MOVE FAST", id: "7-3", hintDir: "down" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "empty", text: "", id: "7-6" },
    ],

    // ---------- ROW 8 ----------
    [
      { type: "clue", text: "ZERO", id: "left-8", hintDir: "across" }, 
      { type: "empty", text: "", id: "8-1" },
      { type: "empty", text: "", id: "8-2" },
      { type: "empty", text: "", id: "8-3" },
      { type: "clue", text: "MISS", id: "8-4", hintDir: "across" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
  ],
};

export const solutionGrid: string[][] = [
  ["",    "",  "",  "",  "",  "",  ""],
  ["",   "C", "R", "E", "A", "T", "S"], // row 1
  ["",   "H", "E", "", "W", "O",  "K"], // row 2
  ["",   "A", "A", "S", "", "Y", "I"], // row 3
  ["",   "M", "C", "O", "T",  "", "P"], // row 4
  ["",   "P", "H", "A", "S", "E", "S"], // row 5
  ["",   "I", "",  "P",  "A", "N", ""], // row 6
  ["",   "O", "S", "", "R", "U", "N"], // row 7
  ["",   "N", "I", "L", "", "M", "S"], // row 8
];

export const clues = {
  across: [
    { id: "A1", row: 1, startCol: 1, endCol: 6, word: "CREATS", clue: "Makes" },
    { id: "A2", row: 2, startCol: 1, endCol: 2, word: "HE", clue: "Male pronoun" },
    { id: "A3", row: 2, startCol: 4, endCol: 6, word: "WOK", clue: "Stir-fry pan" },
    { id: "A4", row: 3, startCol: 1, endCol: 3, word: "AAS", clue: "Assoc. degree (abbr.)" },
    { id: "A5", row: 3, startCol: 5, endCol: 6, word: "YI", clue: "Chinese surname" },
    { id: "A6", row: 4, startCol: 1, endCol: 4, word: "MCOT", clue: "Thai broadcaster (abbr.)" },
    { id: "A7", row: 4, startCol: 6, endCol: 6, word: "P", clue: "The letter 'P'" },
    { id: "A8", row: 5, startCol: 1, endCol: 6, word: "PHASES", clue: "Stages" },
    { id: "A9", row: 6, startCol: 1, endCol: 1, word: "I", clue: "Pronoun" },
    { id: "A10", row: 6, startCol: 3, endCol: 5, word: "PAN", clue: "Cooking pan" },
    { id: "A11", row: 7, startCol: 1, endCol: 2, word: "OS", clue: "Operating systems (abbr.)" },
    { id: "A12", row: 7, startCol: 4, endCol: 6, word: "RUN", clue: "Move swiftly; also a go in sport" },
    { id: "A13", row: 8, startCol: 1, endCol: 3, word: "NIL", clue: "Zero, in sports" },
    { id: "A14", row: 8, startCol: 5, endCol: 6, word: "MS", clue: "Manuscripts (abbr.)" },
  ],
  down: [
    { id: "D1", col: 1, startRow: 1, endRow: 8, word: "CHAMPION", clue: "Winner" },
    { id: "D2", col: 2, startRow: 1, endRow: 5, word: "REACH", clue: "To get to / extend to" },
    { id: "D3", col: 2, startRow: 7, endRow: 8, word: "SI", clue: "Chemical symbol for silicon (Si)" },
    { id: "D4", col: 3, startRow: 1, endRow: 1, word: "E", clue: "The letter E" },
    { id: "D5", col: 3, startRow: 3, endRow: 6, word: "SOAP", clue: "Cleaning product" },
    { id: "D6", col: 3, startRow: 8, endRow: 8, word: "L", clue: "The letter L" },
    { id: "D7", col: 4, startRow: 1, endRow: 2, word: "AW", clue: "Expression of sympathy / mild exclamation" },
    { id: "D8", col: 4, startRow: 4, endRow: 7, word: "TSAR", clue: "Russian ruler (alt. spelling: czar)" },
    { id: "D9", col: 5, startRow: 1, endRow: 3, word: "TOY", clue: "Plaything" },
    { id: "D10", col: 5, startRow: 5, endRow: 8, word: "ENUM", clue: "Programming shorthand for 'enumeration' (enum)" },
    { id: "D11", col: 6, startRow: 1, endRow: 5, word: "SKIPS", clue: "Omits; hops over" },
    { id: "D12", col: 6, startRow: 7, endRow: 8, word: "NS", clue: "Nova Scotia (abbr.)" },
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

// export this instead of a hard-coded list
export const allAvailableLetters = solutionLetters;

// a small starter set (changeable)
export const initialLetters = ["I", "A", "H", "P", "Y"];