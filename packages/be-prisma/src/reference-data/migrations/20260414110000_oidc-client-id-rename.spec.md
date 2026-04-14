# 20260414110000_oidc-client-id-rename util 기획서

> 생성일: 2026-04-14
> 타입: util
> 위치: packages/be-prisma/src/reference-data/migrations/20260414110000_oidc-client-id-rename.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| oidcClientIdRenameMigration | 운영 DB에서 최신 OIDC clientId seed를 다시 sync하도록 여는 reference-data migration |

## 동작 메모

- 이미 적용된 과거 reference-data migration은 checksum 보호 때문에 재실행되지 않으므로, 이번 rename은 새 migration id로 현재 `syncReferenceData()`를 한 번 더 실행해 반영합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | `storybook-web`, `user-mobile`, `swagger-web` 기준의 canonical OIDC clientId를 운영 DB에도 반영하는 migration 신규 추가 | codex |
