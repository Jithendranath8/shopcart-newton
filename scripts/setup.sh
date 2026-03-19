#!/usr/bin/env bash
# setup.sh — Idempotent environment setup script
# Safe to run multiple times; produces the same result each time.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> [setup] Starting idempotent setup for ShopSmart..."

# 1. Install Node.js if not present (uses nvm if available, otherwise checks globally)
if ! command -v node &>/dev/null; then
  echo "==> [setup] Node.js not found. Please install Node.js 18+ and re-run this script."
  exit 1
else
  echo "==> [setup] Node.js found: $(node -v)"
fi

# 2. Create .env files from examples if they don't already exist (idempotent)
if [ ! -f "$APP_DIR/server/.env" ]; then
  echo "PORT=5001" > "$APP_DIR/server/.env"
  echo "==> [setup] Created server/.env"
else
  echo "==> [setup] server/.env already exists, skipping."
fi

# 3. Install server dependencies (npm ci is idempotent)
echo "==> [setup] Installing server dependencies..."
cd "$APP_DIR/server"
npm ci

# 4. Install client dependencies (npm ci is idempotent)
echo "==> [setup] Installing client dependencies..."
cd "$APP_DIR/client"
npm ci

# 5. Ensure PM2 is installed globally (idempotent)
if ! command -v pm2 &>/dev/null; then
  echo "==> [setup] Installing PM2 globally..."
  npm install -g pm2
else
  echo "==> [setup] PM2 already installed: $(pm2 -v)"
fi

# 6. Create logs directory idempotently
mkdir -p "$APP_DIR/logs"

echo "==> [setup] Setup complete!"
