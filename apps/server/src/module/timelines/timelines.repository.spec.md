# Timelines Repository 기획서

> 생성일: 2026-02-19
> 타입: repository
> 위치: apps/server/src/module/timelines/timelines.repository.ts

## 역할

타임라인(Timeline)과 세션(Session) 모델에 대한 Prisma 쿼리를 담당합니다. 데이터 접근 로직을 캡슐화하며, Service 레이어에서 직접 Prisma를 호출하지 않도록 합니다.

## 의존성

| 서비스 | 역할 |
|--------|------|
| `PrismaService` | Prisma 클라이언트 |

## 타임라인 쿼리 메서드

### findManyTimelines(params)

- **파라미터**: `{ spaceId: string, skip: number, take: number, search?: string }`
- **반환값**: `[Timeline[], number]` (데이터, 전체 수)
- **Prisma 쿼리**:
  ```typescript
  prisma.timeline.findManyAndCount({
    where: {
      spaceId,
      removedAt: null,
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    include: {
      _count: { select: { sessions: { where: { removedAt: null } } } },
      creator: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  })
  ```

### findTimelineById(timelineId, spaceId)

- **파라미터**: `timelineId: string, spaceId: string`
- **반환값**: `Timeline | null`
- **Prisma 쿼리**:
  ```typescript
  prisma.timeline.findFirst({
    where: { id: timelineId, spaceId, removedAt: null },
    include: {
      creator: { select: { id: true, name: true } },
      space: { select: { id: true, name: true } },
      _count: { select: { sessions: { where: { removedAt: null } } } },
    },
  })
  ```

### createTimeline(data)

- **파라미터**: `{ name, description, spaceId, creatorId }`
- **반환값**: `Timeline`
- **Prisma**: `prisma.timeline.create({ data })`

### updateTimeline(timelineId, data)

- **파라미터**: `timelineId: string, { name?, description? }`
- **반환값**: `Timeline`
- **Prisma**: `prisma.timeline.update({ where: { id: timelineId }, data })`

### softDeleteTimeline(timelineId)

- **파라미터**: `timelineId: string`
- **반환값**: `void`
- **Prisma**: `prisma.timeline.update({ where: { id: timelineId }, data: { removedAt: new Date() } })`

### countTimelinesWithName(name, spaceId, excludeId?)

- **파라미터**: `name: string, spaceId: string, excludeId?: string`
- **반환값**: `number`
- **용도**: 이름 중복 확인

## 세션 쿼리 메서드

### findManySessions(timelineId, params)

- **파라미터**: `timelineId: string, { skip: number, take: number, search?: string }`
- **반환값**: `[Session[], number]`
- **Prisma 쿼리**:
  ```typescript
  prisma.session.findManyAndCount({
    where: {
      timelineId,
      removedAt: null,
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
    },
    include: {
      _count: { select: { programs: { where: { removedAt: null } } } },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  })
  ```

### findSessionById(timelineId, sessionId)

- **파라미터**: `timelineId: string, sessionId: string`
- **반환값**: `Session | null`
- **Prisma 쿼리**:
  ```typescript
  prisma.session.findFirst({
    where: { id: sessionId, timelineId, removedAt: null },
    include: {
      timeline: { select: { id: true, name: true } },
      _count: { select: { programs: { where: { removedAt: null } } } },
    },
  })
  ```

### createSession(data)

- **파라미터**: `{ name, type, timelineId, description?, startDateTime?, endDateTime?, recurringDayOfWeek?, repeatCycleType? }`
- **반환값**: `Session`
- **Prisma**: `prisma.session.create({ data })`

### updateSession(sessionId, data)

- **파라미터**: `sessionId: string, Partial<CreateSessionData>`
- **반환값**: `Session`
- **Prisma**: `prisma.session.update({ where: { id: sessionId }, data })`

### softDeleteSession(sessionId)

- **파라미터**: `sessionId: string`
- **반환값**: `void`
- **Prisma**: `prisma.session.update({ where: { id: sessionId }, data: { removedAt: new Date() } })`

## 구현 체크리스트

- [ ] timelines.repository.ts
- [ ] findManyAndCount 패턴 (Prisma transaction 활용)
- [ ] 소프트 삭제 필터 (`removedAt: null`) 일관 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | be-spec-planner |
