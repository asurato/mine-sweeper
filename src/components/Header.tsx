import { useCallback } from 'react';
import type { Graphics as PixiGraphics, FederatedPointerEvent } from 'pixi.js';
import { SCREEN_WIDTH, HEADER_HEIGHT } from '../game/constants';
import type { GameStatus } from '../game/types';

type HeaderProps = {
  minesCount: number;
  flagsCount: number;
  time: number;
  status: GameStatus;
  onRestart: () => void;
};

export function Header({
  minesCount,
  flagsCount,
  time,
  status,
  onRestart,
}: HeaderProps) {
  const remainingMines = minesCount - flagsCount;

  const drawBackground = useCallback((g: PixiGraphics) => {
    g.clear();
    g.rect(0, 0, SCREEN_WIDTH, HEADER_HEIGHT);
    g.fill(0x444444);
  }, []);

  const drawRestartButton = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.roundRect(0, 0, 60, 40, 5);
      g.fill(0x666666);
      g.stroke({ width: 2, color: 0x888888 });
    },
    []
  );

  const handleRestartClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      onRestart();
    },
    [onRestart]
  );

  const getStatusEmoji = () => {
    switch (status) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      default:
        return '🙂';
    }
  };

  return (
    <pixiContainer>
      <pixiGraphics draw={drawBackground} />

      {/* 残り地雷数 */}
      <pixiText
        text={String(remainingMines).padStart(3, '0')}
        x={30}
        y={HEADER_HEIGHT / 2}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 28,
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fill: 0xff0000,
        }}
      />

      {/* リスタートボタン */}
      <pixiContainer x={SCREEN_WIDTH / 2 - 30} y={10}>
        <pixiGraphics
          draw={drawRestartButton}
          eventMode="static"
          cursor="pointer"
          onPointerDown={handleRestartClick}
        />
        <pixiText
          text={getStatusEmoji()}
          x={30}
          y={20}
          anchor={0.5}
          style={{
            fontSize: 24,
          }}
        />
      </pixiContainer>

      {/* タイマー */}
      <pixiText
        text={String(time).padStart(3, '0')}
        x={SCREEN_WIDTH - 30}
        y={HEADER_HEIGHT / 2}
        anchor={{ x: 1, y: 0.5 }}
        style={{
          fontSize: 28,
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fill: 0xff0000,
        }}
      />
    </pixiContainer>
  );
}
