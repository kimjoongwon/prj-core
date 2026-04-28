# ensure-playwright-browsers

## 목적

Playwright 기반 테스트 실행 전에 필요한 브라우저 바이너리가 설치되어 있는지 확인하고, 없으면 `pnpm exec playwright install`을 실행합니다.

## 동작

| 항목 | 설명 |
|------|------|
| 명시 경로 | `PLAYWRIGHT_BROWSERS_PATH`가 있으면 해당 경로를 사용합니다. |
| workspace 기본값 | 환경 변수가 없고 `apps/test/e2e/browsers`가 존재하면 해당 저장소 로컬 캐시를 사용합니다. |
| 플랫폼 기본값 | 저장소 로컬 캐시가 없으면 Playwright 플랫폼 기본 캐시 위치를 사용합니다. |
| 설치 판정 | `playwright install --dry-run`의 설치 위치가 모두 비어 있지 않으면 설치를 생략합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | workspace 로컬 Playwright 브라우저 캐시를 기본 경로로 탐지하도록 문서화 | codex |
