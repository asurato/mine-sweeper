import { useEffect, useCallback } from 'react';
import type { Board as BoardType, Difficulty } from '../game/types';
import { calculateCellSize, PADDING, HEADER_HEIGHT } from '../game/constants';
import { Cell } from './Cell';

type BoardProps = {
  board: BoardType;
  difficulty: Difficulty;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  disabled: boolean;
};

// グローバルなマウス状態とホバーセル
const mouseState = {
  left: false,
  right: false,
  chordFired: false,
  hoverRow: -1,
  hoverCol: -1,
  chordCallback: null as ((row: number, col: number) => void) | null,
  ignoreNextClick: false,
};

// 次のクリックを無視するようにする（画面遷移時に呼ぶ）
export function ignoreNextClick() {
  mouseState.ignoreNextClick = true;
}

// 両クリック検出用のグローバルリスナー（一度だけ登録）
let listenersRegistered = false;

function registerGlobalListeners() {
  if (listenersRegistered || typeof window === 'undefined') return;
  listenersRegistered = true;

  window.addEventListener('mousedown', (e) => {
    if (e.button === 0) mouseState.left = true;
    if (e.button === 2) mouseState.right = true;

    // 両方押されたらコード発動
    if (mouseState.left && mouseState.right && !mouseState.chordFired) {
      if (mouseState.hoverRow >= 0 && mouseState.hoverCol >= 0 && mouseState.chordCallback) {
        mouseState.chordCallback(mouseState.hoverRow, mouseState.hoverCol);
        mouseState.chordFired = true;
      }
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) mouseState.left = false;
    if (e.button === 2) mouseState.right = false;

    if (!mouseState.left && !mouseState.right) {
      mouseState.chordFired = false;
    }
  });
}

export function Board({
  board,
  difficulty,
  onCellClick,
  onCellRightClick,
  onChord,
  disabled,
}: BoardProps) {
  const cellSize = calculateCellSize(difficulty);
  const rows = board.length;
  const cols = board[0].length;

  const boardWidth = cols * cellSize;
  const boardHeight = rows * cellSize;

  const offsetX = (800 - boardWidth) / 2;
  const offsetY = HEADER_HEIGHT + PADDING + (600 - HEADER_HEIGHT - PADDING * 2 - boardHeight) / 2;

  // グローバルリスナーを登録
  useEffect(() => {
    registerGlobalListeners();
  }, []);

  // コードコールバックを更新
  useEffect(() => {
    if (!disabled) {
      mouseState.chordCallback = onChord;
    } else {
      mouseState.chordCallback = null;
    }
    return () => {
      mouseState.chordCallback = null;
    };
  }, [onChord, disabled]);

  // クリックハンドラー（コード発火済み or 無視フラグならスキップ）
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (disabled || mouseState.chordFired) return;
      if (mouseState.ignoreNextClick) {
        mouseState.ignoreNextClick = false;
        return;
      }
      onCellClick(row, col);
    },
    [disabled, onCellClick]
  );

  const handleCellRightClick = useCallback(
    (row: number, col: number) => {
      if (disabled || mouseState.chordFired) return;
      if (mouseState.ignoreNextClick) {
        mouseState.ignoreNextClick = false;
        return;
      }
      onCellRightClick(row, col);
    },
    [disabled, onCellRightClick]
  );

  return (
    <pixiContainer x={offsetX} y={offsetY}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            x={colIndex * cellSize}
            y={rowIndex * cellSize}
            size={cellSize}
            onLeftClick={() => handleCellClick(rowIndex, colIndex)}
            onRightClick={() => handleCellRightClick(rowIndex, colIndex)}
            onHover={() => {
              mouseState.hoverRow = rowIndex;
              mouseState.hoverCol = colIndex;
            }}
            onLeave={() => {
              if (mouseState.hoverRow === rowIndex && mouseState.hoverCol === colIndex) {
                mouseState.hoverRow = -1;
                mouseState.hoverCol = -1;
              }
            }}
          />
        ))
      )}
    </pixiContainer>
  );
}
