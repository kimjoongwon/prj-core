# Timelines Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/timelines/timelines.module.ts

## 역할

`TimelinesController`가 `TimelineFacade`를 주입받도록 facade/service/context/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| TimelineFacade | Controller boundary 유즈케이스 및 응답 조립 |
| TimelineService | Timeline/Session/Program 도메인 규칙 및 변경 처리 |
| TimelinesRepository | Timeline 영속성 접근 |
| AuthContext | 현재 인증 사용자 제공 |
| SpaceContext | 현재 요청 Space 제공 |

## exports

| export | 설명 |
|--------|------|
| TimelineFacade | 다른 모듈이 참조할 수 있는 Timeline boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | TimelinesModule export를 TimelineService 기준으로 정렬 | codex |
| 2026-03-13 | TimelinesModule boundary provider/export를 `TimelineFacade` 기준으로 갱신 | codex |
