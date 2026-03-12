import fs from 'node:fs';
import path from 'node:path';

const tokensPath = path.resolve('src/styles/tokens.json');
const outPath = path.resolve('src/styles/tokens.generated.css');
const t = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

const light = `:root[data-theme="light"]{\n  --bg-canvas:#F7F8FB; --bg-surface:#FFFFFF; --bg-elevated:#FFFFFF;\n  --text-primary:#0B0D12; --text-secondary:#424A5C; --text-muted:#5B6477;\n  --border-subtle:#E2E7F1; --border-default:#CBD3E3; --border-focus:#627EEA;\n  --brand-primary:#627EEA; --brand-garden:#2FA879; --brand-accent:#2BA6B5; --brand-highlight:#D7A93B;\n  --radius-1:6px; --radius-2:10px; --radius-3:14px; --radius-4:18px; --radius-pill:999px;\n  --shadow-sm:0 1px 2px rgba(0,0,0,0.06),0 1px 1px rgba(0,0,0,0.04);\n  --shadow-md:0 8px 24px rgba(0,0,0,0.10),0 2px 6px rgba(0,0,0,0.06);\n  --motion-base:200ms; --ease-standard:cubic-bezier(0.2,0,0,1);\n}`;
const dark = `:root[data-theme="dark"]{\n  --bg-canvas:#0F1220; --bg-surface:#151826; --bg-elevated:#1C2031;\n  --text-primary:#F3F5FF; --text-secondary:#C6CBE0; --text-muted:#9AA2C0;\n  --border-subtle:rgba(255,255,255,0.08); --border-default:rgba(255,255,255,0.14); --border-focus:#627EEA;\n  --brand-primary:#627EEA; --brand-garden:#3BCB93; --brand-accent:#3CC4D6; --brand-highlight:#F0C252;\n  --shadow-sm:0 1px 2px rgba(0,0,0,0.40),0 1px 1px rgba(0,0,0,0.24);\n  --shadow-md:0 10px 28px rgba(0,0,0,0.52),0 4px 10px rgba(0,0,0,0.32);\n}`;

const header = `/* auto-generated from tokens.json (${t.meta?.name || 'tokens'}) */\n`;
fs.writeFileSync(outPath, `${header}${light}\n${dark}\n`);
console.log('generated', outPath);
