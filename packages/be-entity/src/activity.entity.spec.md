# Activity Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/activity.entity.ts

## 역할

루틴(Routine)과 태스크(Task)를 연결하는 중간 엔티티입니다. 루틴 내 특정 태스크의 수행 순서, 반복 횟수, 휴식 시간 등 운동/훈련 관련 세부 정보를 담습니다. 루틴을 구성하는 개별 활동 단위를 나타냅니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| routineId | string | FK, required | - | 소속 루틴 ID |
| taskId | string | FK, required | - | 연결된 태스크 ID |
| order | number | required | - | 루틴 내 실행 순서 |
| repetitions | number | required | - | 반복 횟수 |
| restTime | number | required | - | 휴식 시간 (초) |
| notes | string \| null | nullable | null | 메모 |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| routine | Routine | ManyToOne | 소속 루틴 |
| task | Task | ManyToOne | 연결된 태스크 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- `order` 필드로 루틴 내 활동 실행 순서를 제어합니다.
- `repetitions`는 해당 태스크의 반복 횟수를 의미합니다.
- `restTime`은 초 단위로 저장됩니다.
- 동일한 태스크가 하나의 루틴에 여러 번 포함될 수 있습니다 (다른 order로 구분).

## 구현 체크리스트

- [x] activity.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma ActivityEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
