# Routine Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/routine.entity.ts

## 역할

운동/훈련 루틴을 정의하는 엔티티입니다. 여러 Activity(태스크 + 순서/반복/휴식)의 집합으로 구성되며, Program을 통해 세션에 연결됩니다. 루틴은 재사용 가능한 운동 계획의 단위입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 루틴 이름 |
| label | string | required | - | 루틴 라벨 |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| programs | Program[] | OneToMany | 이 루틴을 사용하는 프로그램 목록 |
| activities | Activity[] | OneToMany | 루틴을 구성하는 활동 목록 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 루틴은 여러 Activity로 구성되며, Activity의 `order` 필드로 실행 순서를 결정합니다.
- 하나의 루틴이 여러 Program(세션)에서 재사용될 수 있습니다.
- `label`은 `name`과 달리 표시용 짧은 라벨입니다.

## 구현 체크리스트

- [x] routine.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma RoutineEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
