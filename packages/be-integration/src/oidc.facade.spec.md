# oidc.facade integration 기획서

> 생성일: 2026-03-11
> 타입: integration-facade
> 위치: packages/be-integration/src/oidc.facade.ts

## 역할

OIDC provider와의 외부 프로토콜 연동을 단순화합니다. Authorization URL 생성, 토큰 교환, 토큰 갱신, 토큰 폐기를 담당합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `OidcFacade` | OIDC 외부 시스템 facade |
| `OidcRpClientKey` | RP 식별자 (`admin`, `storybook`) |
| `OidcTokenResponse` | token endpoint 응답 계약 |

## 비즈니스 규칙

- OIDC issuer와 RP별 clientId, clientSecret, redirectUri는 ConfigService의 `oidc.clients` 설정을 우선 사용합니다.
- `createAuthorizationRequest`, `exchangeCodeForTokens`, `refreshTokens`, `revokeToken`은 모두 `clientKey`를 받아 admin/storybook RP를 구분합니다.
- 설정이 단일 client legacy shape로 들어오더라도 admin RP로 정규화하고 storybook은 fallback 설정을 사용합니다.
- token/revocation endpoint 호출 실패 시 적절한 Nest 예외 또는 warn 로그로 처리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | be-integration OIDC facade 신규 생성 | codex |
| 2026-03-16 | Storybook RP 식별자를 `storybook`으로 단순화하고 fallback clientId 명명도 함께 정리 | codex |
| 2026-03-16 | admin/storybook 다중 RP 선택과 legacy single-client 정규화를 추가 | codex |
