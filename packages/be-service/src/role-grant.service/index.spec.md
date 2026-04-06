# RoleGrant Service 기획서

> 생성일: 2026-04-06
> 타입: service
> 위치: packages/be-service/src/role-grant.service/index.ts

## 역할

Role 기본 권한 묶음(`RoleGrant`)을 전체 동기화 방식으로 관리합니다. 역할 존재 여부 확인, Ability 목록 검증, 제거 대상 soft delete, 동일 roleId+abilityId upsert를 한 트랜잭션에서 수행합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| `RoleGrantsRepository` | RoleGrant 조회/저장 |
| `RolesRepository` | Role 존재 검증 |
| `AbilitiesRepository` | Ability 존재 검증 |

## 공개 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `batchAssignToRole(roleId, items)` | `Promise<RoleGrant[]>` | 특정 Role의 기본 권한을 전체 동기화 |

## 비즈니스 규칙

- 요청에 포함되지 않은 기존 활성 RoleGrant는 soft delete 합니다.
- 요청에 포함된 항목은 `roleId + abilityId` 기준 upsert하여 soft deleted row도 복구합니다.
- Ability ID 목록 중 하나라도 존재하지 않으면 `GRANT_ERRORS.ABILITY_NOT_FOUND` 를 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 기존 GrantService에서 역할 배치 동기화 책임만 분리해 RoleGrantService 신규 생성 | codex |
