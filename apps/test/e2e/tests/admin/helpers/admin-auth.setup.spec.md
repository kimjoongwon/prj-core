# admin-auth.setup 기획서

> 생성일: 2026-03-14
> 타입: e2e-helper
> 위치: apps/test/e2e/tests/admin/helpers/admin-auth.setup.ts

## 역할

Admin Playwright 프로젝트의 공통 OIDC 로그인 setup을 수행하고, 후속 테스트가 재사용할 storage state를 helper 디렉토리의 `.auth/admin.json`에 저장합니다.

## 계약

- `loginToAdmin(page)`로 admin OIDC 로그인 플로우를 완료한다.
- 로그인 직후 `prewarmAdminRoutes(page)`로 주요 admin route를 사전 컴파일한다.
- storage state 출력 경로는 현재 파일 기준 `.auth/{E2E_ENV}/admin.json` 절대 경로를 사용한다.
- setup test timeout은 prewarm 비용을 고려해 120초로 설정한다.
- prewarm 이후 열려 있는 SSE/stream 연결로 storageState가 지연되지 않도록 `about:blank`로 이동한 뒤 Context에서 storage state를 덤프한다.
- 출력 경로는 `playwright.config.ts`의 admin 프로젝트 `storageState` 경로와 일치해야 한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | headed 검증에서도 admin route prewarm을 감당할 수 있도록 setup timeout을 120초로 상향 | codex |
| 2026-03-23 | headed 실행에서 Context가 같이 닫히지 않도록 page close 대신 `about:blank` 이동 후 storageState를 저장하도록 조정 | codex |
| 2026-03-23 | storageState 전에 페이지를 닫아 prod 환경 SSE가 열린 상태에서도 setup이 멈추지 않도록 조치 | qa-fe-e2e-testing |
| 2026-03-23 | local/prod 전환 시 인증 스토리지가 충돌하지 않도록 `.auth/{E2E_ENV}/admin.json` 경로를 사용하도록 갱신 | codex |
| 2026-03-16 | storageState 저장 전에 admin route prewarm 단계를 추가해 첫 테스트의 compile race를 완화 | codex |
| 2026-03-14 | 초기 생성 및 storage state 경로를 helper 기준 절대 경로로 고정 | codex |
