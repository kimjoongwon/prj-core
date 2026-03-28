# oidc-provider.types util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/module/oidc/types/oidc-provider.types.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| KoaLikeRequest | 공개 계약 요소 |
| KoaLikeResponse | 공개 계약 요소 |
| AccountClaims | 공개 계약 요소 |
| ClaimsParameterMember | 공개 계약 요소 |
| Account | 공개 계약 요소 |
| FindAccount | 공개 계약 요소 |
| Interaction | 공개 계약 요소 |
| Grant | 공개 계약 요소 |
| OidcClientInfo | 공개 계약 요소 |
| RawOidcProviderClient | 공개 계약 요소 |
| OidcClientConfig | 공개 계약 요소 |
| OidcProviderInstance | 공개 계약 요소 |
| ResourceServerInfo | 공개 계약 요소 |

## 경계 규칙

- `OidcClientConfig`는 oidc-provider 설정 메타데이터 규격을 따라 `client_name` 같은 snake_case 키를 사용합니다.
- `RawOidcProviderClient`는 oidc-provider 런타임 `Client.find()` 결과를 나타내며 camelCase된 `clientName`, `logoUri` 키를 사용합니다.
- 앱 내부 응답 계약은 `OidcClientInfo.name`으로 통일하고 외부 경계에서만 변환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | oidc-provider 설정 메타데이터와 런타임 Client.find 결과의 키 차이를 반영해 외부 경계 타입을 정교화 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
