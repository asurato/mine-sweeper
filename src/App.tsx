import { useState, useEffect, useRef } from 'react';
import { Application, extend } from '@pixi/react';
import { Container, Graphics, Text } from 'pixi.js';
import type { Difficulty } from './game/types';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './game/constants';
import { TitleScreen } from './components/TitleScreen';
import { GameScreen } from './components/GameScreen';
import { ignoreNextClick } from './components/Board';

extend({ Container, Graphics, Text });

type Screen = 'title' | 'game';

function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu);
      return () => {
        container.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  const handleSelectDifficulty = (selected: Difficulty) => {
    setDifficulty(selected);
    setScreen('game');
    ignoreNextClick();
  };

  return (
    <div ref={containerRef}>
      <Application
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        background={0x2c3e50}
        antialias={true}
      >
        {screen === 'title' ? (
          <TitleScreen onSelectDifficulty={handleSelectDifficulty} />
        ) : (
          <GameScreen key={difficulty} difficulty={difficulty} />
        )}
      </Application>
    </div>
  );
}

export default App;
