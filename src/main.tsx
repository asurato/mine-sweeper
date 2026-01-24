import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import App from './App.tsx';

let root: Root | null = null;

function init() {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root element not found');
    return;
  }

  // 既存のrootがあればクリーンアップ
  if (root) {
    root.unmount();
  }

  root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

function cleanup() {
  if (root) {
    root.unmount();
    root = null;
  }
}

// カスタムイベントで再初期化をリッスン
window.addEventListener('minesweeper:init', () => {
  init();
});

window.addEventListener('minesweeper:cleanup', () => {
  cleanup();
});

// 初回実行
if (document.getElementById('root')) {
  init();
}
