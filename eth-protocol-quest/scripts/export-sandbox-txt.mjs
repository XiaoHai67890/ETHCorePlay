import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'sandbox-export.txt');

const EXCLUDED_PREFIXES = [
  '.git/',
  'node_modules/',
  'dist/',
  'coverage/'
];

const EXCLUDED_FILES = new Set([
  'sandbox-export.txt'
]);

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function isExcluded(filePath) {
  const normalized = normalizePath(filePath);
  if (EXCLUDED_FILES.has(normalized)) return true;
  return EXCLUDED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function isBinary(buffer) {
  if (buffer.includes(0)) return true;

  let suspicious = 0;
  const sample = buffer.subarray(0, Math.min(buffer.length, 8192));
  for (const byte of sample) {
    const isControl =
      byte < 7 ||
      (byte > 14 && byte < 32);
    if (isControl) suspicious += 1;
  }

  return sample.length > 0 && suspicious / sample.length > 0.1;
}

function listTrackedFiles() {
  const stdout = execFileSync('git', ['ls-files'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  return stdout
    .split(/\r?\n/)
    .map((line) => normalizePath(line.trim()))
    .filter(Boolean)
    .filter((filePath) => !isExcluded(filePath))
    .sort((a, b) => a.localeCompare(b, 'en'));
}

function exportFiles() {
  const files = listTrackedFiles();
  const entries = [];

  for (const relativePath of files) {
    const absolutePath = path.join(repoRoot, relativePath);
    const buffer = readFileSync(absolutePath);
    if (isBinary(buffer)) continue;

    entries.push({
      file: relativePath,
      code: buffer.toString('utf8')
    });
  }

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');

  return {
    outputPath,
    totalEntries: entries.length
  };
}

const result = exportFiles();
console.log(`Exported ${result.totalEntries} files to ${result.outputPath}`);
