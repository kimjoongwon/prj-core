# UserGrants Repository 기획서

> 생성일: 2026-04-06
> 타입: repository
> 위치: packages/be-repository/src/user-grants.repository.ts

## 역할

User 예외 권한 할당(`UserGrant`)의 영속성 접근을 담당합니다. 사용자 기준 활성 권한 조회와 Ability 삭제 시 연결된 예외 권한 정리를 제공합니다.

## 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `findActiveByUserId(userId)` | `Promise<UserGrant[]>` | 사용자의 활성 예외 권한을 Ability 포함으로 조회 |
| `removeByAbilityId(abilityId)` | `Promise<number>` | Ability에 연결된 UserGrant를 일괄 soft delete |

## 비즈니스 규칙

- 조회 시 항상 `ability -> subject + action` 관계를 포함합니다.
- 활성 조회는 `isActive=true` 이고 `removedAt=null` 인 UserGrant만 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 기존 polymorphic GrantsRepository를 UserGrant 전용 조회 저장소로 분리 | codex |
