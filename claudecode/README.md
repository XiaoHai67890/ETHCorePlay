# Claude Code 本地即用配置

已完成：
- 安装 Claude Code CLI 到用户目录：`/Users/Zhuanz/.openclaw/.npm-global/bin/claude`
- PATH 已写入 `~/.zshrc`
- 提供一键启动脚本：`claudecode/run-claude.sh`

## 你只需要做一件事

```bash
cd /Users/Zhuanz/.openclaw/workspace/claudecode
cp .env.example .env
# 编辑 .env，填入你的 ANTHROPIC_API_KEY
```

## 启动

```bash
cd /Users/Zhuanz/.openclaw/workspace/claudecode
bash run-claude.sh
```

## 验证

```bash
/Users/Zhuanz/.openclaw/.npm-global/bin/claude --version
```
