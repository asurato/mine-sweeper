import type { Board, CellState } from './types';
import { getAdjacentCells } from './cell';

export function createEmptyBoard(rows: number, cols: number): Board {
  const board: Board = [];
  for (let r = 0; r < rows; r++) {
    const row: CellState[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        isExploded: false,
        adjacentMines: 0,
      });
    }
    board.push(row);
  }
  return board;
}

export function placeMines(
  board: Board,
  minesCount: number,
  excludeRow: number,
  excludeCol: number
): Board {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  let placed = 0;
  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (r === excludeRow && c === excludeCol) continue;
    if (newBoard[r][c].isMine) continue;

    newBoard[r][c].isMine = true;
    placed++;
  }

  return newBoard;
}

export function calculateAdjacentMines(board: Board): Board {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;

      const adjacent = getAdjacentCells(r, c, rows, cols);
      let count = 0;
      for (const [ar, ac] of adjacent) {
        if (newBoard[ar][ac].isMine) count++;
      }
      newBoard[r][c].adjacentMines = count;
    }
  }

  return newBoard;
}

export function revealCell(board: Board, row: number, col: number): Board {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));

  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;

    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) continue;

    newBoard[r][c].isRevealed = true;

    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
      const adjacent = getAdjacentCells(r, c, rows, cols);
      for (const [ar, ac] of adjacent) {
        if (!newBoard[ar][ac].isRevealed && !newBoard[ar][ac].isFlagged) {
          stack.push([ar, ac]);
        }
      }
    }
  }

  return newBoard;
}

export function toggleFlag(board: Board, row: number, col: number): Board {
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));

  if (!newBoard[row][col].isRevealed) {
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
  }

  return newBoard;
}

export function chordCell(
  board: Board,
  row: number,
  col: number
): { board: Board; hitMine: boolean; explodedRow?: number; explodedCol?: number } {
  const rows = board.length;
  const cols = board[0].length;
  let newBoard = board.map((r) => r.map((cell) => ({ ...cell })));

  const cell = newBoard[row][col];
  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return { board: newBoard, hitMine: false };
  }

  const adjacent = getAdjacentCells(row, col, rows, cols);
  let flagCount = 0;
  for (const [ar, ac] of adjacent) {
    if (newBoard[ar][ac].isFlagged) flagCount++;
  }

  if (flagCount !== cell.adjacentMines) {
    return { board: newBoard, hitMine: false };
  }

  let hitMine = false;
  let explodedRow: number | undefined;
  let explodedCol: number | undefined;
  for (const [ar, ac] of adjacent) {
    if (!newBoard[ar][ac].isFlagged && !newBoard[ar][ac].isRevealed) {
      if (newBoard[ar][ac].isMine) {
        hitMine = true;
        newBoard[ar][ac].isRevealed = true;
        if (explodedRow === undefined) {
          explodedRow = ar;
          explodedCol = ac;
        }
      } else {
        newBoard = revealCell(newBoard, ar, ac);
      }
    }
  }

  return { board: newBoard, hitMine, explodedRow, explodedCol };
}

export function checkWin(board: Board): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

export function revealAllMines(
  board: Board,
  explodedRow?: number,
  explodedCol?: number
): Board {
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));

  for (let r = 0; r < newBoard.length; r++) {
    for (let c = 0; c < newBoard[r].length; c++) {
      const cell = newBoard[r][c];
      if (cell.isMine) {
        cell.isRevealed = true;
        if (r === explodedRow && c === explodedCol) {
          cell.isExploded = true;
        }
      }
    }
  }

  return newBoard;
}

export function flagAllMines(board: Board): Board {
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));

  for (const row of newBoard) {
    for (const cell of row) {
      if (cell.isMine) {
        cell.isFlagged = true;
      }
    }
  }

  return newBoard;
}

export function countFlags(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) count++;
    }
  }
  return count;
}
