# RoleClassification Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/role-classification.entity.ts

## 역할

역할(Role)과 카테고리(Category)를 연결하는 중간 엔티티입니다. 역할을 카테고리별로 분류하여 역할 관리 시스템에서 계층적 분류 구조를 지원합니다. Category의 `CategoryTypes`가 역할 분류에 해당하는 유형인 경우에 사용됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| categoryId | string | FK, required | - | 카테고리 ID |
| roleId | string | FK, required | - | 역할 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| category | Category | ManyToOne | 연결된 카테고리 |
| role | Role | ManyToOne | 연결된 역할 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- categoryId + roleId 조합은 유니크해야 합니다 (동일 역할의 동일 카테고리 중복 분류 불가).
- 소프트 삭제를 통해 역할-카테고리 분류 이력을 보존합니다.
- RoleGroupNames(TRUSTED, STANDARD, PREMIUM)나 RoleCategoryNames(PLATFORM 등)로 카테고리가 구분됩니다.

## 구현 체크리스트

- [x] role-classification.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma RoleClassificationEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
