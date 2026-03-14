# Groups Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/groups/groups.module.ts

## 역할

`GroupsController`가 `GroupFacade`를 주입받도록 facade/service/context/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| GroupFacade | Controller boundary 유즈케이스 및 응답 조립 |
| GroupService | Group 도메인 규칙 및 연관 관계 처리 |
| GroupsRepository | Group 영속성 접근 |
| SpaceContext | 현재 요청의 spaceId 제공 |

## exports

| export | 설명 |
|--------|------|
| GroupFacade | 다른 모듈이 참조할 수 있는 Group boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | GroupsModule export를 GroupService 기준으로 정렬 | codex |
| 2026-03-13 | GroupsModule boundary provider/export를 `GroupFacade` 기준으로 갱신 | codex |
