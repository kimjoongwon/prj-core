# overviewManifestSources.js Spec

## 목적
- Storybook overview manifest가 필요로 하는 raw source map을 Node 환경에서 미리 수집합니다.
- 동일한 source map을 Storybook preview/dev build와 Vitest가 함께 재사용하도록 합니다.

## 핵심 동작
- `packages/fe-ui/src/page` 아래에서 pure page story(`*.stories.tsx`)와 pure page spec(`*.spec.md`)만 골라 읽습니다.
- `apps/admin/web/src/app`, `apps/idp/web/src/app` 아래에서는 route page(`page.tsx`)와 route spec(`page.spec.md`)만 재귀 수집합니다.
- source key는 `apps/tool/storybook/src/overview` 기준 상대 경로로 정규화해 기존 manifest parser가 기대하는 path 패턴을 유지합니다.
- 반환 값은 `storySources`, `purePageSpecSources`, `adminRouteSources`, `adminRouteSpecSources`, `idpRouteSources`, `idpRouteSpecSources` 여섯 개 record입니다.
- `serializeOverviewManifestSourceMaps()`는 위 record를 Vite `define` 주입용 JSON expression으로 직렬화합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `createOverviewManifestSourceMaps()` | repo 파일 시스템에서 overview manifest용 raw source map을 생성합니다. |
| `serializeOverviewManifestSourceMaps()` | source map을 Vite `define`에서 바로 쓸 수 있는 JSON 문자열로 직렬화합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | `import.meta.glob` 없이 overview manifest 소스를 Node fs로 수집해 Storybook/Vitest define으로 주입하는 helper를 추가 | codex |
