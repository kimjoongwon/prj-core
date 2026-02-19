# Role Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/role.entity.ts

## 역할

권한 관리 시스템의 핵심 역할(Role) 엔티티입니다. FULL_ACCESS, MANAGE, VIEW 등의 시스템 역할과 커스텀 역할을 정의하며, Tenant와 Assignment를 통해 사용자에게 할당됩니다. Grant 테이블을 통해 CASL Ability와 연결됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required, unique | - | 역할 이름 (FULL_ACCESS, MANAGE, VIEW 등) |
| displayName | string \| null | nullable | null | 화면 표시명 |
| description | string \| null | nullable | null | 역할 설명 |
| isSystem | boolean | required | - | 시스템 기본 역할 여부 |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| SYSTEM_ROLES (상수) | FULL_ACCESS | 모든 권한을 가진 최고 관리자 역할 |
| SYSTEM_ROLES (상수) | MANAGE | 관리 권한을 가진 역할 |
| SYSTEM_ROLES (상수) | VIEW | 조회 권한만 가진 역할 |

## 관계

해당 없음 (Tenant, Assignment, Grant 등에서 이 엔티티를 참조)

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- `isSystem=true`인 역할은 시스템 기본 역할로 삭제 불가합니다.
- 시스템 역할: FULL_ACCESS, MANAGE, VIEW (2026-02-07 추상화 이후 변경된 이름).
- 사용자에게 역할을 할당할 때는 Tenant 테이블을 통해 Space별로 할당합니다.
- 역할에 권한을 부여할 때는 Grant 테이블을 통해 Ability를 연결합니다.
- RoleClassification을 통해 카테고리(PLATFORM, SHARED, WORKSPACE 등)로 분류됩니다.
- RoleAssociation을 통해 그룹(TRUSTED, STANDARD, PREMIUM)에 연결됩니다.

## 구현 체크리스트

- [x] role.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma RoleEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
