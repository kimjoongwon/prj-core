# FileClassification Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/file-classification.entity.ts

## 역할

파일(File)과 카테고리(Category)를 연결하는 중간 엔티티입니다. 파일을 카테고리로 분류하는 다대다 관계 테이블로, 파일이 어떤 카테고리에 속하는지 추적합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| categoryId | string | FK, required | - | 카테고리 ID |
| fileId | string | FK, required | - | 파일 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| category | Category | ManyToOne | 연결된 카테고리 |
| file | File | ManyToOne | 연결된 파일 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- categoryId + fileId 조합은 유니크해야 합니다 (동일 파일의 동일 카테고리 중복 분류 불가).
- 카테고리는 `CategoryTypes`로 파일 전용 카테고리만 사용합니다.
- 소프트 삭제를 통해 분류 이력을 보존합니다.

## 구현 체크리스트

- [x] file-classification.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma FileClassificationEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
