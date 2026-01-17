import type { Difficulty, DifficultyConfig } from './types';

export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;
export const HEADER_HEIGHT = 60;
export const PADDING = 10;

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

export const MAX_TIMER = 999;

export function calculateCellSize(difficulty: Difficulty): number {
  const config = DIFFICULTY_CONFIG[difficulty];
  const availableWidth = SCREEN_WIDTH - PADDING * 2;
  const availableHeight = SCREEN_HEIGHT - HEADER_HEIGHT - PADDING * 2;

  const cellWidth = Math.floor(availableWidth / config.cols);
  const cellHeight = Math.floor(availableHeight / config.rows);

  return Math.min(cellWidth, cellHeight);
}
