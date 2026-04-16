# Admin Permission Catalog 기획서

> 생성일: 2026-04-06
> 타입: permission-catalog
> 위치: packages/common-constant/src/routing/admin-permissions.ts

## 역할

Admin 앱에서 메뉴 노출, 페이지 접근, CRUD 편집기를 같은 코드 소유 catalog로 정렬하기 위한 공용 권한 카탈로그를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AdminPageAccessItem | 페이지 접근 편집 계약 (`scopeKind` 포함) |
| AdminCrudBundle | CRUD 묶음 편집 계약 |
| ADMIN_PAGE_ACCESS_ITEMS | Admin 페이지 접근 SOT |
| ADMIN_PAGE_ACCESS_SUBJECTS | page subject 유니크 목록 |
| ADMIN_CRUD_BUNDLES | CRUD bundle 기본 목록 |
| resolveAdminPageScopeKind | pageId를 `space` / `global-full-access-only`로 분류하는 유틸 |
| matchAdminPageAccessItem | 현재 pathname에 대응하는 page access item 탐색 유틸 |
| ADMIN_MENU_PERMISSION_GROUPS | 메뉴 편집 그룹 요약 유틸 |

## 규칙

- 메뉴 노출(`menu:*`)과 URL 직접 접근(`page:*`)은 분리된 권한으로 관리합니다.
- `ADMIN_PAGE_ACCESS_ITEMS` 는 운영자가 역할 상세에서 "화면 접근"을 직관적으로 편집할 수 있도록 라벨과 경로를 함께 제공합니다.
- `ADMIN_PAGE_ACCESS_ITEMS` 는 각 admin route 폴더의 `route.meta.ts` generated catalog를 직접 사용합니다.
- `templates`, `abilities`, `actions`, `subjects` 계열 page는 `global-full-access-only`, 나머지 운영 화면은 `space` scope로 기본 분류합니다.
- `matchAdminPageAccessItem()` 은 dynamic route 패턴(`[roleId]`, `[timelineId]`)을 현재 pathname과 비교해 page subject를 찾습니다.
- `ADMIN_CRUD_BUNDLES` 는 backend entity CRUD ability를 운영자용 묶음으로 편집하기 위한 정렬/라벨 기준입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | admin page access catalog에 `scopeKind`와 `resolveAdminPageScopeKind()` 분류 규칙을 추가 | codex |
| 2026-04-07 | 전체 admin route meta rollout 이후 `ADMIN_PAGE_ACCESS_ITEMS` 를 generated-only SOT로 전환 | codex |
| 2026-04-07 | `route.meta.ts` generated page access catalog merge 규칙을 추가 | codex |
| 2026-04-06 | 메뉴/페이지/CRUD를 공용 SOT로 묶는 admin permission catalog를 신규 추가 | codex |
