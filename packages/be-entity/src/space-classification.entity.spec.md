# SpaceClassification Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/space-classification.entity.ts

## 역할

공간(Space)과 카테고리(Category)를 연결하는 중간 엔티티입니다. 공간을 카테고리로 분류하며, 카테고리의 계층 구조를 활용한 공간 분류 시스템을 지원합니다. System Space 식별에도 사용됩니다 (ROOT 카테고리와 연결된 공간이 System Space).

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| categoryId | string | FK, required | - | 카테고리 ID |
| spaceId | string | FK, required | - | 공간 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| category | Category | ManyToOne | 연결된 카테고리 |
| space | Space | ManyToOne | 연결된 공간 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- categoryId + spaceId 조합은 유니크해야 합니다 (동일 공간의 동일 카테고리 중복 분류 불가).
- `isRootSpaceCategory(tenant)` 함수로 PLATFORM 카테고리와 연결된 공간이 System Space임을 확인합니다.
- 소프트 삭제를 통해 공간-카테고리 분류 이력을 보존합니다.

## 구현 체크리스트

- [x] space-classification.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma SpaceClassificationEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
