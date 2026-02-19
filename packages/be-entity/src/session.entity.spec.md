# Session Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/session.entity.ts

## 역할

타임라인(Timeline) 내의 수업 세션을 정의하는 엔티티입니다. 세 가지 유형(일회성/기간형/반복형)을 지원하며, 유형에 따라 날짜/시간 필드 사용 방식이 달라집니다. 세션에는 여러 Program이 연결됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 세션 이름 |
| description | string \| null | nullable | null | 세션 설명 |
| type | SessionTypes | required | ONE_TIME | 세션 유형 |
| repeatCycleType | RepeatCycleTypes \| null | nullable | null | 반복 주기 유형 (RECURRING 시 사용) |
| startDateTime | Date \| null | nullable | null | 시작 일시 |
| endDateTime | Date \| null | nullable | null | 종료 일시 (ONE_TIME_RANGE/RECURRING 선택) |
| recurringDayOfWeek | RecurringDayOfWeek \| null | nullable | null | 반복 요일 (RECURRING 시 사용) |
| timelineId | string | FK, required | - | 소속 타임라인 ID |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| SessionTypes | ONE_TIME | 일회성 특강 (startDateTime 단일 지정) |
| SessionTypes | ONE_TIME_RANGE | 기간형 집중 프로그램 (startDateTime + endDateTime) |
| SessionTypes | RECURRING | 정기 반복 클래스 (recurringDayOfWeek + repeatCycleType) |
| RepeatCycleTypes | WEEKLY | 주간 반복 |
| RepeatCycleTypes | MONTHLY | 월간 반복 |
| RecurringDayOfWeek | MON, TUE, WED, THU, FRI, SAT, SUN | 반복 요일 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| programs | Program[] | OneToMany | 세션 내 프로그램 목록 |
| timeline | Timeline | ManyToOne | 소속 타임라인 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- **ONE_TIME**: `startDateTime` 하나만 사용. 특강처럼 단일 일시를 지정.
- **ONE_TIME_RANGE**: `startDateTime`과 `endDateTime` 모두 사용. 집중 프로그램처럼 기간을 지정. `endDateTime > startDateTime` 제약.
- **RECURRING**: `recurringDayOfWeek`(요일)와 `repeatCycleType`(주간/월간)을 사용. `startDateTime`, `endDateTime`은 선택적으로 반복 범위를 한정.
- 하나의 세션에 여러 Program(강사별 개설 클래스)이 연결될 수 있음.
- 소프트 삭제를 통해 세션 삭제 이력을 보존.

## 구현 체크리스트

- [x] session.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma SessionEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | SessionTypes Enum 값 수정 (ONCE→ONE_TIME, ONE_TIME_RANGE 추가), 비즈니스 규칙 상세화 | req-entity-planner |
