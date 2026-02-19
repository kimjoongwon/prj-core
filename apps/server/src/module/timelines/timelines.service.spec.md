# Timelines Service 기획서

> 생성일: 2026-02-19
> 타입: service
> 위치: apps/server/src/module/timelines/timelines.service.ts

## 역할

타임라인(Timeline)과 세션(Session) 도메인의 비즈니스 로직을 담당합니다. Repository를 통해 데이터에 접근하며, 비즈니스 규칙 검증 및 관련 엔티티 조합을 처리합니다.

## 의존성

| 서비스/Repository | 역할 |
|----------|------|
| `TimelinesRepository` | 타임라인/세션 데이터 접근 |

## 타임라인 메서드

### findTimelines(params)

- **파라미터**: `{ spaceId: string, skip: number, take: number, search?: string }`
- **반환값**: `{ timelines: Timeline[], total: number }`
- **로직**:
  1. 현재 Space의 타임라인 목록 조회
  2. name으로 검색 가능 (LIKE 검색)
  3. 각 타임라인의 `_count.sessions` 포함
  4. `createdAt` 내림차순 정렬

### findTimelineById(timelineId, spaceId)

- **파라미터**: `timelineId: string, spaceId: string`
- **반환값**: `TimelineDetailDto`
- **로직**:
  1. timelineId + spaceId로 타임라인 조회
  2. creator, space 관계 포함
  3. 없으면 `NotFoundException(TIMELINE_ERRORS.TIMELINE_NOT_FOUND)`

### createTimeline(dto, spaceId, creatorId)

- **파라미터**: `CreateTimelineDto, spaceId: string, creatorId: string`
- **반환값**: `Timeline`
- **로직**:
  1. 같은 Space 내 이름 중복 확인
  2. 중복 시 `BadRequestException(TIMELINE_ERRORS.TIMELINE_NAME_DUPLICATED)`
  3. 타임라인 생성

### updateTimeline(timelineId, dto, spaceId)

- **파라미터**: `timelineId: string, UpdateTimelineDto, spaceId: string`
- **반환값**: `Timeline`
- **로직**:
  1. 타임라인 존재 및 Space 소유 확인
  2. name 변경 시 중복 확인 (자기 자신 제외)
  3. 업데이트 실행

### deleteTimeline(timelineId, spaceId)

- **파라미터**: `timelineId: string, spaceId: string`
- **반환값**: `void`
- **로직**:
  1. 타임라인 존재 확인
  2. 세션 수 확인 (`_count.sessions > 0`)
  3. 세션 있으면 `BadRequestException(TIMELINE_ERRORS.TIMELINE_HAS_SESSIONS)`
  4. Soft Delete (`removedAt` 설정)

## 세션 메서드

### findSessions(timelineId, params)

- **파라미터**: `timelineId: string, { skip: number, take: number, search?: string }`
- **반환값**: `{ sessions: Session[], total: number }`
- **로직**:
  1. timelineId의 세션 목록 조회
  2. name으로 검색 가능
  3. 각 세션의 `_count.programs` 포함
  4. `createdAt` 내림차순 정렬

### findSessionById(timelineId, sessionId)

- **파라미터**: `timelineId: string, sessionId: string`
- **반환값**: `SessionDetailDto`
- **로직**:
  1. timelineId + sessionId로 세션 조회
  2. timeline 관계 포함
  3. 없으면 `NotFoundException(TIMELINE_ERRORS.SESSION_NOT_FOUND)`

### createSession(timelineId, dto)

- **파라미터**: `timelineId: string, CreateSessionDto`
- **반환값**: `Session`
- **로직**:
  1. timelineId 존재 확인
  2. 세션 유형별 필드 유효성 검증:
     - ONE_TIME: `startDateTime` 필수
     - ONE_TIME_RANGE: `startDateTime`, `endDateTime` 필수, `endDateTime > startDateTime` 확인
     - RECURRING: `recurringDayOfWeek`, `repeatCycleType` 필수
  3. 세션 생성

### updateSession(timelineId, sessionId, dto)

- **파라미터**: `timelineId: string, sessionId: string, UpdateSessionDto`
- **반환값**: `Session`
- **로직**:
  1. 세션 존재 확인
  2. 유형 변경 시 기존 유형 관련 필드 null 초기화
  3. 유형별 필드 유효성 검증
  4. 업데이트 실행

### deleteSession(timelineId, sessionId)

- **파라미터**: `timelineId: string, sessionId: string`
- **반환값**: `void`
- **로직**:
  1. 세션 존재 확인
  2. 프로그램 수 확인 (`_count.programs > 0`)
  3. 프로그램 있으면 `BadRequestException(TIMELINE_ERRORS.SESSION_HAS_PROGRAMS)`
  4. Soft Delete (`removedAt` 설정)

## 비즈니스 규칙

- **Space 격리**: 모든 타임라인 조회/수정/삭제에 `spaceId` 조건 포함
- **유형별 필드 제약**: 세션 생성/수정 시 유형에 맞는 필드 검증
- **연쇄 삭제 방지**: 세션이 있는 타임라인, 프로그램이 있는 세션은 삭제 불가
- **유형 변경 시 클린업**: 세션 유형 변경 시 이전 유형 관련 필드 null로 초기화

## 에러 상수 (TIMELINE_ERRORS)

| 상수 | 설명 |
|------|------|
| `TIMELINE_NOT_FOUND` | 타임라인 미발견 (404) |
| `TIMELINE_NAME_DUPLICATED` | 같은 Space 내 타임라인 이름 중복 (400) |
| `TIMELINE_HAS_SESSIONS` | 세션이 있는 타임라인 삭제 시도 (400) |
| `SESSION_NOT_FOUND` | 세션 미발견 (404) |
| `SESSION_HAS_PROGRAMS` | 프로그램 연결 세션 삭제 시도 (400) |
| `SESSION_DATE_INVALID` | 날짜 유효성 오류 (400) |

## 구현 체크리스트

- [ ] timelines.service.ts
- [ ] TIMELINE_ERRORS 상수 정의
- [ ] 유형별 세션 유효성 검증 로직

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | be-spec-planner |
