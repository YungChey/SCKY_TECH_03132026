#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -f "prisma/dev.db" ]; then
  echo "Initializing local SQLite database..."
  npm run db:init
fi

echo "Starting VerdictAI on http://localhost:3000"
npm run dev
