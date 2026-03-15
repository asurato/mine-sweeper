# マインスイーパー

PixiJS + React で作られたマインスイーパーゲーム。

## 開発

```bash
npm install
npm run dev
```

## デプロイ

Cloudflare R2 にビルド成果物をアップロードする。

### 前提条件

- [rclone](https://rclone.org/) がインストール済みであること
- rclone に `r2` という名前で Cloudflare R2 のリモートが設定済みであること

### 実行

```powershell
.\deploy.ps1 -Bucket <バケット名>
```
