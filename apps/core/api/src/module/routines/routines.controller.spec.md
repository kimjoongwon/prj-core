# Routines Controller 기획서

> 생성일: 2026-03-03
> 타입: controller
> 위치: apps/core/api/src/module/routines/routines.controller.ts

## 역할

Routine CRUD API를 노출하며, 인증 사용자/Space 해석과 pagination 응답 조립은 `RoutineFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| routineFacade | RoutineFacade | Routine 목록/상세/생성/수정/삭제 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getRoutines` | 목록 조회 (`data + meta`) |
| GET | `/:routineId` | `getRoutine` | 상세 조회 |
| POST | `/` | `createRoutine` | 현재 인증 사용자 기준 루틴 생성 |
| PATCH | `/:routineId` | `updateRoutine` | 루틴 수정 |
| DELETE | `/:routineId` | `deleteRoutine` | 루틴 삭제 |

## 비즈니스 메모

- controller는 `ClsService`나 private helper 없이 Facade만 호출합니다.
- 현재 사용자 해석과 목록 `meta` 조립은 Facade가 담당하고, 도메인 검증은 내부 `RoutineService`가 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | Controller 의존성을 RoutineService로 전환하고 CLS helper를 제거 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `RoutineFacade` 기준으로 갱신 | codex |
| 2026-03-13 | RoutineController가 Query DTO 전체를 RoutineFacade에 그대로 전달하도록 정리 | codex |
