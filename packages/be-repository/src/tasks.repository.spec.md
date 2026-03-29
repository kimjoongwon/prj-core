# Tasks Repository 기획서

> 생성일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/tasks.repository.ts

## 역할

Task aggregate root와 Exercise 1:1 detail을 함께 저장/조회합니다.
Routine/Timeline 서비스가 스케줄 가능 여부를 검증할 수 있도록 다건 조회 계약을 제공합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| TasksRepository | Task aggregate 영속성 접근 |
| findTasksByIds | Routine 작성 시 Task/Exercise schedulable 상태를 일괄 조회 |
| countActivitiesUsingTask | soft delete되지 않은 Routine의 Activity만 사용 중으로 집계 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Task 삭제 가능 여부 집계에서 soft delete된 Routine의 Activity를 제외하도록 `countActivitiesUsingTask` 조건을 보강 | codex |
| 2026-03-29 | Routine 저장 검증을 위해 `findTasksByIds` 다건 조회 계약 추가 | codex |
| 2026-03-11 | Task root repository 신규 생성 | codex |
