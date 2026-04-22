#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REQUIRED_CODE_EXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.sh',
]);
const SOURCE_TARGET_EXT = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts', '.sh'];
const VALID_SCOPES = new Set(['all', 'src']);
const SKIP_DIR_SEGMENT_RE =
  /(^|\/)(node_modules|dist|dist-web|coverage|\.next|\.turbo|build|out|\.vercel|\.idea|storybook-static|browsers)(\/|$)/;
const declaredTargetCache = new Map();

function shouldSkipDirectory(relPath) {
  return (
    SKIP_DIR_SEGMENT_RE.test(relPath) ||
    relPath.startsWith('.git/')
  );
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(rel)) {
        continue;
      }
      walk(abs, out);
      continue;
    }

    out.push(rel);
  }
  return out;
}

function parseArgs(argv) {
  const scopeArg = argv.find((arg) => arg.startsWith('--scope='));
  const scope = scopeArg ? scopeArg.split('=')[1] : 'all';
  if (!VALID_SCOPES.has(scope)) {
    console.error(`Invalid --scope value: ${scope}. Allowed: all, src`);
    process.exit(1);
  }

  return {
    scope,
    list: argv.includes('--list'),
    failOnMissing: argv.includes('--fail-on-missing'),
    failOnOrphan: argv.includes('--fail-on-orphan'),
    failOnDrift: argv.includes('--fail-on-drift'),
    includeGeneratedFeApi: argv.includes('--include-generated-fe-api'),
  };
}

function isTargetRoot(relPath, scope) {
  if (scope === 'src') {
    return (
      (relPath.startsWith('apps/') || relPath.startsWith('packages/')) &&
      relPath.includes('/src/')
    );
  }
  return (
    relPath.startsWith('apps/') ||
    relPath.startsWith('packages/') ||
    relPath.startsWith('scripts/')
  );
}

function isCodeTarget(relPath, options) {
  if (!isTargetRoot(relPath, options.scope)) return false;
  if (!options.includeGeneratedFeApi && relPath.startsWith('packages/fe-api/src/'))
    return false;
  if (relPath.startsWith('packages/be-prisma/')) return false;

  const ext = path.extname(relPath);
  if (!REQUIRED_CODE_EXT.has(ext)) return false;

  if (relPath.endsWith('.d.ts')) return false;
  if (isExcludedConfigSource(relPath)) return false;
  if (/\.spec\.[tj]sx?$/.test(relPath)) return false;
  if (/\.test\.[tj]sx?$/.test(relPath)) return false;

  return true;
}

function sidecarPath(codePath) {
  return codePath.replace(/\.[^.]+$/, '.spec.md');
}

function toTopGroup(relPath) {
  const seg = relPath.split('/');
  return seg.slice(0, 3).join('/');
}

function collectSpecFiles(allFiles) {
  return allFiles
    .filter((relPath) => relPath.endsWith('.spec.md'))
    .sort();
}

function isExcludedConfigSource(relPath) {
  return (
    /(^|\/)[^/]+\.config\.[cm]?[jt]sx?$/.test(relPath)
  );
}

function parseDeclaredTargets(specPath) {
  if (declaredTargetCache.has(specPath)) {
    return declaredTargetCache.get(specPath);
  }

  let text = '';
  try {
    text = fs.readFileSync(path.join(ROOT, specPath), 'utf8');
  } catch {
    declaredTargetCache.set(specPath, []);
    return [];
  }

  const targets = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('> 위치: ')) continue;
    const target = line
      .slice('> 위치: '.length)
      .trim()
      .replace(/^`+/, '')
      .replace(/`+$/, '');
    if (target.length > 0) {
      targets.push(target);
    }
  }

  declaredTargetCache.set(specPath, targets);
  return targets;
}

function existsSourceTarget(relPath, allFileSet) {
  if (!allFileSet.has(relPath) && !fs.existsSync(path.join(ROOT, relPath))) return false;
  if (relPath.startsWith('packages/be-prisma/')) return false;

  const ext = path.extname(relPath);
  if (!REQUIRED_CODE_EXT.has(ext)) return false;
  if (relPath.endsWith('.d.ts')) return false;
  if (isExcludedConfigSource(relPath)) return false;

  return true;
}

function hasCodeForSpec(specPath, allFileSet) {
  const declaredTargets = parseDeclaredTargets(specPath);
  if (declaredTargets.length > 0) {
    const hasOnlySourceTargets = declaredTargets.every((target) =>
      existsSourceTarget(target, allFileSet)
    );
    if (hasOnlySourceTargets) {
      return true;
    }
  }

  const base = specPath.slice(0, -'.spec.md'.length);
  if (existsSourceTarget(base, allFileSet)) return true;

  for (const ext of SOURCE_TARGET_EXT) {
    if (existsSourceTarget(`${base}${ext}`, allFileSet)) return true;
  }

  if (allFileSet.has(`${base}.enum.ts`) || allFileSet.has(`${base}.enum.js`)) {
    return true;
  }

  return false;
}

function groupCounts(list) {
  const byGroup = new Map();
  for (const item of list) {
    const key = toTopGroup(item);
    byGroup.set(key, (byGroup.get(key) || 0) + 1);
  }
  return [...byGroup.entries()].sort((a, b) => b[1] - a[1]);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const allFiles = walk(ROOT);
  const allFileSet = new Set(allFiles);
  const codeFiles = allFiles.filter((relPath) => isCodeTarget(relPath, options)).sort();
  const specFiles = collectSpecFiles(allFiles);

  const missing = [];
  for (const code of codeFiles) {
    const spec = sidecarPath(code);
    if (!allFileSet.has(spec)) {
      missing.push(code);
    }
  }

  const orphan = [];
  for (const spec of specFiles) {
    if (!hasCodeForSpec(spec, allFileSet)) {
      orphan.push(spec);
    }
  }

  const missingGroups = groupCounts(missing);
  const orphanGroups = groupCounts(orphan);

  const missingReportPath = '/tmp/prj-core-missing-spec.txt';
  const orphanReportPath = '/tmp/prj-core-orphan-spec.txt';
  fs.writeFileSync(missingReportPath, missing.length > 0 ? `${missing.join('\n')}\n` : '', 'utf8');
  fs.writeFileSync(orphanReportPath, orphan.length > 0 ? `${orphan.join('\n')}\n` : '', 'utf8');

  console.log(`SCOPE=${options.scope}`);
  console.log(`INCLUDE_GENERATED_FE_API=${options.includeGeneratedFeApi}`);
  console.log(`TOTAL_CODE_FILES=${codeFiles.length}`);
  console.log(`MISSING_SPEC=${missing.length}`);
  console.log(`ORPHAN_SPEC=${orphan.length}`);
  console.log(`REPORT=${missingReportPath}`);
  console.log(`REPORT_MISSING=${missingReportPath}`);
  console.log(`REPORT_ORPHAN=${orphanReportPath}`);
  console.log('---TOP_GROUPS---');
  for (const [group, count] of missingGroups) {
    console.log(`${count}\t${group}`);
  }
  console.log('---TOP_ORPHAN_GROUPS---');
  for (const [group, count] of orphanGroups) {
    console.log(`${count}\t${group}`);
  }

  if (options.list) {
    console.log('---MISSING_LIST_START---');
    for (const line of missing) console.log(line);
    console.log('---MISSING_LIST_END---');
    console.log('---ORPHAN_LIST_START---');
    for (const line of orphan) console.log(line);
    console.log('---ORPHAN_LIST_END---');
  }

  const shouldFail =
    (options.failOnMissing && missing.length > 0) ||
    (options.failOnOrphan && orphan.length > 0) ||
    (options.failOnDrift && (missing.length > 0 || orphan.length > 0));
  if (shouldFail) {
    process.exitCode = 1;
  }
}

main();
