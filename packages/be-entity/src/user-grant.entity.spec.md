# UserGrant Entity 기획서

> 생성일: 2026-04-06
> 타입: entity
> 위치: packages/be-entity/src/user-grant.entity.ts

## 역할

User에 Ability를 직접 연결하는 사용자 전용 권한 할당 엔티티입니다. 역할 기반 기본 권한 위에 겹치는 예외 권한을 표현하며 `userId`와 `abilityId` 조합으로 어떤 사용자가 어떤 예외 권한을 받는지 나타냅니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| userId | string | FK, required | - | 권한 대상 User ID |
| abilityId | string | FK, required | - | 부여할 Ability ID |
| isActive | boolean | required | true | 활성화 여부 |
| priority | number | required | 10 | 우선순위 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| ability | Ability | ManyToOne | 할당된 Ability 상세 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isEnabled() | boolean | 권한이 활성 상태인지 확인 |

## 비즈니스 규칙

- UserGrant는 사용자별 예외 권한만 표현합니다.
- 동일 User에는 동일 Ability를 하나만 유지합니다.
- 일반적으로 RoleGrant보다 높은 priority를 사용해 예외 권한이 우선 적용됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 기존 polymorphic Grant를 RoleGrant/UserGrant로 분리하면서 신규 생성 | codex |
