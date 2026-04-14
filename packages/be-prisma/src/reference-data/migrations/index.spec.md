# index 배럴 기획서

> 생성일: 2026-03-26
> 타입: index
> 위치: packages/be-prisma/src/reference-data/migrations/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| referenceDataMigrations | 공개 계약 요소 |

## 규칙

- 배열 순서가 실제 reference-data migration 적용 순서입니다.
- `initial-reference-data` 뒤에 catalog 보정/prune 성격의 후속 migration을 이어 붙여 운영 DB drift를 수정합니다.
- OIDC `clientId` 같은 reference-owned business key를 재정렬할 때도 새 migration id를 추가해 이미 적용된 환경에 현재 sync 로직을 다시 태웁니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | OIDC canonical clientId rename(`storybook-web`, `user-mobile`, `swagger-web`)을 운영 DB에 반영하는 migration을 실행 순서 끝에 추가 | codex |
| 2026-04-06 | admin menu/page current catalog sync 및 legacy prune migration을 실행 순서 끝에 추가 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
