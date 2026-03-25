# oidc.config util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/config/oidc.config.ts

## 역할

OIDC provider/client 설정 계약을 정의하며, `OidcFacade`와 `AuthController`가 소비하는 설정 소스입니다. 로그인 진입점은 `clientId` 기반 generic route를 사용하고, 이 설정은 provider fallback auth-shell registry로 활용됩니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| JwksKeys | 공개 계약 요소 |
| OidcRpClientRegistryKey | fallback RP registry key (`admin`, `storybook`, `idpWeb`) |
| OidcRpClientConfig | RP별 client/login/default redirect 설정 |
| OidcConfig | 공개 계약 요소 |
| oidcConfig | 공개 계약 요소 |

## 비즈니스 규칙

- `oidc.clients.admin`, `oidc.clients.storybook`, `oidc.clients.idpWeb`은 provider fallback auth-shell registry로 동시에 제공됩니다.
- auth shell route는 모두 `/api/v1/auth/login?clientId=...`와 `/api/v1/auth/callback?clientId=...` 계약을 따릅니다.
- admin RP의 기본 redirect URI는 `http://localhost:3000/api/v1/auth/callback?clientId=admin-web`, 기본 login URL은 `http://localhost:3000/admin/auth/login`, 기본 return URL은 `http://localhost:3000/admin/dashboard`입니다.
- storybook RP의 기본 redirect URI는 `http://localhost:6006/api/v1/auth/callback?clientId=storybook`, 기본 login URL은 `http://localhost:6006/__storybook_auth/login`, 기본 return URL은 `http://localhost:6006/`입니다.
- idpWeb RP의 기본 redirect URI는 `http://localhost:3008/api/v1/auth/callback?clientId=idp-web`, 기본 login URL은 `http://localhost:3008/auth/login`, 기본 return URL은 `http://localhost:3008/dashboard`입니다.
- 개별 override(`OIDC_ADMIN_REDIRECT_URI`, `OIDC_ADMIN_LOGIN_URL`, `OIDC_ADMIN_DEFAULT_RETURN_TO`, `OIDC_STORYBOOK_REDIRECT_URI`, `OIDC_STORYBOOK_LOGIN_URL`, `OIDC_STORYBOOK_DEFAULT_RETURN_TO`, `OIDC_IDP_WEB_REDIRECT_URI`, `OIDC_IDP_WEB_LOGIN_URL`, `OIDC_IDP_WEB_DEFAULT_RETURN_TO`)는 base URL 조합보다 우선합니다.
- OIDC 환경변수는 `OIDC_ADMIN_*`, `OIDC_STORYBOOK_*`, `OIDC_IDP_WEB_*` 정식 키만 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-25 | callback/login contract를 clientId 기반 generic route 기준으로 정리 | codex |
| 2026-03-16 | OIDC 설정 sidecar의 Storybook 명명 기록을 최종 식별자 기준으로 정리 | codex |
| 2026-03-16 | Storybook RP 식별자와 기본 clientId/clientSecret 명명을 최종 형태로 정리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | OIDC 설정 소비자를 OidcFacade 기준으로 명시 | codex |
| 2026-03-16 | admin/storybook 다중 RP 설정과 login/default redirect 계약을 추가 | codex |
