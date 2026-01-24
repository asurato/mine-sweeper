import { useState, useCallback } from 'react';
import { Difficulty, GameState, GameStatus } from '../game/types';
import { DIFFICULTY_CONFIG } from '../game/constants';
import {
  createEmptyBoard,
  placeMines,
  calculateAdjacentMines,
  revealCell,
  toggleFlag,
  chordCell,
  checkWin,
  revealAllMines,
  flagAllMines,
  countFlags,
} from '../game/board';

const createInitialState = (difficulty: Difficulty): GameState => ({
  board: createEmptyBoard(
    DIFFICULTY_CONFIG[difficulty].rows,
    DIFFICULTY_CONFIG[difficulty].cols
  ),
  status: 'idle',
  difficulty,
  minesCount: DIFFICULTY_CONFIG[difficulty].mines,
  flagsCount: 0,
  isFirstClick: true,
});

export function useGame(initialDifficulty: Difficulty) {
  const [gameState, setGameState] = useState<GameState>(
    createInitialState(initialDifficulty)
  );

  const handleCellClick = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;
      if (prev.board[row][col].isRevealed || prev.board[row][col].isFlagged) {
        return prev;
      }

      let board = prev.board;
      let status: GameStatus = prev.status;
      let isFirstClick = prev.isFirstClick;

      if (prev.isFirstClick) {
        board = placeMines(board, prev.minesCount, row, col);
        board = calculateAdjacentMines(board);
        isFirstClick = false;
        status = 'playing';
      }

      if (board[row][col].isMine) {
        board = revealAllMines(board, row, col);
        status = 'lost';
      } else {
        board = revealCell(board, row, col);
        if (checkWin(board)) {
          board = flagAllMines(board);
          status = 'won';
        }
      }

      return {
        ...prev,
        board,
        status,
        isFirstClick,
        flagsCount: countFlags(board),
      };
    });
  }, []);

  const handleCellRightClick = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;
      if (prev.board[row][col].isRevealed) return prev;

      const board = toggleFlag(prev.board, row, col);
      return {
        ...prev,
        board,
        flagsCount: countFlags(board),
      };
    });
  }, []);

  const handleChord = useCallback((row: number, col: number) => {
    setGameState((prev) => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;

      const { board, hitMine, explodedRow, explodedCol } = chordCell(prev.board, row, col);
      if (hitMine) {
        return {
          ...prev,
          board: revealAllMines(board, explodedRow, explodedCol),
          status: 'lost' as const,
        };
      }

      if (checkWin(board)) {
        return {
          ...prev,
          board: flagAllMines(board),
          status: 'won' as const,
        };
      }

      return {
        ...prev,
        board,
        flagsCount: countFlags(board),
      };
    });
  }, []);

  const restart = useCallback(() => {
    setGameState((prev) => createInitialState(prev.difficulty));
  }, []);

  return {
    gameState,
    handleCellClick,
    handleCellRightClick,
    handleChord,
    restart,
  };
}
