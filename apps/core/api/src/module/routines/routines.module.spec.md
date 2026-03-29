# Routines Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/routines/routines.module.ts

## 역할

`RoutinesController`가 `RoutineFacade`를 주입받도록 facade/service/context/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| RoutineFacade | Controller boundary 유즈케이스 및 응답 조립 |
| RoutineService | Routine 도메인 규칙 및 변경 처리 |
| RoutinesRepository | Routine 영속성 접근 |
| TasksRepository | Task/Exercise schedulable 검증용 조회 |
| AuthContext | 현재 인증 사용자 제공 |
| SpaceContext | 현재 요청 Space 및 접근 범위 제공 |

## exports

| export | 설명 |
|--------|------|
| RoutineFacade | 다른 모듈이 참조할 수 있는 Routine boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Routine 저장 전 Exercise 영상 여부를 검증할 수 있도록 `TasksRepository` provider를 module wiring에 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | RoutinesModule export를 RoutineService 기준으로 정렬 | codex |
| 2026-03-13 | RoutinesModule boundary provider/export를 `RoutineFacade` 기준으로 갱신 | codex |
