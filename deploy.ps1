# Cloudflare R2にマインスイーパーのビルド成果物をデプロイするスクリプト
# 事前にrcloneで "r2" という名前のリモートを設定しておく必要がある
#
# 使い方: .\deploy.ps1 -Bucket <バケット名>
# 例:     .\deploy.ps1 -Bucket r2-bucket-name

param(
    [Parameter(Mandatory)]
    [string]$Bucket
)

npm run build
if ($LASTEXITCODE -eq 0) {
    rclone sync dist/minesweeper/ "r2:$Bucket/minesweeper/"
}
