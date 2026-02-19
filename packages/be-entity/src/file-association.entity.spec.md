# FileAssociation Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/file-association.entity.ts

## 역할

파일(File)과 그룹(Group)을 연결하는 중간 엔티티입니다. 그룹에 속한 파일 목록을 관리하거나, 파일이 어떤 그룹에 속하는지 추적하는 다대다 관계 테이블입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| groupId | string | FK, required | - | 그룹 ID |
| fileId | string | FK, required | - | 파일 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| file | File (Prisma) | ManyToOne | 연결된 파일 |
| group | Group (Prisma) | ManyToOne | 연결된 그룹 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- groupId + fileId 조합은 유니크해야 합니다 (동일 파일의 동일 그룹 중복 연결 불가).
- 소프트 삭제를 통해 연결 이력을 보존합니다.

## 구현 체크리스트

- [x] file-association.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma FileAssociationEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
