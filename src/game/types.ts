export type Difficulty = 'easy' | 'medium' | 'hard';

export type DifficultyConfig = {
  rows: number;
  cols: number;
  mines: number;
};

export type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isExploded: boolean;
  adjacentMines: number;
};

export type Board = CellState[][];

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type GameState = {
  board: Board;
  status: GameStatus;
  difficulty: Difficulty;
  minesCount: number;
  flagsCount: number;
  isFirstClick: boolean;
};
