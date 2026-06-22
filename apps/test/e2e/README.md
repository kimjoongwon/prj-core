# E2E 테스트 가이드

Admin/통합 인증 콘솔/Storybook E2E 테스트는 Playwright 워크스페이스(`apps/test/e2e`)에서 공통으로 관리합니다.

첫 실행 시 필요한 Playwright 브라우저는 사용자 로컬 cache에 자동 설치됩니다.
기본 경로는 Playwright 기본 cache 정책을 따르며, 필요하면 `PLAYWRIGHT_BROWSERS_PATH`로 override할 수 있습니다.

## 실행

```bash
# Admin local full-stack E2E
E2E_DATABASE_URL=postgresql://cocrepo:devpassword@localhost:5432/plate_e2e?schema=public \
pnpm --filter=test-e2e test:admin

# Admin local full-stack E2E (실행 명령 직접 호출)
E2E_DATABASE_URL=postgresql://cocrepo:devpassword@localhost:5432/plate_e2e?schema=public \
pnpm --filter=test-e2e test:admin:run

# Core API real DB E2E
E2E_DATABASE_URL=postgresql://cocrepo:devpassword@localhost:5432/plate_e2e?schema=public \
pnpm --filter=test-e2e test:api:e2e

# Admin 운영 데스크톱
E2E_ADMIN_BASE_URL=https://admin.example.com/admin/ \
pnpm --filter=test-e2e test:admin:prod

# Storybook 로컬 데스크톱
pnpm --filter=test-e2e test:storybook

# 통합 인증 콘솔 운영 데스크톱
E2E_ADMIN_BASE_URL=https://example.com/admin/ \
E2E_CORE_API_BASE_URL=https://example.com/ \
pnpm --filter=test-e2e test:admin:prod

# Storybook 운영 데스크톱
E2E_STORYBOOK_BASE_URL=https://storybook.example.com/ \
pnpm --filter=test-e2e test:storybook:prod

```

## 환경 선택

- `E2E_ENV=local`: 기본값. local base URL과 local webServer 전략을 사용합니다.
- `E2E_ENV=prod`: 운영 base URL만 사용하고 local webServer는 띄우지 않습니다.
- Admin local 실행은 seeded test DB로 Core API와 Admin Web을 함께 띄우는 full-stack 전략만 사용합니다.

## Seeded real DB 정책

- `test:admin`, `test:admin:run`, `test:api:e2e`는 실행 전에 `@cocrepo/prisma db:e2e:reset`을 호출합니다.
- `db:e2e:reset`은 현재 Prisma schema를 `db push --force-reset`으로 반영한 뒤 `PRISMA_SEED_PROFILE=e2e` seed를 실행합니다.
- `E2E_DATABASE_URL` 또는 `TEST_DATABASE_URL`은 DB 이름에 `e2e` 또는 `test`를 포함해야 합니다.
- 이름 규칙을 만족하지 않는 DB는 reset을 거부합니다. 정말 일회성 disposable DB라면 `ALLOW_E2E_DB_RESET=1`을 명시합니다.
- seeded real DB 계약은 `admin@plate.com`, System Space, `admin-web` OIDC client, 핵심 role seed 존재를 검증합니다.

## Admin full-stack 정책

- Admin 브라우저 E2E는 route mock 없이 localhost의 Admin Web, Core API, e2e DB를 사용합니다.
- 새 Admin page E2E는 seed 데이터 또는 테스트가 직접 생성/정리하는 disposable 데이터를 기준으로 작성합니다.
- API 응답을 고정해야 하는 검증은 Admin 브라우저 E2E가 아니라 단위/컴포넌트/API E2E 테스트로 둡니다.

운영 실행 시 주요 환경 변수:

- `E2E_ADMIN_BASE_URL`: 예) `https://example.com/admin/`
- `E2E_STORYBOOK_BASE_URL`: 예) `https://storybook.example.com/`
- `E2E_CORE_API_BASE_URL`: 필요 시 Core API readiness URL 오버라이드
- `E2E_DATABASE_URL`: real/API E2E reset과 Core API 실행에 사용할 테스트 DB URL
- `E2E_DIRECT_URL`: 필요 시 Prisma direct URL 오버라이드

참고:

- Admin Playwright 프로젝트는 환경별 storage state를 `tests/admin/helpers/.auth/{env}/admin.json`에 분리 저장합니다.
- Admin 로그인 helper는 native login을 기본으로 사용하며 `E2E_ADMIN_BASE_URL`, `E2E_CORE_API_BASE_URL` 등을 읽어 local/prod 호스트를 자동 전환합니다.
- Storybook 프로젝트는 `E2E_STORYBOOK_BASE_URL`을 기준으로 로그인 화면과 protected story 진입을 검증합니다.

## 로그인 검증 공통 원칙

- 로그인 플로우 공통 로직은 `@cocrepo/e2e`에서 관리합니다.
- 앱별 차이(리다이렉트 URL, storageState, localStorage 보정)는 테스트 래퍼에서만 처리합니다.
- Admin 인증 상태 준비는 `admin-setup` 프로젝트에서 native login으로 `storageState`를 생성해 재사용합니다.
- 이동된 인증 설정/flow 테스트는 `loginToConsole`을 호출해 로그인 후 검증을 수행합니다.
- OIDC protocol flow 검증은 `runOidcLoginFlow`, `navigateToOidcLoginForm` 등 OIDC 전용 helper를 직접 호출합니다.
- Storybook은 로그인 화면에서 generic auth endpoint(`clientId=storybook-web`)와 스토리 복귀를 직접 검증합니다.

## 공통 헬퍼

### `loginToConsole(page)`

- Admin native 로그인 화면 진입
- 시드 관리자 계정 입력
- System Space current-space 검증 및 admin-persist 보정

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
- 통합 인증 콘솔:
  - `admin/web`의 이동된 인증 설정 e2e 테스트에서 `@cocrepo/e2e`의 `loginToConsole`을 직접 import해 사용합니다.
  - OIDC flow e2e 테스트에서는 OIDC 전용 helper를 직접 import해 사용합니다.

## 환경 변수

- `E2E_ADMIN_EMAIL`: 로그인 계정 이메일 (기본값 `admin@plate.com`)
- `E2E_ADMIN_PASSWORD`: 로그인 계정 비밀번호 (기본값 `rkdmf12!@`)
- `E2E_SYSTEM_SPACE_ID`: Admin 로그인 후 고정할 Space ID
- `E2E_ENV`: `local|prod` 실행 환경 선택
- `E2E_ADMIN_BASE_URL`: Admin Web base URL
- `E2E_STORYBOOK_BASE_URL`: Storybook base URL
- `E2E_CORE_API_BASE_URL`: Core API base URL
