# oidc.config util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/config/oidc.config.ts

## 역할

OIDC provider/client 설정 계약을 정의하며, `OidcFacade`와 `AuthController`가 소비하는 설정 소스입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| JwksKeys | 공개 계약 요소 |
| OidcRpClientKey | RP 식별자 (`admin`, `storybook`) |
| OidcRpClientConfig | RP별 client/login/default redirect 설정 |
| OidcConfig | 공개 계약 요소 |
| oidcConfig | 공개 계약 요소 |

## 비즈니스 규칙

- `oidc.clients.admin`과 `oidc.clients.storybook`을 동시에 제공하여 다중 RP 구성을 지원합니다.
- admin RP는 `http://localhost:3000/api/v1/auth/callback`, storybook RP는 `http://localhost:6006/api/v1/auth/storybook/callback`을 기본 redirect URI로 사용합니다.
- storybook RP의 에러 복귀 URL은 `http://localhost:6006/__storybook_auth/login`을 기본값으로 사용합니다.
- admin RP는 기존 `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_REDIRECT_URI` 환경변수를 하위 입력값으로 받아 기존 로컬 환경을 깨지지 않게 흡수합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | OIDC 설정 sidecar의 Storybook 명명 기록을 최종 식별자 기준으로 정리 | codex |
| 2026-03-16 | Storybook RP 식별자와 기본 clientId/clientSecret 명명을 최종 형태로 정리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | OIDC 설정 소비자를 OidcFacade 기준으로 명시 | codex |
| 2026-03-16 | admin/storybook 다중 RP 설정과 login/default redirect 계약을 추가 | codex |
