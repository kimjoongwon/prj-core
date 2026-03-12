# Grants Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/grants/grants.module.ts

## 역할

`GrantsController`가 Service와 Grant 관련 service/repository 묶음을 주입받을 수 있도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| GrantsService | Controller 진입용 Grant 유즈케이스 |
| GrantsService | Grant 도메인 서비스 |
| GrantsRepository | Grant 영속성 접근 |
| RolesRepository | Role 존재 검증 지원 |
| UsersRepository | User 존재 검증 지원 |
| AbilitiesRepository | Ability 존재 검증 지원 |
| SpaceContext | 기존 내부 의존성 유지 |

## exports

| export | 설명 |
|--------|------|
| GrantsService | 다른 모듈이 참조할 수 있는 Grant application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | GrantsModule export를 GrantsService 기준으로 정렬 | codex |
