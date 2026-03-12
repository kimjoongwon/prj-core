# Routines Controller 기획서

> 생성일: 2026-03-03
> 타입: controller
> 위치: apps/core/api/src/module/routines/routines.controller.ts

## 역할

Routine CRUD API를 노출하며, pagination 응답 계산과 현재 인증 사용자 해석은 `RoutinesService`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| routinesService | RoutinesService | Routine 목록/상세/생성/수정/삭제 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getRoutines` | 목록 조회 (`data + meta`) |
| GET | `/:routineId` | `getRoutine` | 상세 조회 |
| POST | `/` | `createRoutine` | 현재 인증 사용자 기준 루틴 생성 |
| PATCH | `/:routineId` | `updateRoutine` | 루틴 수정 |
| DELETE | `/:routineId` | `deleteRoutine` | 루틴 삭제 |

## 비즈니스 메모

- controller는 더 이상 `ClsService`나 private helper로 현재 사용자를 직접 읽지 않습니다.
- 목록 응답의 pagination meta 계산은 Service가 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | Controller 의존성을 RoutinesService로 전환하고 CLS helper를 제거 | codex |
