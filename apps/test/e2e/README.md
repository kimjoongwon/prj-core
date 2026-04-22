# E2E 테스트 가이드

Admin/IDP/Storybook E2E 테스트는 Playwright 워크스페이스(`apps/test/e2e`)에서 공통으로 관리합니다.

첫 실행 시 필요한 Playwright 브라우저는 사용자 로컬 cache에 자동 설치됩니다.
기본 경로는 Playwright 기본 cache 정책을 따르며, 필요하면 `PLAYWRIGHT_BROWSERS_PATH`로 override할 수 있습니다.

## 실행

```bash
# IDP 로컬 one-shot 준비 + 실행
pnpm test:e2e:idp:local

# Admin 로컬 데스크톱
pnpm --filter=test-e2e test:admin

# Admin 운영 데스크톱
E2E_ADMIN_BASE_URL=https://admin.example.com/admin/ \
pnpm --filter=test-e2e test:admin:prod

# Admin 로컬 모바일
pnpm --filter=test-e2e test:admin:mobile

# IDP 로컬 데스크톱
pnpm --filter=test-e2e test:idp

# Storybook 로컬 데스크톱
pnpm --filter=test-e2e test:storybook

# IDP 운영 데스크톱
E2E_IDP_BASE_URL=https://idp.example.com/ \
E2E_IDP_API_BASE_URL=https://idp.example.com/ \
pnpm --filter=test-e2e test:idp:prod

# Storybook 운영 데스크톱
E2E_STORYBOOK_BASE_URL=https://storybook.example.com/ \
pnpm --filter=test-e2e test:storybook:prod

# IDP 로컬 모바일
pnpm --filter=test-e2e test:idp:mobile
```

## 환경 선택

- `E2E_ENV=local`: 기본값. local base URL과 local webServer 전략을 사용합니다.
- `E2E_ENV=prod`: 운영 base URL만 사용하고 local webServer는 띄우지 않습니다.

운영 실행 시 주요 환경 변수:

- `E2E_ADMIN_BASE_URL`: 예) `https://admin.example.com/admin/`
- `E2E_IDP_BASE_URL`: 예) `https://idp.example.com/`
- `E2E_STORYBOOK_BASE_URL`: 예) `https://storybook.example.com/`
- `E2E_CORE_API_BASE_URL`: 필요 시 Core API readiness URL 오버라이드
- `E2E_IDP_API_BASE_URL`: 필요 시 IDP API readiness URL 오버라이드

참고:

- Admin Playwright 프로젝트는 환경별 storage state를 `tests/admin/helpers/.auth/{env}/admin.json`에 분리 저장합니다.
- IDP 로그인 helper는 `E2E_IDP_BASE_URL`, `E2E_IDP_API_BASE_URL` 등을 읽어 local/prod 호스트를 자동 전환합니다.
- Storybook 프로젝트는 `E2E_STORYBOOK_BASE_URL`을 기준으로 로그인 셸과 protected story 진입을 검증합니다.

## 로컬 IDP one-shot

`pnpm test:e2e:idp:local`은 다음을 순서대로 수행합니다.

- `apps/idp/api/.env` 로드
- `DATABASE_URL`, `REDIS_HOST`가 `localhost/127.0.0.1`인지 검증하고 아니면 즉시 실패
- 로컬 Postgres/Redis 컨테이너 준비 또는 기존 서비스 재사용
- `@cocrepo/service`, `idp-api` 빌드
- Prisma `db:push`, `db:seed`
- `idp-api` 백그라운드 기동
- IDP Playwright E2E 실행

필요하면 `E2E_PLAYWRIGHT_PROJECT=idp-mobile pnpm test:e2e:idp:local`처럼 프로젝트를 바꿀 수 있습니다.

## 로그인 검증 공통 원칙

- 로그인 플로우 공통 로직은 `@cocrepo/e2e`에서 관리합니다.
- 앱별 차이(리다이렉트 URL, storageState, localStorage 보정)는 테스트 래퍼에서만 처리합니다.
- Admin 인증 상태 준비는 `admin-setup` 프로젝트에서 `storageState`를 생성해 재사용합니다.
- IDP는 테스트 내에서 `loginToConsole`을 호출해 로그인 후 검증을 수행합니다.
- Storybook은 로그인 셸에서 generic auth endpoint(`clientId=storybook-web`)와 스토리 복귀를 직접 검증합니다.

## 공통 헬퍼

### `runOidcLoginFlow(page, options)`

- 시작 경로 진입 (`startPath`)
- IDP 로그인 폼 대기 및 계정 입력
- 동의 화면 처리
- 최종 URL 검증 (`finalUrl`)

### `navigateToOidcLoginForm(page, options)`

- 로그인 제출 없이 OIDC 로그인 폼 렌더링까지만 이동합니다.

### `submitOidcCredentials(page, options)`

- 로그인 폼에 계정을 입력하고 제출합니다.

### `waitForOidcConsentForm(page, options)`

- 동의 화면(`허용` 버튼) 표시까지 대기합니다.

## 앱별 래퍼

- Admin: `apps/test/e2e/tests/admin/helpers/login.ts`
  - `loginToAdmin(page)`를 통해 로그인 + Space(localStorage) 보정을 수행합니다.
- IDP:
  - 페이지별 e2e 테스트에서 `@cocrepo/e2e`를 직접 import해 사용합니다.

## 환경 변수

- `E2E_ADMIN_EMAIL`: 로그인 계정 이메일 (기본값 `admin@plate.com`)
- `E2E_ADMIN_PASSWORD`: 로그인 계정 비밀번호 (기본값 `rkdmf12!@`)
- `E2E_SYSTEM_SPACE_ID`: Admin 로그인 후 고정할 Space ID
- `E2E_ENV`: `local|prod` 실행 환경 선택
- `E2E_ADMIN_BASE_URL`: Admin Web base URL
- `E2E_IDP_BASE_URL`: IDP Web base URL
- `E2E_STORYBOOK_BASE_URL`: Storybook base URL
- `E2E_CORE_API_BASE_URL`: Core API base URL
- `E2E_IDP_API_BASE_URL`: IDP API base URL
