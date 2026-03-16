# Prisma Seed Data 기획서

> 생성일: 2026-03-16
> 타입: seed
> 위치: packages/be-prisma/seed-data.ts

## 역할

로컬 개발과 초기 데이터 적재에 필요한 기준 seed 데이터를 정의합니다. 사용자/권한/공간뿐 아니라 OIDC client 기본 계약도 함께 제공합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| system space | E2E와 로컬 개발에서 공통으로 쓰는 기준 Space 데이터를 제공합니다. |
| oidc clients | admin, storybook, mobile, swagger 기본 RP/client seed를 제공합니다. |
| storybook redirect URI | 로컬 Storybook 인증은 `http://localhost:6006/api/v1/auth/storybook/callback`을 기본 callback으로 사용합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | Storybook OIDC seed 표시명을 clientId 기준으로 정리 | codex |
| 2026-03-16 | Storybook OIDC seed 식별자를 `storybook`으로 단순화하고 계약 설명을 갱신 | codex |
| 2026-03-16 | Storybook local OIDC client seed의 redirect URI를 localhost:6006 callback으로 수정하고 sidecar를 신규 추가 | codex |
