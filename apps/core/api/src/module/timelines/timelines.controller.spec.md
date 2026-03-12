# Timelines Controller 기획서

> 생성일: 2026-02-19
> 타입: controller
> 위치: apps/core/api/src/module/timelines/timelines.controller.ts

## 역할

Timeline, Session, Program 중첩 리소스 API를 노출하며, Space/Auth 컨텍스트 해석과 목록 meta/stats 계산은 `TimelinesService`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| timelinesService | TimelinesService | Timeline/Session/Program 조회 및 CRUD 유즈케이스 |

## Timeline 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getTimelines` | 타임라인 목록 조회 (`data + meta + stats`) |
| GET | `/:timelineId` | `getTimelineById` | 현재 Space 기준 타임라인 상세 조회 |
| POST | `/` | `createTimeline` | 현재 Space/사용자 기준 타임라인 생성 |
| PATCH | `/:timelineId` | `updateTimeline` | 현재 Space 기준 타임라인 수정 |
| DELETE | `/:timelineId` | `deleteTimeline` | 현재 Space 기준 타임라인 삭제 |

## Session 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/:timelineId/sessions` | `getSessions` | 세션 목록 조회 (`data + meta`) |
| GET | `/:timelineId/sessions/:sessionId` | `getSessionById` | 세션 상세 조회 |
| POST | `/:timelineId/sessions` | `createSession` | 세션 생성 |
| PATCH | `/:timelineId/sessions/:sessionId` | `updateSession` | 세션 수정 |
| DELETE | `/:timelineId/sessions/:sessionId` | `deleteSession` | 세션 삭제 |

## Program 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/:timelineId/sessions/:sessionId/programs` | `getPrograms` | 프로그램 목록 조회 (`data + meta`) |
| GET | `/:timelineId/sessions/:sessionId/programs/:programId` | `getProgramById` | 프로그램 상세 조회 |
| POST | `/:timelineId/sessions/:sessionId/programs` | `createProgram` | 프로그램 생성 |
| PATCH | `/:timelineId/sessions/:sessionId/programs/:programId` | `updateProgram` | 프로그램 수정 |
| DELETE | `/:timelineId/sessions/:sessionId/programs/:programId` | `deleteProgram` | 프로그램 삭제 |

## 비즈니스 메모

- controller는 더 이상 `ClsService`와 `getSpaceId`/`getCurrentUser` helper를 갖지 않습니다.
- controller는 Timeline/Session/Program 각 API에서 Space 컨텍스트 검증 후 TimelinesService의 Space-범위 메서드로 위임합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | TimelinesController 메서드 매핑 정비 (`findTimelines`, `findTimelineForSpace`, Session/Program Space-범위 메서드 일치) 및 Space/Auth 컨텍스트 주입 반영 | codex |
- Timeline/Session/Program 목록 응답의 pagination meta 계산은 Service가 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-api-planner |
| 2026-02-19 | Programs 중첩 리소스 엔드포인트 추가 | orch-requirement |
| 2026-03-11 | Controller 의존성을 TimelinesService로 전환하고 CLS helper를 제거 | codex |
