# UserAssociation Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/user-association.entity.ts

## 역할

사용자(User)와 그룹(Group)을 연결하는 중간 엔티티입니다. 사용자를 그룹에 소속시키는 다대다 관계 테이블로, 사용자 그룹 관리 시스템에서 활용됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| userId | string | FK, required | - | 사용자 ID |
| groupId | string | FK, required | - | 그룹 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| group | Group | ManyToOne | 연결된 그룹 |
| user | User | ManyToOne | 연결된 사용자 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- userId + groupId 조합은 유니크해야 합니다 (동일 사용자의 동일 그룹 중복 연결 불가).
- 소프트 삭제를 통해 사용자-그룹 연결 이력을 보존합니다.
- Group의 `GroupTypes`가 사용자 그룹에 해당하는 유형인 경우에만 연결됩니다.

## 구현 체크리스트

- [x] user-association.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma UserAssociationEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
