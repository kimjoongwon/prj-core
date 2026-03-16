# playwright.config.ts 기획서

> 위치: apps/test/e2e/playwright.config.ts
> 역할: Playwright 프로젝트 및 실행 환경 정의

## 구성

- testDir: 모노레포 루트 (`../../..`)에서 `*.e2e.ts` 탐색
- reporter: `html`, `list`
- use: 공통 설정 (스크린샷/비디오/trace, timeout)
- webServer: admin-web, idp-web dev 서버 자동 실행 (SKIP_WEBSERVER=1로 비활성화)

## 프로젝트

| 이름 | 브라우저 | 용도 | 비고 |
|------|----------|------|------|
| admin-setup | Desktop Chrome | Admin 인증 스토리지 생성 | `SKIP_ADMIN_SETUP=1`이면 제외 |
| admin-chromium | Desktop Chrome | Admin UI 테스트 | storageState=`tests/admin/helpers/.auth/admin.json` |
| admin-mobile | Pixel 5 (Chromium) | Admin 모바일 뷰 | storageState 동일 |
| idp-chromium | Desktop Chrome | IDP UI 테스트 |  |
| idp-mobile | Pixel 5 (Chromium) | IDP 모바일 뷰 |  |

## 환경 변수

- `SKIP_WEBSERVER=1`: dev 서버 기동 생략 (외부에서 직접 실행 시)
- `SKIP_ADMIN_SETUP=1`: admin-setup 프로젝트 및 의존성 생략, 기존 storageState 파일 사용
- `PLAYWRIGHT_BROWSERS_PATH`: 기본값은 `apps/test/e2e/browsers`, 외부 값 설정 시 우선

## 안정화 메모

- 로컬 기본 worker 수는 `3`으로 제한하여 Next dev on-demand compile과 초기 route fan-out 충돌을 줄입니다.
- `admin-setup`은 로그인 직후 주요 admin route를 한 번 순차 방문해 사전 컴파일한 뒤 storageState를 저장합니다.

## 런치 옵션

- 모든 Admin용 Chromium 프로젝트는 `--disable-crash-reporter` 플래그를 강제하여 Crashpad 권한 오류를 회피합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | 로컬 기본 worker 수를 3으로 제한하고 admin setup의 route prewarm 전략을 문서화해 dev on-demand compile race를 완화 | codex |
| 2026-03-15 | `SKIP_ADMIN_SETUP` 토글 및 Crashpad 비활성화를 추가하여 CI 외 환경에서 테스트 실행을 안정화 | qa-fe-e2e-testing |
