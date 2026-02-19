# UserClassification Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/user-classification.entity.ts

## 역할

사용자(User)와 카테고리(Category)를 연결하는 중간 엔티티입니다. 사용자를 카테고리별로 분류하는 관계 테이블로, 계층적 카테고리 구조를 활용한 사용자 분류 시스템을 지원합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| categoryId | string | FK, required | - | 카테고리 ID |
| userId | string | FK, required | - | 사용자 ID |

## Enum

해당 없음

## 관계

해당 없음 (카테고리와 사용자는 각 FK로 참조)

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- categoryId + userId 조합은 유니크해야 합니다 (동일 사용자의 동일 카테고리 중복 분류 불가).
- 소프트 삭제를 통해 사용자-카테고리 분류 이력을 보존합니다.
- Category의 `CategoryTypes`가 사용자 분류에 해당하는 유형인 경우에만 연결됩니다.

## 구현 체크리스트

- [x] user-classification.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma UserClassificationEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
