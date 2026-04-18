#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

if [[ -n "${ANTHROPIC_AUTH_TOKEN:-}" ]]; then
  mkdir -p "$HOME/.claude"
  cat > "$HOME/.claude/settings.json" <<JSON
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "${ANTHROPIC_AUTH_TOKEN}",
    "ANTHROPIC_BASE_URL": "${ANTHROPIC_BASE_URL:-https://code.newcli.com/claude}",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": ${CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC:-1}
  },
  "permissions": {"allow": [], "deny": []}
}
JSON
fi

exec /Users/Zhuanz/.openclaw/.npm-global/bin/claude "$@"
