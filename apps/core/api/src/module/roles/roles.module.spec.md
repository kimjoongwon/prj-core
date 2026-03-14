# Roles Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/roles/roles.module.ts

## 역할

`RolesController`가 `RoleFacade`를 주입받도록 facade/service/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| RoleFacade | Controller boundary 유즈케이스 및 응답 조립 |
| RoleService | Role 도메인 규칙 및 변경 처리 |
| RolesRepository | Role 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| RoleFacade | 다른 모듈이 참조할 수 있는 Role boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | RolesModule export를 RoleService 기준으로 정렬 | codex |
| 2026-03-13 | RolesModule boundary provider/export를 `RoleFacade` 기준으로 갱신 | codex |
