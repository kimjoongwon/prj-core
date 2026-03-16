# admin-auth.setup 기획서

> 생성일: 2026-03-14
> 타입: e2e-helper
> 위치: apps/test/e2e/tests/admin/helpers/admin-auth.setup.ts

## 역할

Admin Playwright 프로젝트의 공통 OIDC 로그인 setup을 수행하고, 후속 테스트가 재사용할 storage state를 helper 디렉토리의 `.auth/admin.json`에 저장합니다.

## 계약

- `loginToAdmin(page)`로 admin OIDC 로그인 플로우를 완료한다.
- 로그인 직후 `prewarmAdminRoutes(page)`로 주요 admin route를 사전 컴파일한다.
- storage state 출력 경로는 현재 파일 기준 `.auth/admin.json` 절대 경로를 사용한다.
- 출력 경로는 `playwright.config.ts`의 admin 프로젝트 `storageState` 경로와 일치해야 한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | storageState 저장 전에 admin route prewarm 단계를 추가해 첫 테스트의 compile race를 완화 | codex |
| 2026-03-14 | 초기 생성 및 storage state 경로를 helper 기준 절대 경로로 고정 | codex |
