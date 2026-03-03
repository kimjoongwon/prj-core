#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (
        rel.includes('/node_modules/') ||
        rel.includes('/dist/') ||
        rel.includes('/coverage/') ||
        rel.includes('/.next/') ||
        rel.includes('/.turbo/') ||
        rel.includes('/build/') ||
        rel.includes('/out/') ||
        rel.startsWith('.git/') ||
        rel.startsWith('.codex/') ||
        rel.startsWith('.claude/') ||
        rel.startsWith('apps/tool/storybook/') ||
        rel.startsWith('apps/test/e2e/') ||
        rel.startsWith('apps/proposal/')
      ) {
        continue;
      }
      walk(abs, out);
      continue;
    }

    out.push(rel);
  }
  return out;
}

function isCodeTarget(relPath) {
  if (!relPath.startsWith('apps/') && !relPath.startsWith('packages/')) return false;
  if (!relPath.includes('/src/')) return false;
  if (relPath.startsWith('packages/fe-api/src/')) return false;

  const ext = path.extname(relPath);
  if (!CODE_EXT.has(ext)) return false;

  if (relPath.endsWith('.d.ts')) return false;
  if (/\.spec\.[tj]sx?$/.test(relPath)) return false;
  if (/\.test\.[tj]sx?$/.test(relPath)) return false;
  if (/\.stories\.[tj]sx?$/.test(relPath)) return false;
  if (/page\.e2e\.ts$/.test(relPath)) return false;

  return true;
}

function sidecarPath(codePath) {
  return codePath.replace(/\.[^.]+$/, '.spec.md');
}

function toTopGroup(relPath) {
  const seg = relPath.split('/');
  return seg.slice(0, 3).join('/');
}

function main() {
  const allFiles = walk(ROOT);
  const codeFiles = allFiles.filter(isCodeTarget).sort();

  const missing = [];
  for (const code of codeFiles) {
    const spec = sidecarPath(code);
    if (!fs.existsSync(path.join(ROOT, spec))) {
      missing.push(code);
    }
  }

  const byGroup = new Map();
  for (const m of missing) {
    const key = toTopGroup(m);
    byGroup.set(key, (byGroup.get(key) || 0) + 1);
  }

  const sortedGroups = [...byGroup.entries()].sort((a, b) => b[1] - a[1]);

  const reportPath = '/tmp/prj-core-missing-spec-src.txt';
  fs.writeFileSync(reportPath, `${missing.join('\n')}\n`, 'utf8');

  console.log(`TOTAL_CODE_FILES=${codeFiles.length}`);
  console.log(`MISSING_SPEC=${missing.length}`);
  console.log(`REPORT=${reportPath}`);
  console.log('---TOP_GROUPS---');
  for (const [group, count] of sortedGroups) {
    console.log(`${count}\t${group}`);
  }

  if (process.argv.includes('--list')) {
    console.log('---MISSING_LIST_START---');
    for (const line of missing) console.log(line);
    console.log('---MISSING_LIST_END---');
  }

  if (process.argv.includes('--fail-on-missing') && missing.length > 0) {
    process.exit(1);
  }
}

main();
