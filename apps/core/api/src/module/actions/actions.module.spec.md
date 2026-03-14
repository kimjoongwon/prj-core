# Actions Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/actions/actions.module.ts

## 역할

`ActionsController`가 `ActionFacade`를 주입받도록 facade/service/repository provider를 조립합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| ActionFacade | Controller boundary 유즈케이스 및 응답 조립 |
| ActionService | Action 도메인 규칙 및 변경 처리 |
| ActionsRepository | Action 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| ActionFacade | 다른 모듈이 참조할 수 있는 Action boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | ActionsModule export를 ActionService 기준으로 정렬 | codex |
| 2026-03-13 | ActionsModule boundary provider/export를 `ActionFacade` 기준으로 갱신 | codex |
