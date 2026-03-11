# Roles Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/roles/roles.module.ts

## 역할

`RolesController`가 ApplicationService와 Role service/repository 조합을 주입받을 수 있도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| RolesApplicationService | Controller 진입용 Role 유즈케이스 |
| RolesService | Role 도메인 서비스 |
| RolesRepository | Role 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| RolesApplicationService | 다른 모듈이 참조할 수 있는 Role application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | RolesModule export를 RolesApplicationService 기준으로 정렬 | codex |
