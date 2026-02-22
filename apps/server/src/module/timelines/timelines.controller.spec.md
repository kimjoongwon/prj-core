# Timelines Controller 기획서

> 생성일: 2026-02-19
> 타입: controller
> 위치: apps/server/src/module/timelines/timelines.controller.ts

## 역할

타임라인(Timeline), 세션(Session), 프로그램(Program) 리소스에 대한 CRUD REST API를 제공합니다. 현재 Space 기반으로 데이터를 필터링하며, CLS를 통해 요청 컨텍스트를 관리합니다.

## 베이스 경로

`/api/v1/timelines`

## 의존성

| 서비스 | 역할 |
|--------|------|
| `TimelinesService` | 타임라인/세션/프로그램 비즈니스 로직 (CRUD) |
| `ClsService` | 요청 컨텍스트 (SPACE_ID, AUTH_USER) 접근 |

## 엔드포인트

| Method | 경로 | Operation ID | Query/Body DTO | 반환값 | Status | 설명 |
|--------|------|-------------|----------------|--------|--------|------|
| GET | `/` | `getTimelines` | `QueryTimelinesDto` | `TimelineDto[]` + meta + stats | 200 | 타임라인 목록 조회 |
| GET | `/:timelineId` | `getTimelineById` | - (Path: timelineId UUID) | `TimelineDetailDto` | 200 | 타임라인 상세 조회 |
| POST | `/` | `createTimeline` | `CreateTimelineDto` | `TimelineDto` | 201 | 타임라인 등록 |
| PATCH | `/:timelineId` | `updateTimeline` | `UpdateTimelineDto` (Path: timelineId UUID) | `TimelineDto` | 200 | 타임라인 수정 |
| DELETE | `/:timelineId` | `deleteTimeline` | - (Path: timelineId UUID) | void | 204 | 타임라인 삭제 (Soft Delete) |

## 중첩 리소스: Sessions

| Method | 경로 | Operation ID | Query/Body DTO | 반환값 | Status | 설명 |
|--------|------|-------------|----------------|--------|--------|------|
| GET | `/:timelineId/sessions` | `getSessions` | `QuerySessionsDto` | `SessionDto[]` + meta | 200 | 세션 목록 조회 |
| GET | `/:timelineId/sessions/:sessionId` | `getSessionById` | - | `SessionDetailDto` | 200 | 세션 상세 조회 |
| POST | `/:timelineId/sessions` | `createSession` | `CreateSessionDto` | `SessionDto` | 201 | 세션 등록 |
| PATCH | `/:timelineId/sessions/:sessionId` | `updateSession` | `UpdateSessionDto` | `SessionDto` | 200 | 세션 수정 |
| DELETE | `/:timelineId/sessions/:sessionId` | `deleteSession` | - | void | 204 | 세션 삭제 (Soft Delete) |

## 중첩 리소스: Programs (세션 하위)

| Method | 경로 | Operation ID | Query/Body DTO | 반환값 | Status | 설명 |
|--------|------|-------------|----------------|--------|--------|------|
| GET | `/:timelineId/sessions/:sessionId/programs` | `getPrograms` | `QueryProgramDto` | `ProgramDto[]` + meta | 200 | 프로그램 목록 조회 |
| GET | `/:timelineId/sessions/:sessionId/programs/:programId` | `getProgramById` | - | `ProgramDto` | 200 | 프로그램 상세 조회 |
| POST | `/:timelineId/sessions/:sessionId/programs` | `createProgram` | `CreateProgramDto` | `ProgramDto` | 201 | 프로그램 등록 |
| PATCH | `/:timelineId/sessions/:sessionId/programs/:programId` | `updateProgram` | `UpdateProgramDto` | `ProgramDto` | 200 | 프로그램 수정 |
| DELETE | `/:timelineId/sessions/:sessionId/programs/:programId` | `deleteProgram` | - | void | 204 | 프로그램 삭제 (Soft Delete) |

## 엔드포인트 상세

### GET / - 타임라인 목록 조회

- **Query DTO**: `QueryTimelinesDto` (skip, take, search, spaceId)
- **응답 구조**: `wrapResponse(timelines, { meta, stats })`
  - `meta`: `{ total, skip, take, totalPages }` (`TimelinePaginationMetaDto`)
  - `stats`: `{ total }` (`TimelineStatsDto`)
- **Space 필터**: 현재 Space의 타임라인만 반환
- **메시지 키**: `common.timeline.list.success`

### GET /:timelineId - 타임라인 상세 조회

- **Path Param**: `timelineId` (UUID, ParseUUIDPipe 적용)
- **응답**: `TimelineDetailDto` (sessionsCount, creator 포함)
- **메시지 키**: `common.timeline.read.success`

### POST / - 타임라인 등록

- **Body DTO**: `CreateTimelineDto`
  - 필수: `name`
  - 선택: `description`
- **Space 주입**: 현재 Space에 타임라인 등록
- **creatorId 주입**: 현재 로그인 사용자 ID
- **메시지 키**: `common.timeline.create.success`

### PATCH /:timelineId - 타임라인 수정

- **Body DTO**: `UpdateTimelineDto`
  - 선택: `name`, `description`
- **Partial Update**: 전달된 필드만 수정
- **메시지 키**: `common.timeline.update.success`

### DELETE /:timelineId - 타임라인 삭제

- **Soft Delete**: `removedAt` 필드 설정
- **제약**: 세션이 있는 타임라인 삭제 불가
- **응답**: 204 No Content (body 없음)
- **메시지 키**: `common.timeline.delete.success`

### POST /:timelineId/sessions - 세션 등록

- **Body DTO**: `CreateSessionDto`
  - 필수: `name`, `type`
  - 조건부 필수:
    - ONE_TIME: `startDateTime`
    - ONE_TIME_RANGE: `startDateTime`, `endDateTime`
    - RECURRING: `recurringDayOfWeek`, `repeatCycleType`
  - 선택: `description`, `startDateTime`(RECURRING), `endDateTime`(RECURRING)
- **timelineId 주입**: URL 파라미터에서 자동 추출
- **메시지 키**: `common.session.create.success`

### PATCH /:timelineId/sessions/:sessionId - 세션 수정

- **Body DTO**: `UpdateSessionDto` (CreateSessionDto의 모든 필드를 optional로)
- **유형 변경 허용**: 유형 변경 시 기존 날짜/요일 필드 null 처리
- **메시지 키**: `common.session.update.success`

### DELETE /:timelineId/sessions/:sessionId - 세션 삭제

- **제약**: 프로그램이 연결된 세션 삭제 불가
- **응답**: 204 No Content
- **메시지 키**: `common.session.delete.success`

### GET /:timelineId/sessions/:sessionId/programs - 프로그램 목록 조회

- **Path Params**: `timelineId` (UUID), `sessionId` (UUID)
- **Query DTO**: `QueryProgramDto` (skip, take)
- **응답 구조**: `wrapResponse(programs, { meta })`
  - `meta`: `{ total, skip, take, totalPages }`
- **필터**: 해당 세션의 프로그램만 반환 (removedAt: null)
- **메시지 키**: `common.program.list.success`

### GET /:timelineId/sessions/:sessionId/programs/:programId - 프로그램 상세 조회

- **Path Params**: `timelineId`, `sessionId`, `programId` (UUID)
- **응답**: `ProgramDto` (routine, session 관계 포함)
- **메시지 키**: `common.program.read.success`

### POST /:timelineId/sessions/:sessionId/programs - 프로그램 등록

- **Body DTO**: `CreateProgramDto`
  - 필수: `name`, `routineId`, `instructorId`, `capacity`
  - 선택: `level`
- **sessionId 주입**: URL 파라미터에서 자동 추출
- **비즈니스 제약**: 같은 세션 내 동일 루틴 중복 불가
- **메시지 키**: `common.program.create.success`

### PATCH /:timelineId/sessions/:sessionId/programs/:programId - 프로그램 수정

- **Body DTO**: `UpdateProgramDto` (모든 필드 optional)
- **Partial Update**: 전달된 필드만 수정
- **비즈니스 제약**: routineId 변경 시 세션 내 중복 확인
- **메시지 키**: `common.program.update.success`

### DELETE /:timelineId/sessions/:sessionId/programs/:programId - 프로그램 삭제

- **Soft Delete**: `removedAt` 필드 설정
- **응답**: 204 No Content
- **메시지 키**: `common.program.delete.success`

## 인증/인가

| 엔드포인트 | 인증 필요 | X-Space-ID 필요 | 특별 조건 |
|------------|----------|-----------------|-----------|
| GET / | O (`@ApiAuth`) | O | - |
| GET /:timelineId | O (`@ApiAuth`) | O | - |
| POST / | O (`@ApiAuth`) | O | - |
| PATCH /:timelineId | O (`@ApiAuth`) | O | - |
| DELETE /:timelineId | O (`@ApiAuth`) | O | 세션 존재 시 삭제 불가 |
| GET /:timelineId/sessions | O (`@ApiAuth`) | O | - |
| GET /:timelineId/sessions/:sessionId | O (`@ApiAuth`) | O | - |
| POST /:timelineId/sessions | O (`@ApiAuth`) | O | - |
| PATCH /:timelineId/sessions/:sessionId | O (`@ApiAuth`) | O | - |
| DELETE /:timelineId/sessions/:sessionId | O (`@ApiAuth`) | O | 프로그램 연결 시 삭제 불가 |
| GET /:timelineId/sessions/:sessionId/programs | O (`@ApiAuth`) | O | - |
| GET /:timelineId/sessions/:sessionId/programs/:programId | O (`@ApiAuth`) | O | - |
| POST /:timelineId/sessions/:sessionId/programs | O (`@ApiAuth`) | O | 루틴 중복 불가 |
| PATCH /:timelineId/sessions/:sessionId/programs/:programId | O (`@ApiAuth`) | O | 루틴 변경 시 중복 확인 |
| DELETE /:timelineId/sessions/:sessionId/programs/:programId | O (`@ApiAuth`) | O | - |

## 에러 처리

| 상황 | 상태 코드 | 에러 메시지 상수 |
|------|-----------|-----------------|
| 타임라인 미발견 | 404 | `TIMELINE_ERRORS.TIMELINE_NOT_FOUND` |
| 세션 미발견 | 404 | `TIMELINE_ERRORS.SESSION_NOT_FOUND` |
| 프로그램 미발견 | 404 | `TIMELINE_ERRORS.PROGRAM_NOT_FOUND` |
| 세션이 있는 타임라인 삭제 | 400 | `TIMELINE_ERRORS.TIMELINE_HAS_SESSIONS` |
| 프로그램 연결 세션 삭제 | 400 | `TIMELINE_ERRORS.SESSION_HAS_PROGRAMS` |
| 세션 내 루틴 중복 프로그램 등록 | 400 | `TIMELINE_ERRORS.PROGRAM_ROUTINE_DUPLICATED` |
| Space 미선택 | 401 | 공통 에러 |

## DTO 정의 (packages/be-dto)

### Timeline DTO

| DTO | 필드 | 설명 |
|-----|------|------|
| `TimelineDto` | id, name, description, spaceId, creatorId, sessionsCount, createdAt | 목록 응답 |
| `TimelineDetailDto` | TimelineDto + creator(name), space(name) | 상세 응답 |
| `CreateTimelineDto` | name(필수), description(선택) | 등록 |
| `UpdateTimelineDto` | name(선택), description(선택) | 수정 |
| `QueryTimelinesDto` | skip, take, search | 목록 조회 |
| `TimelinePaginationMetaDto` | total, skip, take, totalPages | 페이지네이션 메타 |
| `TimelineStatsDto` | total | 통계 |

### Session DTO

| DTO | 필드 | 설명 |
|-----|------|------|
| `SessionDto` | id, name, type, startDateTime, endDateTime, recurringDayOfWeek, repeatCycleType, timelineId, programsCount, createdAt | 목록 응답 |
| `SessionDetailDto` | SessionDto + timeline(name, id) | 상세 응답 |
| `CreateSessionDto` | name(필수), type(필수), description(선택), startDateTime(조건), endDateTime(조건), recurringDayOfWeek(조건), repeatCycleType(조건) | 등록 |
| `UpdateSessionDto` | CreateSessionDto의 모든 필드를 optional | 수정 |
| `QuerySessionsDto` | skip, take, search | 목록 조회 |

### Program DTO

| DTO | 필드 | 설명 |
|-----|------|------|
| `ProgramDto` | id, name, routineId, sessionId, instructorId, capacity, level, routine(name), session(name), createdAt | 응답 |
| `CreateProgramDto` | name(필수), routineId(필수), instructorId(필수), capacity(필수), level(선택) | 등록 |
| `UpdateProgramDto` | CreateProgramDto의 모든 필드를 optional | 수정 |
| `QueryProgramDto` | skip, take | 목록 조회 |

## Swagger 데코레이터

- `@ApiTags("TIMELINES")`: API 태그
- `@ApiAuth()`: 인증 필요 표시
- `@ApiResponseEntity()`: 성공 응답 문서화
- `@ResponseMessage()`: 응답 메시지 키

## 구현 체크리스트

- [ ] timelines.controller.ts (Programs 엔드포인트 추가)
- [ ] timelines.service.ts (Program 메서드 추가)
- [ ] timelines.repository.ts (Program 쿼리 메서드 추가)
- [ ] timelines.module.ts
- [ ] DTO 확인 (packages/be-dto - 이미 구현됨)
- [ ] TIMELINE_ERRORS에 PROGRAM_NOT_FOUND, PROGRAM_ROUTINE_DUPLICATED 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-api-planner |
| 2026-02-19 | Programs 중첩 리소스 엔드포인트 추가 | orch-requirement |
