# admin login helper 기획서

> 생성일: 2026-03-04
> 타입: util
> 위치: apps/test/e2e/tests/admin/helpers/login.ts

## 역할

Admin E2E에서 재사용하는 로그인 래퍼입니다.

- 공통 OIDC 로그인 플로우를 호출합니다.
- Admin 앱 전용 후처리(localStorage의 `admin-persist` Space 보정)를 수행합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `loginToAdmin(page)` | Admin 로그인 + Space 보정 + 네트워크 안정화 대기 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-04 | 공통 OIDC 헬퍼 연동 구조로 리팩터링 및 sidecar spec 생성 | codex |
| 2026-03-04 | 공통 OIDC 헬퍼 import를 `@cocrepo/ui/e2e`로 전환 | codex |
