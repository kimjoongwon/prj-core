# Actions Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/actions/actions.module.ts

## 역할

`ActionsController`가 `ActionsService`를 주입받을 수 있도록 application/service/repository provider를 조립합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| ActionsService | Controller 진입용 Action 유즈케이스 |
| ActionsService | Action 도메인 서비스 |
| ActionsRepository | Action 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| ActionsService | 다른 모듈이 참조할 수 있는 Action application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | ActionsModule export를 ActionsService 기준으로 정렬 | codex |
