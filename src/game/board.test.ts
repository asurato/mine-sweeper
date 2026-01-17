import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  placeMines,
  calculateAdjacentMines,
  revealCell,
  toggleFlag,
  chordCell,
  checkWin,
  revealAllMines,
  countFlags,
} from './board';

describe('createEmptyBoard', () => {
  it('指定したサイズの空の盤面を作成する', () => {
    const board = createEmptyBoard(3, 4);
    expect(board).toHaveLength(3);
    expect(board[0]).toHaveLength(4);

    for (const row of board) {
      for (const cell of row) {
        expect(cell.isMine).toBe(false);
        expect(cell.isRevealed).toBe(false);
        expect(cell.isFlagged).toBe(false);
        expect(cell.adjacentMines).toBe(0);
      }
    }
  });
});

describe('placeMines', () => {
  it('指定した数の地雷を配置する', () => {
    const board = createEmptyBoard(9, 9);
    const result = placeMines(board, 10, 0, 0);

    let mineCount = 0;
    for (const row of result) {
      for (const cell of row) {
        if (cell.isMine) mineCount++;
      }
    }
    expect(mineCount).toBe(10);
  });

  it('最初のクリック位置には地雷を配置しない', () => {
    const board = createEmptyBoard(3, 3);
    const result = placeMines(board, 8, 1, 1);

    expect(result[1][1].isMine).toBe(false);
  });

  it('元の盤面を変更しない', () => {
    const board = createEmptyBoard(3, 3);
    placeMines(board, 5, 0, 0);

    for (const row of board) {
      for (const cell of row) {
        expect(cell.isMine).toBe(false);
      }
    }
  });
});

describe('calculateAdjacentMines', () => {
  it('周囲の地雷数を正しく計算する', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isMine = true;
    board[0][1].isMine = true;

    const result = calculateAdjacentMines(board);

    expect(result[1][0].adjacentMines).toBe(2);
    expect(result[1][1].adjacentMines).toBe(2);
    expect(result[0][2].adjacentMines).toBe(1);
    expect(result[2][2].adjacentMines).toBe(0);
  });
});

describe('revealCell', () => {
  it('単一セルを開く', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isMine = true;
    const calculated = calculateAdjacentMines(board);

    const result = revealCell(calculated, 1, 1);
    expect(result[1][1].isRevealed).toBe(true);
  });

  it('空白セルを開くと連鎖的に開く', () => {
    const board = createEmptyBoard(3, 3);
    const calculated = calculateAdjacentMines(board);

    const result = revealCell(calculated, 1, 1);

    for (const row of result) {
      for (const cell of row) {
        expect(cell.isRevealed).toBe(true);
      }
    }
  });

  it('フラグが立っているセルは開かない', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isFlagged = true;
    const calculated = calculateAdjacentMines(board);

    const result = revealCell(calculated, 1, 1);
    expect(result[0][0].isRevealed).toBe(false);
  });
});

describe('toggleFlag', () => {
  it('フラグを立てる', () => {
    const board = createEmptyBoard(3, 3);
    const result = toggleFlag(board, 0, 0);
    expect(result[0][0].isFlagged).toBe(true);
  });

  it('フラグを外す', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isFlagged = true;
    const result = toggleFlag(board, 0, 0);
    expect(result[0][0].isFlagged).toBe(false);
  });

  it('開いているセルにはフラグを立てられない', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isRevealed = true;
    const result = toggleFlag(board, 0, 0);
    expect(result[0][0].isFlagged).toBe(false);
  });
});

describe('chordCell', () => {
  it('フラグ数が一致する場合、周囲を開く', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isMine = true;
    const calculated = calculateAdjacentMines(board);
    calculated[1][1].isRevealed = true;
    calculated[0][0].isFlagged = true;

    const { board: result, hitMine } = chordCell(calculated, 1, 1);
    expect(hitMine).toBe(false);
    expect(result[0][1].isRevealed).toBe(true);
    expect(result[1][0].isRevealed).toBe(true);
  });

  it('フラグ数が一致しない場合、何もしない', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isMine = true;
    const calculated = calculateAdjacentMines(board);
    calculated[1][1].isRevealed = true;

    const { board: result, hitMine } = chordCell(calculated, 1, 1);
    expect(hitMine).toBe(false);
    expect(result[0][1].isRevealed).toBe(false);
  });

  it('フラグの位置が間違っていたら地雷を踏む', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isMine = true;
    const calculated = calculateAdjacentMines(board);
    calculated[1][1].isRevealed = true;
    calculated[0][1].isFlagged = true; // 間違った位置にフラグ

    const { hitMine } = chordCell(calculated, 1, 1);
    expect(hitMine).toBe(true);
  });
});

describe('checkWin', () => {
  it('全ての非地雷セルが開いていたら勝利', () => {
    const board = createEmptyBoard(2, 2);
    board[0][0].isMine = true;
    board[0][1].isRevealed = true;
    board[1][0].isRevealed = true;
    board[1][1].isRevealed = true;

    expect(checkWin(board)).toBe(true);
  });

  it('非地雷セルが残っていたら未勝利', () => {
    const board = createEmptyBoard(2, 2);
    board[0][0].isMine = true;
    board[0][1].isRevealed = true;

    expect(checkWin(board)).toBe(false);
  });
});

describe('revealAllMines', () => {
  it('全ての地雷を表示する', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isMine = true;
    board[2][2].isMine = true;

    const result = revealAllMines(board);
    expect(result[0][0].isRevealed).toBe(true);
    expect(result[2][2].isRevealed).toBe(true);
    expect(result[1][1].isRevealed).toBe(false);
  });
});

describe('countFlags', () => {
  it('フラグの数を数える', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isFlagged = true;
    board[1][1].isFlagged = true;
    board[2][2].isFlagged = true;

    expect(countFlags(board)).toBe(3);
  });
});
