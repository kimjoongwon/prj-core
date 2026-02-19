# Assignment Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/assignment.entity.ts

## 역할

역할(Role)과 테넌트(Tenant)를 연결하는 중간 엔티티입니다. 특정 테넌트(사용자의 공간 접근 정보)에 역할을 할당하는 관계를 표현합니다. Role 기반 접근 제어 시스템에서 테넌트별 역할 배정을 담당합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| roleId | string | FK, required | - | 역할 ID |
| tenantId | string | FK, required | - | 테넌트 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| role | Role (Prisma) | ManyToOne | 할당된 역할 |
| tenant | Tenant (Prisma) | ManyToOne | 역할을 받은 테넌트 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 하나의 테넌트에 여러 역할이 할당될 수 있습니다.
- roleId + tenantId 조합은 유니크해야 합니다 (동일 역할을 동일 테넌트에 중복 할당 불가).
- 소프트 삭제를 통해 역할 할당 이력을 보존합니다.

## 구현 체크리스트

- [x] assignment.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma AssignmentEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
