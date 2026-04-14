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
| `OidcClientProtocolConfig` | authorization/token/revocation 호출에 쓰는 clientId, clientSecret, redirectUri 계약 |
| `OidcTokenResponse` | token endpoint 응답 계약 |

## 비즈니스 규칙

- OIDC issuer와 jwksUri는 ConfigService의 `oidc` 설정을 사용합니다.
- `createAuthorizationRequest`, `exchangeCodeForTokens`, `refreshTokens`, `revokeToken`은 모두 호출 시점에 전달된 `OidcClientProtocolConfig`를 사용합니다.
- clientId/clientSecret/redirectUri는 auth application/service 레이어에서 DB 조회 결과를 바탕으로 결정합니다.
- token/revocation endpoint 호출 실패 시 적절한 Nest 예외 또는 warn 로그로 처리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Storybook RP canonical clientId를 `storybook-web` 기준으로 정리 | codex |
| 2026-03-25 | OIDC facade가 static RP key 대신 explicit protocol client config를 받도록 정리 | codex |
| 2026-03-18 | legacy single-client OIDC 설정 정규화를 제거하고 다중 RP 구조만 허용하도록 정리 | codex |
| 2026-03-11 | be-integration OIDC facade 신규 생성 | codex |
| 2026-03-16 | Storybook RP 식별자를 `storybook`으로 단순화하고 fallback clientId 명명도 함께 정리 | codex |
| 2026-03-16 | admin/storybook 다중 RP 선택을 추가 | codex |
