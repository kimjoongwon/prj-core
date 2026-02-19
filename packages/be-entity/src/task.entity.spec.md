# Task Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/task.entity.ts

## 역할

운동/훈련 태스크를 나타내는 엔티티입니다. 루틴(Routine)에서 Activity를 통해 참조되며, 각 태스크에는 하나의 Exercise(운동 세부 정보)가 연결됩니다. Space 단위로 격리되며 테넌트별로 관리됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| tenantId | string | required | - | 테넌트 ID |
| spaceId | string | FK, required | - | 소속 공간 ID |
| creatorId | string \| null | FK, nullable | null | 생성자 사용자 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| space | Space | ManyToOne | 소속 공간 |
| creator | User | ManyToOne | 생성자 |
| exercise | Exercise | OneToOne | 연결된 운동 세부 정보 |
| activities | Activity[] | OneToMany | 이 태스크를 포함하는 활동 목록 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 각 태스크에는 하나의 Exercise가 연결됩니다 (OneToOne).
- Space 단위로 태스크가 격리됩니다.
- `creatorId`가 null인 경우 시스템 생성 태스크입니다.
- 하나의 태스크가 여러 루틴에서 재사용될 수 있습니다 (Activity를 통해).

## 구현 체크리스트

- [x] task.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma TaskEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
