# Categories Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/categories/categories.module.ts

## 역할

`CategoriesController`가 `CategoryFacade`를 주입받도록 facade/service/context/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| CategoryFacade | Controller boundary 유즈케이스 및 응답 조립 |
| CategoryService | Category 도메인 규칙 및 계층 구조 검증 |
| CategoriesRepository | Category 영속성 접근 |
| SpaceContext | 현재 요청의 spaceId 제공 |

## exports

| export | 설명 |
|--------|------|
| CategoryFacade | 다른 모듈이 참조할 수 있는 Category boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | CategoriesModule export를 CategoryService 기준으로 정렬 | codex |
| 2026-03-13 | CategoriesModule boundary provider/export를 `CategoryFacade` 기준으로 갱신 | codex |
