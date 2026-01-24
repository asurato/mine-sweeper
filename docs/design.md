# マインスイーパー 設計書

## 技術スタック

| 項目 | 技術 |
|------|------|
| 言語 | TypeScript |
| UIフレームワーク | React |
| グラフィックス | Pixi.js + @pixi/react |
| ビルドツール | Vite |
| パッケージマネージャ | npm |
| テストフレームワーク | Vitest |

## 型定義

```typescript
// 難易度
type Difficulty = 'easy' | 'medium' | 'hard';

// 難易度設定
type DifficultyConfig = {
  rows: number;
  cols: number;
  mines: number;
};

// マスの状態
type CellState = {
  isMine: boolean;        // 地雷かどうか
  isRevealed: boolean;    // 開いているかどうか
  isFlagged: boolean;     // フラグが立っているかどうか
  adjacentMines: number;  // 周囲の地雷数
};

// 盤面
type Board = CellState[][];

// ゲーム状態
type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

// ゲーム全体の状態
type GameState = {
  board: Board;
  status: GameStatus;
  difficulty: Difficulty;
  minesCount: number;
  flagsCount: number;
  time: number;
  isFirstClick: boolean;
};
```

## 定数

```typescript
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const HEADER_HEIGHT = 60;

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const MAX_TIMER = 999;
```

## コンポーネント設計

### App.tsx

- 画面遷移の管理（タイトル画面 ↔ ゲーム画面）
- Pixi.js Stageのセットアップ

### TitleScreen.tsx

- タイトルテキスト「マインスイーパー」の表示
- 難易度選択ボタン3つ
- ボタンクリックで難易度を選択し、ゲーム画面へ遷移

### GameScreen.tsx

- ゲーム状態の管理（useGame フック使用）
- Header と Board を配置

### Header.tsx

- 残り地雷数の表示（左）
- リスタートボタン（中央）
- タイマーの表示（右）

### Board.tsx

- 盤面の描画
- マスサイズの計算
- Cell コンポーネントを配置

### Cell.tsx

- 単一マスの描画
- 状態に応じた見た目の切り替え
  - 未開放: グレー
  - 開放済み（数字）: 明るい色 + 数字
  - 開放済み（空白）: 明るい色
  - フラグ: グレー + フラグマーク
  - 地雷: 地雷マーク
- クリックイベントのハンドリング

## ゲームロジック設計

### board.ts

```typescript
// 空の盤面を生成
function createEmptyBoard(rows: number, cols: number): Board;

// 地雷を配置（最初のクリック位置を除く）
function placeMines(board: Board, minesCount: number, excludeRow: number, excludeCol: number): Board;

// 周囲の地雷数を計算
function calculateAdjacentMines(board: Board): Board;

// マスを開く（再帰的に空白マスを開く）
function revealCell(board: Board, row: number, col: number): Board;

// フラグを切り替え
function toggleFlag(board: Board, row: number, col: number): Board;

// 両クリック処理
function chordCell(board: Board, row: number, col: number): { board: Board; hitMine: boolean };

// 勝利判定
function checkWin(board: Board, minesCount: number): boolean;

// 全ての地雷を表示（敗北時）
function revealAllMines(board: Board): Board;

// 全ての地雷に旗を立てる（勝利時）
function flagAllMines(board: Board): Board;
```

### cell.ts

```typescript
// 周囲8マスの座標を取得
function getAdjacentCells(row: number, col: number, rows: number, cols: number): [number, number][];
```

## フック設計

### useGame.ts

```typescript
function useGame() {
  // 状態
  const [gameState, setGameState] = useState<GameState>(...);

  // アクション
  const startGame = (difficulty: Difficulty) => void;
  const handleCellClick = (row: number, col: number) => void;
  const handleCellRightClick = (row: number, col: number) => void;
  const handleChord = (row: number, col: number) => void;
  const restart = () => void;

  return { gameState, startGame, handleCellClick, handleCellRightClick, handleChord, restart };
}
```

### useTimer.ts

```typescript
function useTimer(isRunning: boolean, maxTime: number) {
  const [time, setTime] = useState(0);

  // isRunning が true の間、1秒ごとにカウントアップ
  // maxTime で停止

  const reset = () => void;

  return { time, reset };
}
```

## マスサイズの計算

```typescript
function calculateCellSize(difficulty: Difficulty): number {
  const config = DIFFICULTY_CONFIG[difficulty];
  const availableWidth = SCREEN_WIDTH - PADDING * 2;
  const availableHeight = SCREEN_HEIGHT - HEADER_HEIGHT - PADDING * 2;

  const cellWidth = Math.floor(availableWidth / config.cols);
  const cellHeight = Math.floor(availableHeight / config.rows);

  return Math.min(cellWidth, cellHeight);
}
```

## テスト方針

### テスト対象

主にゲームロジック（`src/game/`）をテスト対象とする。

- `board.ts`
  - 盤面生成
  - 地雷配置（最初のクリック位置に配置されないこと）
  - 周囲地雷数の計算
  - マスを開く処理（空白マスの連鎖オープン）
  - フラグ切り替え
  - 両クリック処理
  - 勝利判定

- `cell.ts`
  - 周囲座標取得（境界値テスト）

### テストファイル配置

テストファイルはテスト対象と同じフォルダに配置する（例: `board.ts` と `board.test.ts` は同じフォルダ）。
