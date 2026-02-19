# Session Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/session.entity.ts

## 역할

타임라인(Timeline) 내의 수업 세션을 정의하는 엔티티입니다. 1회성(ONCE) 또는 반복(RECURRING) 세션 유형을 지원하며, 반복 세션의 경우 요일과 반복 주기를 지정합니다. 세션에는 여러 Program이 연결됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 세션 이름 |
| description | string \| null | nullable | null | 세션 설명 |
| type | SessionTypes | required | - | 세션 유형 (1회성/반복) |
| repeatCycleType | RepeatCycleTypes \| null | nullable | null | 반복 주기 유형 (DAILY, WEEKLY 등) |
| startDateTime | Date \| null | nullable | null | 시작 일시 |
| endDateTime | Date \| null | nullable | null | 종료 일시 |
| recurringDayOfWeek | RecurringDayOfWeek \| null | nullable | null | 반복 요일 (반복 세션인 경우) |
| timelineId | string | FK, required | - | 소속 타임라인 ID |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| SessionTypes | (Prisma 정의) | 세션 유형 (ONCE: 1회성, RECURRING: 반복) |
| RepeatCycleTypes | (Prisma 정의) | 반복 주기 유형 (DAILY, WEEKLY, MONTHLY 등) |
| RecurringDayOfWeek | (Prisma 정의) | 반복 요일 (MON, TUE, WED, THU, FRI, SAT, SUN) |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| programs | Program[] | OneToMany | 세션 내 프로그램 목록 |
| timeline | Timeline | ManyToOne | 소속 타임라인 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- `type=ONCE`이면 1회성 세션으로 `startDateTime`과 `endDateTime`으로 시간을 지정합니다.
- `type=RECURRING`이면 반복 세션으로 `repeatCycleType`과 `recurringDayOfWeek`를 지정합니다.
- 반복 세션의 경우 `startDateTime`과 `endDateTime`은 선택 사항입니다.
- 하나의 세션에 여러 Program(강사별)이 연결될 수 있습니다.

## 구현 체크리스트

- [x] session.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma SessionEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
