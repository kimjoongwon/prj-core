# oidc util 기획서

> 생성일: 2026-03-26
> 타입: util
> 위치: packages/be-prisma/src/reference-data/definitions/oidc.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| OidcClientSeedData | 공개 계약 요소 |
| oidcClientSeedData | 공개 계약 요소 |
| legacyOidcClientIds | reference-data sync에서 비활성화할 legacy OIDC clientId 목록 |

## 명명 규칙

- 신규/정비 대상 first-party OIDC `clientId`는 `{realm}-{surface}` 패턴을 사용합니다.
- `realm`은 `admin`, `idp`, `user`, `storybook`, `swagger`처럼 인증 주체를 나타냅니다.
- `surface`는 `web`, `mobile`처럼 접속 표면을 나타냅니다.
- repo/product 접두사(`prj-core-*`)는 `clientId`에 포함하지 않습니다.
- 기존 tooling alias는 별도 마이그레이션 전까지 유지할 수 있지만, 새 식별자는 표준 패턴을 우선합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Storybook clientId를 `storybook-web`으로 정리하고 legacy clientId 정리 목록 계약을 추가 | codex |
| 2026-04-14 | first-party OIDC clientId 명명 규칙을 `{realm}-{surface}`로 명시하고 `user-mobile`, `swagger-web` 식별자로 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
