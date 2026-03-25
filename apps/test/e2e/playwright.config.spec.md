# playwright.config.ts 기획서

> 위치: apps/test/e2e/playwright.config.ts
> 역할: Playwright 프로젝트 및 실행 환경 정의

## 구성

- testDir: 모노레포 루트 (`../../..`)에서 `*.e2e.ts` 탐색
- reporter: `html`, `list`
- use: 공통 설정 (스크린샷/비디오/trace, timeout)
- `E2E_ENV=local|prod`에 따라 base URL과 webServer 전략을 전환
- webServer: `local`일 때만 admin-web, idp-web, tool-storybook dev 서버 자동 실행 (`SKIP_WEBSERVER=1`로 비활성화)

## 프로젝트

| 이름 | 브라우저 | 용도 | 비고 |
|------|----------|------|------|
| admin-setup | Desktop Chrome | Admin 인증 스토리지 생성 | `SKIP_ADMIN_SETUP=1`이면 제외 |
| admin-chromium | Desktop Chrome | Admin UI 테스트 | storageState=`tests/admin/helpers/.auth/{env}/admin.json` |
| admin-mobile | Pixel 5 (Chromium) | Admin 모바일 뷰 | storageState 동일 |
| idp-chromium | Desktop Chrome | IDP UI 테스트 |  |
| idp-mobile | Pixel 5 (Chromium) | IDP 모바일 뷰 |  |
| storybook-chromium | Desktop Chrome | Storybook 로그인/보호 셸 테스트 | `apps/tool/storybook/**/*.e2e.ts` |

## 환경 변수

- `E2E_ENV=local|prod`: 실행 대상 환경 선택
- `E2E_ADMIN_BASE_URL`: Admin Web base URL (`prod`에서 필요)
- `E2E_IDP_BASE_URL`: IDP Web base URL (`prod`에서 필요)
- `E2E_STORYBOOK_BASE_URL`: Storybook base URL (`prod`에서 필요)
- `E2E_CORE_API_BASE_URL`: Core API readiness URL 오버라이드 (선택)
- `E2E_IDP_API_BASE_URL`: IDP API readiness URL 오버라이드 (선택)
- `SKIP_WEBSERVER=1`: dev 서버 기동 생략 (외부에서 직접 실행 시)
- `SKIP_ADMIN_SETUP=1`: admin-setup 프로젝트 및 의존성 생략, 기존 storageState 파일 사용
- `PLAYWRIGHT_BROWSERS_PATH`: 기본값은 `apps/test/e2e/browsers`, 외부 값 설정 시 우선

## 안정화 메모

- 로컬 기본 worker 수는 `3`으로 제한하여 Next dev on-demand compile과 초기 route fan-out 충돌을 줄입니다.
- `admin-setup`은 로그인 직후 주요 admin route를 한 번 순차 방문해 사전 컴파일한 뒤 환경별 storageState를 저장합니다.
- `prod` 환경은 local webServer를 띄우지 않고 주입된 base URL로만 실행합니다.
- 공통 `navigationTimeout`은 `60000ms`, 테스트 `timeout`은 `90000ms`로 유지해 로컬 dev 서버의 첫 route compile 지연을 흡수합니다.

## 런치 옵션

- 모든 Admin용 Chromium 프로젝트는 `--disable-crash-reporter` 플래그를 강제하여 Crashpad 권한 오류를 회피합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-25 | Storybook Chromium 프로젝트와 Storybook dev server 기동 구성을 추가 | codex |
| 2026-03-23 | 로컬 dev 서버의 첫 route compile 지연을 흡수하도록 공통 navigation/test timeout을 60s/90s로 상향 | codex |
| 2026-03-23 | `E2E_ENV=local|prod` 선택 구조와 환경별 base URL/storageState 분리를 추가 | codex |
| 2026-03-16 | 로컬 기본 worker 수를 3으로 제한하고 admin setup의 route prewarm 전략을 문서화해 dev on-demand compile race를 완화 | codex |
| 2026-03-15 | `SKIP_ADMIN_SETUP` 토글 및 Crashpad 비활성화를 추가하여 CI 외 환경에서 테스트 실행을 안정화 | qa-fe-e2e-testing |
