import { useCallback } from 'react';
import type { Graphics as PixiGraphics, FederatedPointerEvent } from 'pixi.js';
import type { CellState } from '../game/types';

type CellProps = {
  cell: CellState;
  x: number;
  y: number;
  size: number;
  onLeftClick: () => void;
  onRightClick: () => void;
  onHover: () => void;
  onLeave: () => void;
};

const COLORS = {
  unrevealed: 0x999999,
  unrevealedBorder: 0x666666,
  revealed: 0xcccccc,
  revealedBorder: 0xaaaaaa,
  mine: 0xff0000,
  flag: 0xff6600,
};

const NUMBER_COLORS: Record<number, number> = {
  1: 0x0000ff,
  2: 0x008000,
  3: 0xff0000,
  4: 0x000080,
  5: 0x800000,
  6: 0x008080,
  7: 0x000000,
  8: 0x808080,
};

export function Cell({
  cell,
  x,
  y,
  size,
  onLeftClick,
  onRightClick,
  onHover,
  onLeave,
}: CellProps) {
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (cell.isRevealed) {
        g.rect(x, y, size, size);
        g.fill(COLORS.revealed);
        g.stroke({ width: 1, color: COLORS.revealedBorder });

        if (cell.isMine) {
          const centerX = x + size / 2;
          const centerY = y + size / 2;
          const radius = size * 0.3;
          g.circle(centerX, centerY, radius);
          g.fill(COLORS.mine);
        }
      } else {
        g.rect(x, y, size, size);
        g.fill(COLORS.unrevealed);
        g.stroke({ width: 1, color: COLORS.unrevealedBorder });

        if (cell.isFlagged) {
          const flagX = x + size * 0.3;
          const flagY = y + size * 0.2;
          const flagWidth = size * 0.4;
          const flagHeight = size * 0.3;
          g.rect(flagX, flagY, flagWidth, flagHeight);
          g.fill(COLORS.flag);
          g.rect(x + size * 0.5, y + size * 0.2, size * 0.08, size * 0.6);
          g.fill(0x000000);
        }
      }
    },
    [cell.isRevealed, cell.isMine, cell.isFlagged, x, y, size]
  );

  const handlePointerUp = useCallback(
    (e: FederatedPointerEvent) => {
      if (e.button === 0) {
        onLeftClick();
      } else if (e.button === 2) {
        onRightClick();
      }
    },
    [onLeftClick, onRightClick]
  );

  const handleRightClick = useCallback((e: FederatedPointerEvent) => {
    e.preventDefault();
  }, []);

  return (
    <>
      <pixiGraphics
        draw={draw}
        eventMode="static"
        onPointerUp={handlePointerUp}
        onRightClick={handleRightClick}
        onPointerOver={onHover}
        onPointerOut={onLeave}
      />
      {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
        <pixiText
          text={String(cell.adjacentMines)}
          x={x + size / 2}
          y={y + size / 2}
          anchor={0.5}
          style={{
            fontSize: size * 0.6,
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fill: NUMBER_COLORS[cell.adjacentMines] || 0x000000,
          }}
        />
      )}
    </>
  );
}
