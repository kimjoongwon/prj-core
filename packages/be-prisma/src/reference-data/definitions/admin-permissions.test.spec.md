# admin-permissions.test test 기획서

> 생성일: 2026-04-06
> 타입: test
> 위치: packages/be-prisma/src/reference-data/definitions/admin-permissions.test.ts

## 역할

공용 admin permission catalog가 backend reference-data 파생 결과와 계속 동기화되는지 검증합니다.

## 검증 범위

- `ADMIN_MENU_PERMISSION_SUBJECTS` 의 모든 항목이 backend menu subject seed에 포함되는지 확인합니다.
- `ADMIN_PAGE_ACCESS_ITEMS` 의 모든 page subject가 backend page seed와 FULL_ACCESS page access grant에 포함되는지 확인합니다.
- 새 메뉴(`menu:assets`, `menu:assets:list`)가 추가되면 FULL_ACCESS grant도 자동으로 따라오는지 확인합니다.
- FULL_ACCESS가 `manage all` 을 유지해 새 권한이 생겨도 즉시 전체 권한으로 동작하는지 확인합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | FULL_ACCESS가 `manage all` 로 전역 권한을 유지하는 회귀 검증을 추가 | codex |
| 2026-04-06 | 공용 admin permission catalog와 backend 파생 seed의 동기화 회귀 테스트를 신규 추가 | codex |
