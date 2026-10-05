# @cocrepo/e2e

Playwright E2E helper package shared across admin/idp/test-e2e.

## Exports

- `runOidcLoginFlow`
- `navigateToOidcLoginForm`
- `submitOidcCredentials`
- `waitForOidcConsentForm`
- `loginToConsole`
- `bootstrapAdminSpaceSelection`
- `getAdminSpaceRequestHeaders`
- `navigateToLoginForm`
- `navigateToConsentForm`
- `expectSpaceHeader`
- `capturePageErrors`

## Admin Space ID 계약

- `tenantId`, `spaceId`, resource route ID는 canonical positive BIGINT decimal string을 그대로 사용합니다.
- `loginToConsole(page)`와 `bootstrapAdminSpaceSelection(request, options)`는 native 로그인 뒤 `my-spaces` bootstrap 응답에서 대상 Space를 찾고 `current-space` 선택 응답을 검증한 후 실제 `{ tenantId, spaceId, fitnessCenterName, contentLanguageCode }`를 반환합니다.
- API E2E의 `getAdminSpaceRequestHeaders()`는 setup이 저장한 `admin-persist`의 동적 tenant 선택값을 사용합니다. 명시적으로 tenant ID를 전달할 때도 API 응답에서 얻은 값을 사용해야 합니다.
- E2E 환경 변수나 fixture 상수로 tenant/space 숫자 ID를 고정하지 않습니다.
- OIDC subject와 session 같은 protocol 식별자는 이 database ID 계약과 별개로 기존 ULID/string 형식을 유지합니다.
