#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DATE = new Date().toISOString().slice(0, 10);
const VALID_SCOPES = new Set(['all', 'src']);
const TARGET_EXT = '.tsx';
const SKIP_DIR_SEGMENT_RE =
  /(^|\/)(node_modules|dist|dist-web|coverage|\.next|\.turbo|build|out|\.vercel|\.idea|storybook-static|browsers)(\/|$)/;

function shouldSkipDirectory(relPath) {
  return (
    SKIP_DIR_SEGMENT_RE.test(relPath) ||
    relPath.startsWith('.git/') ||
    relPath.startsWith('.codex/') ||
    relPath.startsWith('.claude/') ||
    relPath.startsWith('.opencode/')
  );
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(rel)) continue;
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
    dryRun: argv.includes('--dry-run'),
    scope,
  };
}

function isInScope(relPath, scope) {
  if (scope === 'src') {
    return (
      (relPath.startsWith('apps/') || relPath.startsWith('packages/')) &&
      relPath.includes('/src/')
    );
  }
  return relPath.startsWith('apps/') || relPath.startsWith('packages/');
}

function isNextRoutePage(relPath) {
  return /^apps\/[^/]+\/web\/src\/app\/(?:.*\/)?page\.tsx$/.test(relPath);
}

function isFeUiPageComponent(relPath) {
  if (!relPath.startsWith('packages/fe-ui/src/page/')) return false;
  if (!relPath.endsWith(TARGET_EXT)) return false;
  if (relPath.endsWith('.stories.tsx') || relPath.endsWith('.test.tsx')) return false;

  const parts = relPath.split('/');
  const fileName = parts.at(-1);
  const folderName = parts.at(-2);
  return fileName === `${folderName}.tsx`;
}

function isFeUiFeatureComponent(relPath) {
  if (!relPath.startsWith('packages/fe-ui/src/feature/')) return false;
  if (!relPath.endsWith(TARGET_EXT)) return false;
  if (relPath.endsWith('.stories.tsx') || relPath.endsWith('.test.tsx')) return false;
  return true;
}

function isSpecTarget(relPath, options) {
  if (!isInScope(relPath, options.scope)) return false;
  return isNextRoutePage(relPath) || isFeUiPageComponent(relPath) || isFeUiFeatureComponent(relPath);
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

function titleFromFile(relPath) {
  return path.basename(relPath, path.extname(relPath));
}

function routeFromPath(relPath) {
  const marker = '/src/app';
  const [, rest = ''] = relPath.split(marker);
  const route = rest
    .replace(/\/page\.tsx$/, '')
    .replace(/\/\([^)]*\)/g, '')
    .replace(/\/@[^/]+/g, '');
  return route.length > 0 ? route : '/';
}

function renderRows(items, emptyLabel, purpose) {
  if (items.length === 0) return `| ${emptyLabel} | 추후 구현 시 확정 |`;
  return items.map((item) => `| ${item} | ${purpose} |`).join('\n');
}

function renderRoutePageSpec(relPath, meta) {
  const route = routeFromPath(relPath);
  return `# ${route} route page 기획서

> 생성일: ${DATE}
> 타입: next-route-page
> 경로: ${route}
> 위치: ${relPath}

## 화면 목적

이 route page는 Next.js App Router의 thin container입니다.
데이터 조회, route/search params 해석, 라우팅 이벤트를 소유하고 시각 구성은 fe-ui Page component에 위임합니다.

## Route / Page Mapping

| 항목 | 값 |
|------|----|
| route path | \`${route}\` |
| route page | \`${relPath}\` |
| pure page component | TODO: \`packages/fe-ui/src/page/[PageName]/[PageName].tsx\` |
| page role | TODO: \`collection | detail | form\` |
| reusable target | TODO: \`data-grid | collection/list | collection/grid | detail/view | form\` |
| SSR/prefetch 예외 | 없음 |

## 데이터 / API

| 항목 | 설명 |
|------|------|
${renderRows(meta.imports.filter((item) => item.startsWith('@cocrepo/api')), 'Orval hook', 'route page에서 호출 후 pure page props로 전달')}

## 상태와 이벤트

| 항목 | 설명 |
|------|------|
| route/search params | route page가 해석하고 pure page에는 필요한 값만 전달 |
| loading/error/empty | API 결과를 pure page props로 전달 |
| 이벤트 핸들러 | \`on[Event][UI]\` 이름으로 선언 |

## 테스트 관점

- 핵심 CTA가 의도한 route로 이동하는지 확인합니다.
- 목록/상세/폼의 loading, empty, error 상태가 pure page에 전달되는지 확인합니다.
- mutation 성공 후 invalidate/refetch/redirect 동작을 확인합니다.

## 구현 체크리스트

- [ ] route page는 thin container 역할만 담당
- [ ] pure page component path 확정
- [ ] page role / reusable target 확정
- [ ] 신규 \`layout.spec.md\`, story/test/e2e spec을 만들지 않음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| ${DATE} | 허용 대상 route page spec 신규 생성 | codex |
`;
}

function renderFeUiPageSpec(relPath, meta) {
  const name = titleFromFile(relPath);
  return `# ${name} Page 기획서

> 생성일: ${DATE}
> 타입: fe-ui-page
> 위치: ${relPath}

## 역할

${name}는 page-level visual composition을 담당하는 pure Page component입니다.
API 호출, 라우팅, search params 해석은 route page가 소유하고 이 컴포넌트는 props로 전달받은 값과 이벤트만 사용합니다.

## Props / 공개 계약

| 항목 | 설명 |
|------|------|
${renderRows(meta.exports, 'export', 'Page component 공개 계약')}

## 하위 조합

| 모듈 | 용도 |
|------|------|
${renderRows(meta.imports, '하위 컴포넌트', 'Page composition 의존성')}

## 상태별 렌더링

| 상태 | 표시/동작 |
|------|-----------|
| loading | props 기반 loading UI |
| error | props 기반 error UI |
| empty | props 기반 empty UI |
| disabled/readOnly | props 기반 제어 |

## 테스트 관점

- props 조합에 따라 주요 영역이 안정적으로 렌더링되는지 확인합니다.
- 이벤트 props가 올바른 UI 상호작용에서 호출되는지 확인합니다.
- Page 내부에서 API/router/store를 직접 읽지 않는지 확인합니다.

## 구현 체크리스트

- [ ] named export 사용
- [ ] API/router/store 직접 접근 없음
- [ ] route-level Surface ownership 침범 없음
- [ ] story spec을 새로 만들지 않음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| ${DATE} | 허용 대상 fe-ui Page spec 신규 생성 | codex |
`;
}

function renderFeatureSpec(relPath, meta) {
  const name = titleFromFile(relPath);
  return `# ${name} Feature 기획서

> 생성일: ${DATE}
> 타입: feature
> 위치: ${relPath}

## 역할

${name}는 Store/API/router 등 런타임 책임을 Widget/UI에 연결하는 Feature component입니다.
순수 시각 조합만 필요하면 Feature가 아니라 Widget/Page 쪽으로 책임을 옮깁니다.

## Props / 공개 계약

| 항목 | 설명 |
|------|------|
${renderRows(meta.exports, 'export', 'Feature 공개 계약')}

## Store / API / Router 연결

| 모듈 | 용도 |
|------|------|
${renderRows(meta.imports, '의존성', 'Feature 런타임/하위 UI 의존성')}

## 상태와 이벤트

| 항목 | 설명 |
|------|------|
| loading/error | API 또는 Store 상태를 사용자 UI로 변환 |
| mutation/refetch | 성공/실패 후 상태 갱신 책임 명시 |
| 이벤트 | Widget/UI 이벤트를 Store/API/router 동작으로 연결 |

## 테스트 관점

- Store/API/router 연결이 의도한 호출로 이어지는지 확인합니다.
- loading/error/empty/permission 상태를 확인합니다.
- 하위 Widget/UI에는 props로만 값과 이벤트를 주입하는지 확인합니다.

## 구현 체크리스트

- [ ] Feature component source와 같은 이름의 spec 사용
- [ ] barrel \`index.ts\`, type, hook, story에는 별도 spec을 만들지 않음
- [ ] observer 적용 여부 확인
- [ ] 직접 axios/fetch 대신 Orval hook 사용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| ${DATE} | 허용 대상 Feature spec 신규 생성 | codex |
`;
}

function renderSpec(relPath, code) {
  const meta = extractMeta(code);
  if (isNextRoutePage(relPath)) return renderRoutePageSpec(relPath, meta);
  if (isFeUiPageComponent(relPath)) return renderFeUiPageSpec(relPath, meta);
  return renderFeatureSpec(relPath, meta);
}

function ensureDirFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const allFiles = walk(ROOT);
  const codeFiles = allFiles.filter((relPath) => isSpecTarget(relPath, options)).sort();

  const targets = codeFiles.filter((code) => {
    const spec = sidecarPath(code);
    return !fs.existsSync(path.join(ROOT, spec));
  });

  console.log('POLICY=route-page,fe-ui-page,fe-ui-feature');
  console.log(`TOTAL_SPEC_TARGET_FILES=${codeFiles.length}`);
  console.log(`MISSING_BEFORE=${targets.length}`);

  let written = 0;
  for (const code of targets) {
    const specRel = sidecarPath(code);
    const specAbs = path.join(ROOT, specRel);

    if (options.dryRun) {
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
