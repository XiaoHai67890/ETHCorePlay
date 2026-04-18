#!/usr/bin/env bash
set -euo pipefail

DIR="/Users/Zhuanz/.openclaw/workspace/claudecode"
mkdir -p "$DIR"

echo "== Claude Code full setup =="

# 1) CLI check
if ! command -v /Users/Zhuanz/.openclaw/.npm-global/bin/claude >/dev/null 2>&1; then
echo "[ERR] claude CLI not found at /Users/Zhuanz/.openclaw/.npm-global/bin/claude"
exit 1
fi

# 2) ensure PATH in zshrc
if ! grep -q '/Users/Zhuanz/.openclaw/.npm-global/bin' "$HOME/.zshrc"; then
echo 'export PATH="/Users/Zhuanz/.openclaw/.npm-global/bin:$PATH"' >> "$HOME/.zshrc"
fi

# 3) write clean .env template
cat > "$DIR/.env" <<EOT
ANTHROPIC_API_KEY=
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_MODEL=claude-sonnet-4-20250514
EOT

# 4) prompt key securely
read -s -p "Paste NEW Anthropic API key (hidden): " KEY
echo
if [[ -z "${KEY}" ]]; then
echo "[ERR] key is empty"
exit 1
fi

# 5) write key
python3 - <<PY
from pathlib import Path
p=Path("$DIR/.env")
lines=p.read_text().splitlines()
out=[]
for l in lines:
if l.startswith("ANTHROPIC_API_KEY="):
out.append("ANTHROPIC_API_KEY=$KEY")
else:
out.append(l)
p.write_text("\\n".join(out)+"\\n")
print("wrote .env")
PY

# 6) validate
set -a
source "$DIR/.env"
set +a

CODE=$(curl https://api.anthropic.com/v1/messages \
-sS -o /tmp/anthropic_check.json -w '%{http_code}' \
-H "x-api-key: $ANTHROPIC_API_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{"model":"claude-sonnet-4-20250514","max_tokens":1,"messages":[{"role":"user","content":"ping"}]}')

echo "HTTP:$CODE"
if [[ "$CODE" != "200" ]]; then
echo "[ERR] key invalid or unavailable. response:"
head -c 300 /tmp/anthropic_check.json; echo
exit 2
fi

echo "[OK] API verified."
echo "Run:"
echo "cd $DIR && bash run-claude.sh"
