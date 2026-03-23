#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  echo "[ERROR] ANTHROPIC_API_KEY 未设置。"
  echo "请执行：cp $SCRIPT_DIR/.env.example $SCRIPT_DIR/.env 然后填入 key"
  exit 1
fi

export ANTHROPIC_MODEL="${ANTHROPIC_MODEL:-claude-sonnet-4-20250514}"

# 进入 workspace 根目录运行
cd /Users/Zhuanz/.openclaw/workspace
exec /Users/Zhuanz/.openclaw/.npm-global/bin/claude "$@"
