import { useCallback } from 'react';
import type { Graphics as PixiGraphics } from 'pixi.js';
import type { Difficulty } from '../game/types';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../game/constants';
import { useGame } from '../hooks/useGame';
import { useTimer } from '../hooks/useTimer';
import { Header } from './Header';
import { Board } from './Board';

type GameScreenProps = {
  difficulty: Difficulty;
};

export function GameScreen({ difficulty }: GameScreenProps) {
  const {
    gameState,
    handleCellClick,
    handleCellRightClick,
    handleChord,
    restart,
  } = useGame(difficulty);

  const isRunning = gameState.status === 'playing';
  const { time, reset: resetTimer } = useTimer(isRunning);

  const handleRestart = useCallback(() => {
    restart();
    resetTimer();
  }, [restart, resetTimer]);

  const drawBackground = useCallback((g: PixiGraphics) => {
    g.clear();
    g.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    g.fill(0x2c3e50);
  }, []);

  const isDisabled = gameState.status === 'won' || gameState.status === 'lost';

  return (
    <pixiContainer>
      <pixiGraphics draw={drawBackground} />
      <Header
        minesCount={gameState.minesCount}
        flagsCount={gameState.flagsCount}
        time={time}
        status={gameState.status}
        onRestart={handleRestart}
      />
      <Board
        board={gameState.board}
        difficulty={gameState.difficulty}
        onCellClick={handleCellClick}
        onCellRightClick={handleCellRightClick}
        onChord={handleChord}
        disabled={isDisabled}
      />
    </pixiContainer>
  );
}
