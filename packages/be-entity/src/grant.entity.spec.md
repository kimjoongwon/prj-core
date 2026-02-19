# Grant Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/grant.entity.ts

## 역할

Role 또는 User에 Ability를 부여하는 다형성 BRIDGE 테이블 엔티티입니다. `granteeType` 필드로 부여 대상이 역할(Role) 또는 사용자(User)인지를 구분합니다. 우선순위 시스템을 통해 사용자별 예외 권한이 역할 기반 권한보다 높은 우선순위를 가집니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| granteeType | string | required | - | 권한 대상 유형 ("Role" 또는 "User") |
| granteeId | string | required | - | 권한 대상 ID (roleId 또는 userId) |
| abilityId | string | FK, required | - | 부여할 Ability ID |
| isActive | boolean | required | - | 활성화 여부 |
| priority | number | required | - | 우선순위 (User: 10+, Role: 0-9) |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| granteeType (비공식) | "Role" | 역할 기반 권한 부여 |
| granteeType (비공식) | "User" | 사용자별 예외 권한 부여 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| ability | Ability | ManyToOne | 부여된 Ability |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isRoleGrant() | boolean | 역할 기반 권한 부여인지 확인 |
| isUserGrant() | boolean | 사용자별 예외 권한 부여인지 확인 |
| isEnabled() | boolean | 권한이 활성화되었는지 확인 (isActive && removedAt === null) |
| isHighPriority() | boolean | 우선순위가 사용자 권한 수준(10 이상)인지 확인 |
| isRolePriority() | boolean | 우선순위가 역할 권한 수준(0-9)인지 확인 |

## 비즈니스 규칙

- 다형성 패턴: `granteeType`이 "Role"이면 역할 기반 권한, "User"이면 사용자별 예외 권한입니다.
- 우선순위 규칙: User 권한(10 이상)이 Role 권한(0-9)보다 항상 높은 우선순위를 가집니다.
- 권한이 유효하려면 `isActive=true` AND `removedAt=null`이어야 합니다.
- `isActive=false`로 설정하여 일시적으로 권한을 비활성화할 수 있습니다.
- `@Type(() => Ability)` 데코레이터로 class-transformer 직렬화를 지원합니다.

## 구현 체크리스트

- [x] grant.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma GrantEntity 타입 implements
- [x] class-transformer @Type 데코레이터 적용
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
