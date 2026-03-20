# E2E 테스트 가이드

Admin/IDP E2E 테스트는 Playwright 워크스페이스(`apps/test/e2e`)에서 공통으로 관리합니다.

## 실행

```bash
# IDP 로컬 one-shot 준비 + 실행
pnpm test:e2e:idp:local

# Admin 데스크톱
pnpm --filter=test-e2e test:admin

# Admin 모바일
pnpm --filter=test-e2e test:admin:mobile

# IDP 데스크톱
pnpm --filter=test-e2e test:idp

# IDP 모바일
pnpm --filter=test-e2e test:idp:mobile
```

## 로컬 IDP one-shot

`pnpm test:e2e:idp:local`은 다음을 순서대로 수행합니다.

- `apps/idp/api/.env.local` 또는 `.env` 로드
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
