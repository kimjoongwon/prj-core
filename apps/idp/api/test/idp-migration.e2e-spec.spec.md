# idp-migration.e2e-spec util 기획서

> 생성일: 2026-03-26
> 타입: util
> 위치: apps/idp/api/test/idp-migration.e2e-spec.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 동작 메모

- first-party OIDC 클라이언트 회귀 검증은 seed 기준 식별자(`admin-web`, `idp-web`, `storybook-web`, `user-mobile`, `swagger-web`)를 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Storybook canonical clientId를 `storybook-web`으로 정리하고 회귀 검증 메모를 갱신 | codex |
| 2026-04-14 | first-party OIDC clientId 명명 규칙 변경에 맞춰 `swagger-web` 회귀 검증 메모를 반영 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
