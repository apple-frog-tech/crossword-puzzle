export type HintLine = {
  text: string;
  hintDir?: 'across' | 'down';
};


export interface GridCell {
  type: "clue" | "letter" | "empty" | "special" | "icon"
  text: string
  id: string
  placed?: boolean
  placedBy?: "You" | "Opponent"
  tentative?: boolean
  tentativeBy?: "You" | "Opponent"
  tentativeTileId?: string
  imageLocal?: any;    
  imageUrl?: string;   
  imageData?: string; 
  alt?: string;
  recentlyScored?: "correct" | "wrong";
  wordHighlight?: boolean;
  hintDir?: 'across' | 'down';
  hintLines?: HintLine[];
}

// export interface WordPattern {
//   row?: number
//   col?: number
//   word: string
//   name: string
// }
export interface WordPattern {
  row?: number       // row index for an across pattern
  col?: number       // column index for a down pattern
  startCol?: number  // used when row is set
endCol?: number    // used when row is set
  startRow?: number  // used when col is set
  endRow?: number    // used when col is set

  word: string
  name: string
}


export interface Scores {
  You: number
  Opponent: number
}

// export interface TurnPlacement {
//   tileId?: string
//   row: number
//   col: number
//   char: string
//   originalIndex: number
// }

export interface TilePlacement {
  tileId?: string;
  row: number;
  col: number;
  char: string;
  originalIndex?: number;
}

export type TurnPlacement = TilePlacement & {
  by?: string;                     
  placements?: TilePlacement[];    
  ts?: number;                    
};

export interface DeckItem {
  id: string
  char: string
  originalIndex?: number
}

export interface LogicProps {
  grid: GridCell[][]
  setGrid: React.Dispatch<React.SetStateAction<GridCell[][]>>
  letterDeck: DeckItem[]
  setLetterDeck: React.Dispatch<React.SetStateAction<DeckItem[]>>
  selectedLetterIndex: number | null
  setSelectedLetterIndex: React.Dispatch<React.SetStateAction<number | null>>
  currentPlayer: "You" | "Opponent"
  setCurrentPlayer: React.Dispatch<React.SetStateAction<"You" | "Opponent">>
  scores: Scores
  setScores: React.Dispatch<React.SetStateAction<Scores>>
  gameHistory: string[]
  setGameHistory: React.Dispatch<React.SetStateAction<string[]>>
  completedWords: string[]
  setCompletedWords: React.Dispatch<React.SetStateAction<string[]>>
  solutionGrid: string[][]
  puzzleData: { grid: GridCell[][] }
  turnPlacements: TurnPlacement[]
  setTurnPlacements: React.Dispatch<React.SetStateAction<TurnPlacement[]>>
}
