#!/usr/bin/env bash
# deploy.sh — Idempotent deployment script
# Safe to run multiple times; produces the same stable deployment each time.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="shopsmart-backend"

echo "==> [deploy] Starting idempotent deployment..."

# 1. Pull latest code
cd "$APP_DIR"
git fetch --all
git reset --hard origin/main
echo "==> [deploy] Code updated to latest main."

# 2. Install server dependencies (npm ci is idempotent — reproducible from lockfile)
echo "==> [deploy] Installing server dependencies..."
cd "$APP_DIR/server"
npm ci --omit=dev

# 3. Build frontend (idempotent — output goes to dist/, overwritten each time)
echo "==> [deploy] Building frontend..."
cd "$APP_DIR/client"
npm ci
npm run build
echo "==> [deploy] Frontend built."

# 4. Start or restart the backend with PM2 (idempotent: restart if exists, start if not)
echo "==> [deploy] Starting/restarting backend with PM2..."
cd "$APP_DIR/server"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start src/index.js --name "$APP_NAME"
fi

# 5. Save PM2 process list so it survives server reboots (idempotent)
pm2 save --force

echo "==> [deploy] Deployment complete! App '$APP_NAME' is running."
pm2 status "$APP_NAME"
