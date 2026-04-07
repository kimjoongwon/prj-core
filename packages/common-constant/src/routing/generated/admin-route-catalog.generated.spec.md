# admin-route-catalog.generated 기획서

> 생성일: 2026-04-07
> 타입: generated-catalog
> 위치: packages/common-constant/src/routing/generated/admin-route-catalog.generated.ts

## 역할

`apps/admin/web` 의 `route.meta.ts` 들을 집계한 generated admin route catalog를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| GENERATED_ADMIN_ROUTE_META_SOURCES | 생성에 사용한 route meta 파일 목록 |
| GENERATED_ADMIN_NAV_ITEMS | route meta에서 파생된 admin nav item 목록 |
| GENERATED_ADMIN_PAGE_ACCESS_ITEMS | route meta에서 파생된 page access item 목록 |

## 규칙

- 이 파일은 `packages/common-constant/scripts/generate-admin-route-catalog.mjs` 가 갱신합니다.
- 모든 admin `page.tsx` 는 대응되는 `route.meta.ts` 를 통해 이 카탈로그에 포함되어야 합니다.
- generated nav/page catalog는 admin 메뉴/페이지 접근의 직접 source로 사용됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | 전체 admin route rollout 완료 후 generated nav/page catalog를 직접 SOT로 전환 | codex |
| 2026-04-07 | route meta generated catalog placeholder 파일 신규 추가 | codex |
