# Program Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/program.entity.ts

## 역할

세션(Session)과 루틴(Routine)을 연결하는 수업/프로그램 엔티티입니다. 특정 세션에서 진행되는 수업 프로그램을 나타내며, 담당 강사 ID, 수강 인원, 수업 이름, 난이도 수준 등의 정보를 포함합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| routineId | string | FK, required | - | 연결된 루틴 ID |
| sessionId | string | FK, required | - | 소속 세션 ID |
| instructorId | string | FK, required | - | 담당 강사 사용자 ID |
| capacity | number | required | - | 최대 수강 인원 |
| name | string | required | - | 프로그램 이름 |
| level | string \| null | nullable | null | 난이도 수준 |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| routine | Routine | ManyToOne | 연결된 루틴 |
| session | Session | ManyToOne | 소속 세션 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- `instructorId`는 User의 ID를 참조하며, 해당 강사가 이 프로그램을 진행합니다.
- `capacity`는 프로그램의 최대 수강 인원 제한입니다.
- `level`은 초급/중급/고급 등 임의 문자열로 설정 가능합니다.
- 세션이 삭제되면 연관된 프로그램도 처리되어야 합니다.

## 구현 체크리스트

- [x] program.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma ProgramEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
