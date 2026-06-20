# playwright.config.ts

## 목적

모노레포의 sidecar E2E 테스트를 Playwright 프로젝트별로 수집하고, 로컬 실행 시 필요한 웹 서버를 대상 앱 조합에 맞게 기동한다.

## 주요 계약

- `E2E_TARGET` 값에 따라 `admin`, `storybook` 대상 서버와 테스트 프로젝트를 분리한다.
- `PLAYWRIGHT_BROWSERS_PATH`가 상대 경로이면 e2e 패키지 기준 절대 경로로 정규화한다.
- Playwright 테스트 런너와 sidecar 테스트 파일이 동일한 패키지 인스턴스를 사용하도록 `@playwright/test`, `playwright/test`, `playwright` 모듈 해석을 고정한다.
- API 앱은 Nest `ConfigModule`이 `.env`를 로드하므로, Playwright webServer 명령은 dotenv 파일을 쉘 `source`로 해석하지 않는다.