# admin-permissions util 기획서

> 생성일: 2026-04-06
> 타입: util
> 위치: packages/be-prisma/src/reference-data/definitions/admin-permissions.ts

## 역할

`@cocrepo/constant` 의 admin permission catalog를 backend reference-data 형태로 파생하는 helper입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| adminMenuSubjectSeedData | 공용 menu catalog에서 파생한 subject seed |
| adminPageSubjectSeedData | 공용 page catalog에서 파생한 subject seed |
| adminFullAccessAbilitySeedData | FULL_ACCESS 기본 menu/page grant seed |
| adminManageMenuAccessAbilitySeedData | MANAGE 기본 운영 메뉴 access grant seed |
| legacyAdminMenuSubjectNames | 현재 frontend catalog에 없는 legacy admin menu prune 대상 |
| legacyAdminPageSubjectNames | 현재 frontend catalog에 없는 legacy admin page prune 대상 |

## 규칙

- menu subject는 `ADMIN_MENU_PERMISSION_GROUPS` 와 `ADMIN_MENU_PERMISSION_LEAFS` 를 합쳐 중복 없이 파생합니다.
- page subject는 `ADMIN_PAGE_ACCESS_ITEMS` 에서 직접 파생합니다.
- FULL_ACCESS 는 menu subject에는 `manage`, page subject에는 `access` action을 자동 부여합니다.
- MANAGE 는 현재 admin 운영 메뉴만 `access` 로 받고, 템플릿 및 low-level 권한 카탈로그 메뉴는 기본 제외합니다.
- legacy admin menu/page prune 대상은 과거 static admin subject 목록에서 현재 catalog를 뺀 결과만 포함하며 IDP subject는 포함하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | MANAGE 운영 메뉴 allowlist와 legacy admin prune 대상 export를 추가 | codex |
| 2026-04-06 | 공용 admin permission catalog 기반 backend 파생 helper를 신규 추가 | codex |
