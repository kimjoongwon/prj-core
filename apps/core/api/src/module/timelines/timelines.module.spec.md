# Timelines Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/timelines/timelines.module.ts

## 역할

`TimelinesController`가 `TimelinesService`와 Timeline service/context/repository 조합을 주입받을 수 있도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| TimelinesService | Controller 진입용 Timeline/Session/Program 유즈케이스 |
| TimelinesService | Timeline 도메인 서비스 |
| TimelinesRepository | Timeline 영속성 접근 |
| AuthContext | 현재 인증 사용자 제공 |
| SpaceContext | 현재 요청 Space 제공 |

## exports

| export | 설명 |
|--------|------|
| TimelinesService | 다른 모듈이 참조할 수 있는 Timeline application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | TimelinesModule export를 TimelinesService 기준으로 정렬 | codex |
