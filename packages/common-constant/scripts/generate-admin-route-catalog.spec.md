# generate-admin-route-catalog 스크립트 기획서

> 생성일: 2026-04-07
> 타입: build-script
> 위치: packages/common-constant/scripts/generate-admin-route-catalog.mjs

## 역할

Admin 앱 라우트 옆 `route.meta.ts` 를 읽어 generated admin nav/page catalog를 생성합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| collectRouteMetaFiles | `(admin)` 라우트 하위의 `route.meta.ts` 파일 탐색 |
| collectPageFiles | `(admin)` 라우트 하위의 `page.tsx` 파일 탐색 |
| loadRouteMeta | TypeScript source를 transpile 후 named export `routeMeta` 로드 |
| validateRouteMetaCoverage | `page.tsx` 와 `route.meta.ts` 짝 누락/고아 여부 검증 |
| buildRouteCatalog | page access item / nav item 집계와 중복 검증 |
| toTypeScriptModule | generated TS source 직렬화 |
| generateAdminRouteCatalog | route meta 집계부터 generated 파일 쓰기까지 수행하는 재사용 가능한 엔트리 |

## 규칙

- `route.meta.ts` 는 literal object와 type-only import만 허용합니다.
- 모든 admin `page.tsx` 는 같은 폴더의 `route.meta.ts` 를 가져야 하며, 누락/고아 sidecar는 즉시 실패합니다.
- duplicate `pageId`, duplicate order, duplicate nav id, parent metadata 충돌은 즉시 실패합니다.
- generated 결과는 admin nav/page catalog의 직접 source로 사용됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | admin page-route coverage 검증과 generated-only 정렬 규칙을 추가 | codex |
| 2026-04-07 | `start-dev.mjs` 에서 재사용할 수 있도록 generator 함수를 export 하도록 갱신 | codex |
| 2026-04-07 | admin route meta를 generated catalog로 변환하는 빌드 스크립트 신규 추가 | codex |
