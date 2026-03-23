# idp login helper 기획서

> 생성일: 2026-03-04
> 타입: util
> 위치: packages/fe-e2e/src/idp-login.ts

## 역할

IDP E2E 시나리오에서 사용하는 로그인 진입 헬퍼를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `loginToConsole(page)` | `/api/v1/auth/idp/login`과 `/api/interaction/:uid/*`를 직접 사용해 UI hydration/consent 렌더링에 의존하지 않고 기본 landing(`/dashboard`) 진입을 보장하며, `E2E_IDP_BASE_URL`/`E2E_IDP_API_BASE_URL` 등 환경 변수로 로컬/운영 호스트를 선택 가능 |
| `navigateToLoginForm(page)` | 로그인 폼 렌더링까지만 이동 (consent만 뜨는 경우 실패 처리) |
| `navigateToConsentForm(page)` | 로그인 제출 후 동의 화면 렌더링까지 이동 (세션 유지 시 로그인 단계를 생략) |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `E2E_IDP_BASE_URL`, `E2E_IDP_API_BASE_URL`, `E2E_IDP_LOGIN_PATH` 등 환경 변수로 로컬/운영 선택을 지원하도록 로그인 헬퍼 설정을 일반화 | qa-fe-e2e-testing |
| 2026-03-23 | 콘솔 로그인 헬퍼를 interaction API 기반으로 전환해 UI redirect/hydration 의존성을 제거 | codex |
| 2026-03-23 | 콘솔 로그인 시작점을 `/auth/login`에서 `/api/v1/auth/idp/login`으로 바꿔 hydration 의존성을 제거 | codex |
| 2026-03-23 | 로그인/동의 진입점이 자동으로 결정되도록 헬퍼 계약을 갱신 | qa-fe-e2e-testing |
| 2026-03-23 | 콘솔 로그인 helper가 OIDC 전체 재시도 설정을 사용하도록 조정 | codex |
| 2026-03-06 | IDP 로그인 헬퍼를 `@cocrepo/e2e` 패키지로 분리 이관 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-04 | IDP 로그인 헬퍼를 @cocrepo/ui 공통 모듈로 이관 | codex |
