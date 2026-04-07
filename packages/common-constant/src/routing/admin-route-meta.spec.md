# Admin Route Meta 기획서

> 생성일: 2026-04-07
> 타입: route-meta
> 위치: packages/common-constant/src/routing/admin-route-meta.ts

## 역할

Admin route 폴더 옆 `route.meta.ts` 가 메뉴 카탈로그와 페이지 접근 카탈로그를 함께 선언할 수 있도록 공용 계약을 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AdminRoutePageMeta | 개별 페이지 접근 subject 선언 |
| AdminRouteNavParentMeta | child menu가 속한 parent menu 선언 |
| AdminRouteNavItemMeta | sidebar/bottom nav에 반영할 menu leaf 선언 |
| AdminRouteMeta | route sidecar가 export하는 최상위 계약 |
| GeneratedAdminPageAccessItem | 생성된 페이지 접근 카탈로그 계약 |
| GeneratedAdminRouteCatalog | 생성 스크립트 결과 계약 |

## 규칙

- `route.meta.ts` 는 런타임 import 없이 literal object + type-only import만 사용합니다.
- `page` 는 필수이며, 메뉴에 노출되는 라우트만 `navItem` 을 선택적으로 선언합니다.
- `page.order`, `navItem.order`, `navItem.parent.order` 는 generated catalog의 안정적인 정렬 기준으로 사용합니다.
- child menu는 `navItem.parent` 로 상위 그룹을 선언하고, detail/new/edit 같은 비노출 페이지는 `navItem` 없이 page access만 정의합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | 모든 admin route meta에 order 필드를 강제해 generated-only 정렬 기준으로 확장 | codex |
| 2026-04-07 | admin route sidecar와 generated catalog를 잇는 공용 meta 계약 신규 추가 | codex |
