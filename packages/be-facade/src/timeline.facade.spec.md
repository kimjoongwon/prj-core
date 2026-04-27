# Timelines Facade 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-facade/src/timeline.facade.ts

## 역할

Timelines 컨트롤러에서 CLS 기반 Space/Auth helper와 목록 응답 메타 계산을 제거하고, Timeline/Session/Program 유즈케이스 surface를 Facade로 통합합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| TimelineService | Timeline/Session/Program CRUD 수행 |
| AuthContext | 현재 인증 사용자 ID 제공 |
| SpaceContext | 현재 요청의 spaceId 제공 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getTimelines | 목록과 pagination meta/stats 반환 |
| getTimelineById | 현재 Space 기준 타임라인 상세 조회 |
| createTimeline | 현재 Space와 사용자 기준 타임라인 생성 |
| updateTimeline | 현재 Space 기준 타임라인 수정 |
| deleteTimeline | 현재 Space 기준 타임라인 삭제 |
| getSessions | 세션 목록과 pagination meta 반환 |
| getSessionById | 세션 상세 조회 |
| createSession | 세션 생성 |
| updateSession | 세션 수정 |
| deleteSession | 세션 삭제 |
| getPrograms | 프로그램 목록과 pagination meta 반환 |
| getProgramById | 프로그램 상세 조회 |
| createProgram | 프로그램 생성 |
| updateProgram | 프로그램 수정 |
| deleteProgram | 프로그램 삭제 |

## 비즈니스 규칙

- Timeline 계열 read/write는 현재 Space 컨텍스트가 필수입니다.
- 목록/상세 read는 `SpaceContext.spaceIds`를 service로 전달해 `FULL_ACCESS` 전체 조회와 일반 권한 Space 제한을 구분합니다.
- 타임라인 생성은 현재 인증 사용자 ID를 creatorId로 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-26 | Timeline read boundary가 `SpaceContext.spaceIds` 기반 scope를 service에 위임하도록 반영 | codex |
| 2026-03-11 | Timelines 도메인 facade 신규 생성 및 controller helper 이관 | codex |
| 2026-03-13 | TimelineFacade boundary 조합을 `@cocrepo/facade`로 이관 | codex |
