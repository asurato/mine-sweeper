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
  exploded: 0xff4444,
  mine: 0x222222,
  mineHighlight: 0x666666,
  mineFuse: 0x8b4513,
  mineSpark: 0xff6600,
  flag: 0xff0000,
  flagPole: 0x4a3728,
  flagBase: 0x2a2a2a,
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

function drawCellBackground(
  g: PixiGraphics,
  x: number,
  y: number,
  size: number,
  isRevealed: boolean,
  isExploded: boolean,
  isMine: boolean
) {
  g.rect(x, y, size, size);
  if (isExploded) {
    g.fill(COLORS.exploded);
  } else if (isMine && isRevealed) {
    // 押していない爆弾マス（敗北時に表示）は未開放の背景色
    g.fill(COLORS.unrevealed);
  } else {
    g.fill(isRevealed ? COLORS.revealed : COLORS.unrevealed);
  }
  g.stroke({
    width: 1,
    color: isRevealed && !isMine ? COLORS.revealedBorder : COLORS.unrevealedBorder,
  });
}

function drawMine(g: PixiGraphics, x: number, y: number, size: number) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * 0.28;

  // 本体（黒い円）
  g.circle(centerX, centerY, radius);
  g.fill(COLORS.mine);

  // ハイライト（光沢）
  const highlightX = centerX - radius * 0.3;
  const highlightY = centerY - radius * 0.3;
  const highlightRadius = radius * 0.25;
  g.circle(highlightX, highlightY, highlightRadius);
  g.fill(COLORS.mineHighlight);

  // 導火線
  const fuseStartX = centerX;
  const fuseStartY = centerY - radius;
  const fuseEndX = centerX + size * 0.1;
  const fuseEndY = centerY - radius - size * 0.12;
  g.moveTo(fuseStartX, fuseStartY);
  g.lineTo(fuseEndX, fuseEndY);
  g.stroke({ width: size * 0.04, color: COLORS.mineFuse });

  // 火花
  g.circle(fuseEndX, fuseEndY, size * 0.05);
  g.fill(COLORS.mineSpark);
}

function drawFlag(g: PixiGraphics, x: number, y: number, size: number) {
  const poleX = x + size * 0.35;
  const poleTop = y + size * 0.15;
  const poleBottom = y + size * 0.75;
  const poleWidth = size * 0.06;

  // ポール（旗竿）
  g.rect(poleX, poleTop, poleWidth, poleBottom - poleTop);
  g.fill(COLORS.flagPole);

  // 旗の布（三角形）
  const flagLeft = poleX + poleWidth;
  const flagTop = poleTop;
  const flagRight = x + size * 0.8;
  const flagBottom = y + size * 0.45;
  g.poly([flagLeft, flagTop, flagRight, (flagTop + flagBottom) / 2, flagLeft, flagBottom]);
  g.fill(COLORS.flag);

  // 土台
  const baseWidth = size * 0.3;
  const baseHeight = size * 0.12;
  const baseX = poleX + poleWidth / 2 - baseWidth / 2;
  const baseY = poleBottom;
  g.rect(baseX, baseY, baseWidth, baseHeight);
  g.fill(COLORS.flagBase);
}

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
      drawCellBackground(g, x, y, size, cell.isRevealed, cell.isExploded, cell.isMine);

      if (cell.isRevealed && cell.isMine) {
        drawMine(g, x, y, size);
      } else if (!cell.isRevealed && cell.isFlagged) {
        drawFlag(g, x, y, size);
      }
    },
    [cell.isRevealed, cell.isMine, cell.isFlagged, cell.isExploded, x, y, size]
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
