# Exercises Service 기획서

> 생성일: 2026-02-19
> 타입: service
> 위치: apps/server/src/module/exercises/exercises.service.ts

## 역할

운동 종목(Exercise) 도메인의 비즈니스 로직을 담당합니다. Repository를 통해 데이터에 접근하며, Space 계층 공유(spaceScope), Activity 사용 여부 확인, Task 연동 생성 등 비즈니스 규칙을 처리합니다.

## 의존성

| 서비스/Repository | 역할 |
|----------|------|
| `ExercisesRepository` | Exercise/Task 데이터 접근 |
| `SpaceContext` | 현재 Space 및 상위 Space ID 목록 조회 (`@cocrepo/be-common`) |

## 메서드

### findExercises(params)

- **파라미터**: `{ spaceId: string, spaceScope: "CURRENT" | "INCLUDE_ANCESTORS", skip: number, take: number, search?: string }`
- **반환값**: `{ exercises: Exercise[], total: number }`
- **로직**:
  1. `spaceScope`에 따라 조회할 `spaceIds` 결정
     - `CURRENT`: `[spaceId]`
     - `INCLUDE_ANCESTORS`: `SpaceContext.spaceIds` (현재 + 상위 모든 Space ID)
  2. `exercisesRepository.findManyExercises({ spaceIds, skip, take, search })` 호출
  3. `{ exercises, total }` 반환

### findExerciseById(exerciseId, spaceId, spaceScope)

- **파라미터**: `exerciseId: string, spaceId: string, spaceScope?: "CURRENT" | "INCLUDE_ANCESTORS"`
- **반환값**: `ExerciseDetailDto`
- **로직**:
  1. `spaceScope`에 따라 `spaceIds` 결정 (기본: `INCLUDE_ANCESTORS`)
  2. `exercisesRepository.findExerciseById(exerciseId, spaceIds)` 호출
  3. 없으면 `NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND)`
  4. 상세 정보(task.space, task.creator) 포함 반환

### findExerciseRoutines(exerciseId, spaceId)

- **파라미터**: `exerciseId: string, spaceId: string`
- **반환값**: `Routine[]`
- **로직**:
  1. Exercise 존재 확인 (없으면 404)
  2. `exercisesRepository.findExerciseRoutines(exerciseId)` 호출
  3. 이 Exercise를 Activity로 포함하는 루틴 목록 반환

### createExercise(dto, spaceId, creatorId)

- **파라미터**: `CreateExerciseDto, spaceId: string, creatorId: string`
- **반환값**: `Exercise`
- **로직**:
  1. `exercisesRepository.createExerciseWithTask({ ...dto, spaceId, creatorId })` 호출
  2. Task + Exercise 동시 생성 (트랜잭션)
  3. 생성된 Exercise 반환

### updateExercise(exerciseId, dto, spaceId)

- **파라미터**: `exerciseId: string, UpdateExerciseDto, spaceId: string`
- **반환값**: `Exercise`
- **로직**:
  1. Exercise 존재 확인 + 현재 Space 소유 확인 (`task.spaceId === spaceId`)
  2. 타 Space 소유이면 `ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED)`
  3. `exercisesRepository.updateExercise(exerciseId, dto)` 호출

### deleteExercise(exerciseId, spaceId)

- **파라미터**: `exerciseId: string, spaceId: string`
- **반환값**: `void`
- **로직**:
  1. Exercise 존재 확인 + 현재 Space 소유 확인
  2. 타 Space 소유이면 `ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED)`
  3. Activity 사용 여부 확인: `exercisesRepository.countActivitiesUsingExercise(exerciseId)`
  4. Activity 사용 중이면 `ConflictException(EXERCISE_ERRORS.EXERCISE_IN_USE)`
  5. `exercisesRepository.softDeleteExercise(exerciseId)` 호출 (Task + Exercise 소프트 삭제)

## 비즈니스 규칙

- **Space 계층 공유**: `spaceScope=INCLUDE_ANCESTORS`이면 현재 Space + 모든 상위 Space의 운동 조회 가능
- **수정/삭제 권한**: 현재 Space가 소유한 Exercise(task.spaceId === currentSpaceId)만 수정/삭제 가능
- **Activity 사용 제약**: Activity에서 사용 중인 Exercise는 삭제 불가
- **Task 연동**: Exercise 생성/삭제 시 Task를 항상 함께 처리 (트랜잭션)
- **미디어 제거**: `imageFileId: null` 또는 `videoFileId: null` 전송 시 해당 파일 ID 제거

## 에러 상수 (EXERCISE_ERRORS)

| 상수 | HTTP | 설명 |
|------|------|------|
| `EXERCISE_NOT_FOUND` | 404 | Exercise 미발견 |
| `EXERCISE_NOT_OWNED` | 403 | 현재 Space 소유 운동이 아님 (수정/삭제 불가) |
| `EXERCISE_IN_USE` | 409 | Activity에서 사용 중인 운동 삭제 시도 |

## 구현 체크리스트

- [ ] exercises.service.ts
- [ ] EXERCISE_ERRORS 상수 정의
- [ ] spaceScope 분기 로직 (CURRENT / INCLUDE_ANCESTORS)
- [ ] Space 소유 검증 (수정/삭제 시)
- [ ] Activity 사용 여부 확인 (삭제 시)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | be-spec-planner |
