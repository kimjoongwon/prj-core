# RoleGrants Repository 기획서

> 생성일: 2026-04-06
> 타입: repository
> 위치: packages/be-repository/src/role-grants.repository.ts

## 역할

Role 기본 권한 할당(`RoleGrant`)의 영속성 접근을 담당합니다. 역할 ID 기준 활성 권한 조회와 역할-권한 조합 upsert, Ability 삭제에 따른 연쇄 soft delete를 제공합니다.

## 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `findActiveByRoleIds(roleIds)` | `Promise<RoleGrant[]>` | 여러 Role ID의 활성 RoleGrant를 Ability 포함으로 조회 |
| `createMany(data)` | `Promise<number>` | 다중 생성 |
| `upsertByRoleIdAndAbilityId(roleId, abilityId, data)` | `Promise<RoleGrant>` | 동일 roleId+abilityId 조합을 생성 또는 복구/갱신 |
| `updateById(id, data)` | `Promise<RoleGrant>` | 단건 수정 |
| `removeById(id)` | `Promise<RoleGrant>` | 단건 soft delete |
| `removeByAbilityId(abilityId)` | `Promise<number>` | Ability에 연결된 RoleGrant 일괄 soft delete |

## 비즈니스 규칙

- 조회 시 항상 `ability -> subject + action` 관계를 포함합니다.
- 활성 조회는 `isActive=true` 이고 `removedAt=null` 인 RoleGrant만 반환합니다.
- upsert는 soft deleted RoleGrant를 다시 사용할 수 있도록 `removedAt=null` 복구를 포함합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 기존 polymorphic GrantsRepository를 RoleGrant 전용 저장소로 분리 | codex |
