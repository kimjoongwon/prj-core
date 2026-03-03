#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);
const DATE = new Date().toISOString().slice(0, 10);

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

function readCode(relPath) {
  try {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  } catch {
    return '';
  }
}

function unique(arr) {
  return [...new Set(arr)];
}

function detectKind(relPath) {
  const p = relPath;
  const base = path.basename(p);

  if (/\/(page)\.[tj]sx?$/.test(p)) return 'page';
  if (/\/_client\.[tj]sx?$/.test(p)) return 'client';
  if (/\/_prefetch\.[tj]sx?$/.test(p)) return 'prefetch';
  if (/\/(layout)\.[tj]sx?$/.test(p)) return 'layout';
  if (/\/hooks\//.test(p)) return 'hook';

  if (/\.controller\.[tj]s$/.test(p) || /\/controllers\//.test(p)) return 'controller';
  if (/\.service\.[tj]s$/.test(p) || /\/services\//.test(p)) return 'service';
  if (/\.repository\.[tj]s$/.test(p) || /\/repositories\//.test(p)) return 'repository';
  if (/\.entity\.[tj]s$/.test(p)) return 'entity';
  if (/\.vo\.[tj]s$/.test(p)) return 'vo';
  if (/\.dto\.[tj]s$/.test(p) || p.startsWith('packages/be-dto/src/')) return 'dto';

  if (/\/stores\//.test(p)) return 'store';
  if (/\/components\/feature\//.test(p)) return 'feature';
  if (/\/components\/widget\//.test(p) || /\/components\/widgets\//.test(p)) return 'widget';
  if (/\/components\/ui\//.test(p) || /\/components\/inputs\//.test(p)) return 'ui';
  if (/\/index\.[tj]sx?$/.test(p)) return 'index';

  if (/\.module\.[tj]s$/.test(p)) return 'module';
  if (/config\//.test(p) || /\/utils?\//.test(p) || /\/lib\//.test(p)) return 'util';

  if (base.endsWith('.tsx')) return 'ui';
  return 'util';
}

function detectTier(kind) {
  if (['page', 'client', 'layout', 'controller', 'service', 'repository', 'entity', 'vo', 'feature', 'widget'].includes(kind)) return 'A';
  if (['hook', 'prefetch', 'store', 'dto', 'module'].includes(kind)) return 'B';
  return 'C';
}

function extractMeta(code) {
  const exportNames = [];
  const importSources = [];

  const exportRe = /\bexport\s+(?:interface|type|class|const|function|enum)\s+([A-Za-z0-9_]+)/g;
  let m;
  while ((m = exportRe.exec(code)) !== null) exportNames.push(m[1]);

  if (/\bexport\s+default\b/.test(code)) exportNames.push('default export');

  const importRe = /from\s+["']([^"']+)["']/g;
  while ((m = importRe.exec(code)) !== null) importSources.push(m[1]);

  return {
    exports: unique(exportNames).slice(0, 12),
    imports: unique(importSources).slice(0, 12),
  };
}

function titleFromPath(relPath, kind) {
  const base = path.basename(relPath, path.extname(relPath));
  if (kind === 'index') return 'index 배럴 기획서';
  return `${base} ${kind} 기획서`;
}

function typeLabel(kind) {
  if (kind === 'client') return 'page-client';
  if (kind === 'prefetch') return 'page-prefetch';
  return kind;
}

function renderSectionRows(meta) {
  if (meta.exports.length === 0) return '| export | 없음 |';
  return meta.exports.map((name) => `| ${name} | 공개 계약 요소 |`).join('\n');
}

function renderImportRows(meta) {
  if (meta.imports.length === 0) return '| 내부 모듈 | 의존성 없음 |';
  return meta.imports.map((source) => `| ${source} | 기능 구현 의존성 |`).join('\n');
}

function renderTierA(relPath, kind, meta) {
  const t = titleFromPath(relPath, kind);
  return `# ${t}

> 생성일: ${DATE}
> 타입: ${typeLabel(kind)}
> 위치: ${relPath}

## 역할

이 파일은 ${kind} 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
${renderSectionRows(meta)}

## 의존성

| 모듈 | 용도 |
|------|------|
${renderImportRows(meta)}

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| ${DATE} | 누락된 sidecar spec 신규 생성 | codex |
`;
}

function renderTierB(relPath, kind, meta) {
  const t = titleFromPath(relPath, kind);
  return `# ${t}

> 생성일: ${DATE}
> 타입: ${typeLabel(kind)}
> 위치: ${relPath}

## 역할

이 파일은 ${kind} 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
${renderSectionRows(meta)}

## 의존성

| 모듈 | 용도 |
|------|------|
${renderImportRows(meta)}

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| ${DATE} | 누락된 sidecar spec 신규 생성 | codex |
`;
}

function renderTierC(relPath, kind, meta) {
  const t = titleFromPath(relPath, kind);
  return `# ${t}

> 생성일: ${DATE}
> 타입: ${typeLabel(kind)}
> 위치: ${relPath}

## 역할

이 파일은 ${kind} 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
${renderSectionRows(meta)}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| ${DATE} | 누락된 sidecar spec 신규 생성 | codex |
`;
}

function renderSpec(relPath, code) {
  const kind = detectKind(relPath);
  const tier = detectTier(kind);
  const meta = extractMeta(code);

  if (tier === 'A') return renderTierA(relPath, kind, meta);
  if (tier === 'B') return renderTierB(relPath, kind, meta);
  return renderTierC(relPath, kind, meta);
}

function ensureDirFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const allFiles = walk(ROOT);
  const codeFiles = allFiles.filter(isCodeTarget).sort();

  const targets = codeFiles.filter((code) => {
    const spec = sidecarPath(code);
    return !fs.existsSync(path.join(ROOT, spec));
  });

  console.log(`TOTAL_CODE_FILES=${codeFiles.length}`);
  console.log(`MISSING_BEFORE=${targets.length}`);

  let written = 0;
  for (const code of targets) {
    const specRel = sidecarPath(code);
    const specAbs = path.join(ROOT, specRel);

    if (dryRun) {
      console.log(`[DRY] ${specRel}`);
      continue;
    }

    const codeText = readCode(code);
    const content = renderSpec(code, codeText);

    ensureDirFor(specAbs);
    fs.writeFileSync(specAbs, content, 'utf8');
    written += 1;
  }

  console.log(`SPEC_WRITTEN=${written}`);
}

main();
