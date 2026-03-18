# Prisma Seed Definition Spec

> 생성일: 2026-03-16
> 타입: seed definitions
> 위치: packages/be-prisma/src/reference-data/definitions/index.ts
> 위치: packages/be-prisma/src/bootstrap/data/index.ts
> 위치: packages/be-prisma/src/demo-data/index.ts

## 역할

`be-prisma` 안의 seed 정의 계층을 설명합니다. 실제 실행은 한 경로가 아니라 아래처럼 나뉩니다.

- `reference-data definitions` -> `data-migrate.ts` -> 운영 기준 데이터 반영
- `bootstrap/data` + `demo-data` -> `seed.ts` -> dev/stg bootstrap

즉 이 문서는 "정의 파일의 역할"을 설명하는 문서이고, 운영 반영 원칙은 `docs/seed-data-governance.md`가 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| system space | E2E와 로컬 개발에서 공통으로 쓰는 기준 Space 데이터를 제공합니다. |
| oidc clients | admin, storybook, mobile, swagger 기본 RP/client seed를 제공합니다. |
| storybook redirect URI | 로컬 Storybook 인증은 `http://localhost:6006/api/v1/auth/storybook/callback`을 기본 callback으로 사용합니다. |
| 분류 기준 | reference-data, bootstrap default, demo data를 서로 다른 책임으로 유지합니다. |

## 계층 구분

| 계층 | 위치 | 역할 |
|------|------|------|
| reference-data | `src/reference-data/definitions/**` | 운영에서도 코드 기준으로 유지해야 하는 카탈로그/계약 데이터 |
| bootstrap default | `src/bootstrap/data/**` | 초기 환경을 세울 때 넣는 기본값 |
| demo data | `src/demo-data/**` | dev/stg 화면 확인과 샘플 시나리오용 데이터 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-18 | reference/bootstrap/demo 용어와 실행 경로 설명을 현재 구조 기준으로 정리 | codex |
| 2026-03-16 | Storybook OIDC seed 표시명을 clientId 기준으로 정리 | codex |
| 2026-03-16 | Storybook OIDC seed 식별자를 `storybook`으로 단순화하고 계약 설명을 갱신 | codex |
| 2026-03-16 | Storybook local OIDC client seed의 redirect URI를 localhost:6006 callback으로 수정하고 sidecar를 신규 추가 | codex |
