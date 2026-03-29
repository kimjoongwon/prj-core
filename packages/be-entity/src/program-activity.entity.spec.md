# ProgramActivity Entity 기획서

> 생성일: 2026-03-29
> 수정일: 2026-03-29
> 타입: entity
> 위치: packages/be-entity/src/program-activity.entity.ts

## 역할

Program이 소유하는 실행 운동 snapshot child entity입니다. Routine의 `Activity`와 Task의 `Exercise` detail을 Program 운영 문맥으로 결합해 당시 실행 계획을 설명합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| programId | string | FK, required | - | 소속 Program ID |
| taskId | string | FK, required | - | 원본 Task ID |
| order | number | required | - | Program 내 실행 순서 |
| repetitions | number | required | - | 반복 횟수 snapshot |
| restTime | number | required | - | 휴식 시간 snapshot |
| notes | string \| null | nullable | null | Routine 메모 snapshot |
| exerciseName | string | required | - | 당시 운동명 snapshot |
| exerciseDescription | string \| null | nullable | null | 당시 운동 설명 snapshot |
| exerciseDuration | number | required | - | 당시 운동 시간 snapshot |
| exerciseCount | number | required | - | 당시 운동 횟수 snapshot |
| imageFileId | string \| null | nullable | null | 당시 이미지 자산 ID snapshot |
| videoFileId | string \| null | nullable | null | 당시 영상 자산 ID snapshot |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| program | Program | ManyToOne | 실행 계획을 소유하는 Program aggregate root |

## 비즈니스 규칙

- `ProgramActivity`는 외부 공개 CRUD 대상이 아니라 `Program` lifecycle에 종속됩니다.
- `order`, `repetitions`, `restTime`, `notes`는 Routine `Activity`에서 유래합니다.
- 운동명/설명/시간/횟수/미디어 식별자는 Exercise에서 유래한 snapshot입니다.
- 하나의 Program 안에서는 동일 `taskId` snapshot을 중복 보관하지 않습니다.
- Program 생성 후 원본 Routine/Exercise가 변경되어도 `ProgramActivity`는 바뀌지 않습니다.

## 구현 체크리스트

- [x] program-activity.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma ProgramActivity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Program 실행 운동 snapshot child entity 신규 추가 | codex |
