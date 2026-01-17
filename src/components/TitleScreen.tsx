import { useCallback } from 'react';
import type { Graphics as PixiGraphics, FederatedPointerEvent } from 'pixi.js';
import type { Difficulty } from '../game/types';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../game/constants';

type TitleScreenProps = {
  onSelectDifficulty: (difficulty: Difficulty) => void;
};

type ButtonProps = {
  text: string;
  y: number;
  onClick: () => void;
};

function Button({ text, y, onClick }: ButtonProps) {
  const buttonWidth = 200;
  const buttonHeight = 50;
  const x = (SCREEN_WIDTH - buttonWidth) / 2;

  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    g.roundRect(0, 0, buttonWidth, buttonHeight, 8);
    g.fill(0x4a90d9);
    g.stroke({ width: 2, color: 0x2a70b9 });
  }, []);

  const handleClick = useCallback(
    (e: FederatedPointerEvent) => {
      e.stopPropagation();
      onClick();
    },
    [onClick]
  );

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics
        draw={draw}
        eventMode="static"
        cursor="pointer"
        onPointerDown={handleClick}
      />
      <pixiText
        text={text}
        x={buttonWidth / 2}
        y={buttonHeight / 2}
        anchor={0.5}
        style={{
          fontSize: 24,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: 0xffffff,
        }}
      />
    </pixiContainer>
  );
}

export function TitleScreen({ onSelectDifficulty }: TitleScreenProps) {
  const drawBackground = useCallback((g: PixiGraphics) => {
    g.clear();
    g.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    g.fill(0x2c3e50);
  }, []);

  return (
    <pixiContainer>
      <pixiGraphics draw={drawBackground} />

      <pixiText
        text="マインスイーパー"
        x={SCREEN_WIDTH / 2}
        y={100}
        anchor={0.5}
        style={{
          fontSize: 48,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: 0xffffff,
        }}
      />

      <Button
        text="初級 (9x9)"
        y={220}
        onClick={() => onSelectDifficulty('easy')}
      />
      <Button
        text="中級 (16x16)"
        y={290}
        onClick={() => onSelectDifficulty('medium')}
      />
      <Button
        text="上級 (30x16)"
        y={360}
        onClick={() => onSelectDifficulty('hard')}
      />
    </pixiContainer>
  );
}
