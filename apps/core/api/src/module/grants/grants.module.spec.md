# Grants Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/grants/grants.module.ts

## 역할

`GrantsController`가 `RoleGrantFacade`를 주입받도록 facade/service/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| RoleGrantFacade | Controller boundary 유즈케이스 및 응답 조립 |
| RoleGrantService | RoleGrant 도메인 규칙 및 Role 동기화 처리 |
| RoleGrantsRepository | RoleGrant 영속성 접근 |
| RolesRepository | Role 존재 검증 지원 |
| AbilitiesRepository | Ability 존재 검증 지원 |
| SpaceContext | 기존 내부 Space 컨텍스트 의존성 유지 |

## exports

| export | 설명 |
|--------|------|
| RoleGrantFacade | 다른 모듈이 참조할 수 있는 RoleGrant boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | polymorphic Grant provider 구성을 제거하고 RoleGrant 전용 facade/service/repository 조합으로 교체 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | GrantsModule export를 GrantService 기준으로 정렬 | codex |
| 2026-03-13 | GrantsModule boundary provider/export를 `GrantFacade` 기준으로 갱신 | codex |
