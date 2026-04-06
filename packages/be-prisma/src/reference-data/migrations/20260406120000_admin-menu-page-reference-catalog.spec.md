# 20260406120000_admin-menu-page-reference-catalog util 기획서

> 생성일: 2026-04-06
> 타입: util
> 위치: packages/be-prisma/src/reference-data/migrations/20260406120000_admin-menu-page-reference-catalog.ts

## 역할

현재 frontend admin menu/page catalog를 DB reference-data에 반영하고, 현재 코드에 없는 legacy admin menu/page subject 및 연결 grant/ability를 soft delete 합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| adminMenuPageReferenceCatalogMigration | 현재 admin menu/page reference-data 동기화 및 legacy prune migration |

## 규칙

- 현재 admin menu/page subject는 migration에서도 upsert하여 이미 history가 있는 DB를 직접 보정합니다.
- canonical admin grant는 `FULL_ACCESS + manage menu:*` 와 `FULL_ACCESS + access page:*` 만 자동 보장합니다.
- legacy admin menu/page subject에 연결된 `roleGrant`, `userGrant`, `ability` 는 soft delete 후 subject를 soft delete 합니다.
- prune 대상은 `admin-permissions.ts` 의 legacy admin subject 목록만 사용하므로 IDP `menu:*` subject는 건드리지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | admin menu/page current catalog upsert 및 legacy admin permission prune migration 신규 추가 | codex |
