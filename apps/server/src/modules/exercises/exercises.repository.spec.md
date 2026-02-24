# Exercises Repository 기획서

> 생성일: 2026-02-19
> 타입: repository
> 위치: apps/server/src/module/exercises/exercises.repository.ts

## 역할

운동 종목(Exercise)과 태스크(Task) 모델에 대한 Prisma 쿼리를 담당합니다. Space 계층 공유(spaceScope)를 지원하며, Exercise 등록 시 Task를 함께 생성하는 트랜잭션 로직을 포함합니다.

## 의존성

| 서비스 | 역할 |
|--------|------|
| `PrismaService` | Prisma 클라이언트 |

## Exercise 쿼리 메서드

### findManyExercises(params)

- **파라미터**: `{ spaceIds: string[], skip: number, take: number, search?: string }`
- **반환값**: `[Exercise[], number]` (데이터, 전체 수)
- **설명**: `spaceIds` 배열로 여러 Space의 Exercise 조회 (Space 계층 공유 지원)
- **Prisma 쿼리**:
  ```typescript
  prisma.$transaction([
    prisma.exercise.findMany({
      where: {
        removedAt: null,
        task: {
          spaceId: { in: spaceIds },
          removedAt: null,
        },
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      include: {
        task: {
          include: {
            space: { select: { id: true, name: true } },
            creator: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.exercise.count({
      where: {
        removedAt: null,
        task: { spaceId: { in: spaceIds }, removedAt: null },
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
    }),
  ])
  ```

### findExerciseById(exerciseId, spaceIds)

- **파라미터**: `exerciseId: string, spaceIds: string[]`
- **반환값**: `Exercise | null`
- **설명**: 단일 Exercise 조회. spaceIds에 해당하는 Space 소유 운동만 조회
- **Prisma 쿼리**:
  ```typescript
  prisma.exercise.findFirst({
    where: {
      id: exerciseId,
      removedAt: null,
      task: { spaceId: { in: spaceIds }, removedAt: null },
    },
    include: {
      task: {
        include: {
          space: { select: { id: true, name: true } },
          creator: { select: { id: true, name: true } },
        },
      },
    },
  })
  ```

### findExerciseRoutines(exerciseId)

- **파라미터**: `exerciseId: string`
- **반환값**: `Routine[]` - 이 Exercise를 Activity로 포함하는 Routine 목록
- **Prisma 쿼리**:
  ```typescript
  prisma.routine.findMany({
    where: {
      removedAt: null,
      activities: {
        some: {
          removedAt: null,
          task: { exercise: { id: exerciseId } },
        },
      },
    },
    include: {
      task: {
        include: { space: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  ```

### createExerciseWithTask(data)

- **파라미터**: `{ name, duration, count, description?, imageFileId?, videoFileId?, spaceId, creatorId }`
- **반환값**: `Exercise`
- **설명**: Task + Exercise를 트랜잭션으로 동시 생성
- **Prisma 쿼리**:
  ```typescript
  prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: { spaceId, creatorId },
    });
    const exercise = await tx.exercise.create({
      data: {
        name, duration, count, description, imageFileId, videoFileId,
        taskId: task.id,
      },
      include: { task: { include: { space: true } } },
    });
    return exercise;
  })
  ```

### updateExercise(exerciseId, data)

- **파라미터**: `exerciseId: string, { name?, duration?, count?, description?, imageFileId?, videoFileId? }`
- **반환값**: `Exercise`
- **Prisma**: `prisma.exercise.update({ where: { id: exerciseId }, data, include: { task: true } })`

### softDeleteExercise(exerciseId)

- **파라미터**: `exerciseId: string`
- **반환값**: `void`
- **설명**: Exercise와 연결된 Task 모두 소프트 삭제
- **Prisma 쿼리**:
  ```typescript
  prisma.$transaction(async (tx) => {
    const exercise = await tx.exercise.update({
      where: { id: exerciseId },
      data: { removedAt: new Date() },
    });
    await tx.task.update({
      where: { id: exercise.taskId },
      data: { removedAt: new Date() },
    });
  })
  ```

### countActivitiesUsingExercise(exerciseId)

- **파라미터**: `exerciseId: string`
- **반환값**: `number`
- **용도**: 삭제 가능 여부 확인 (Activity에서 사용 중인지)
- **Prisma**:
  ```typescript
  prisma.activity.count({
    where: {
      removedAt: null,
      task: { exercise: { id: exerciseId } },
    },
  })
  ```

## 구현 체크리스트

- [ ] exercises.repository.ts
- [ ] Task+Exercise 동시 생성 트랜잭션
- [ ] Task+Exercise 동시 소프트 삭제 트랜잭션
- [ ] Space 계층 필터 (`spaceId: { in: spaceIds }`)
- [ ] 소프트 삭제 필터 (`removedAt: null`) 일관 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-logic-planner |
