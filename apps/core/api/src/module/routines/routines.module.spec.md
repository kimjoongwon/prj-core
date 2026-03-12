# Routines Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/routines/routines.module.ts

## 역할

`RoutinesController`가 Service와 Routine service/context/repository 조합을 주입받을 수 있도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| RoutinesService | Controller 진입용 Routine 유즈케이스 |
| RoutinesService | Routine 도메인 서비스 |
| RoutinesRepository | Routine 영속성 접근 |
| AuthContext | 현재 인증 사용자 제공 |
| SpaceContext | 현재 요청 Space 및 접근 범위 제공 |

## exports

| export | 설명 |
|--------|------|
| RoutinesService | 다른 모듈이 참조할 수 있는 Routine application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | RoutinesModule export를 RoutinesService 기준으로 정렬 | codex |
