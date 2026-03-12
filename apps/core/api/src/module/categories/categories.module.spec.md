# Categories Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/categories/categories.module.ts

## 역할

`CategoriesController`가 application/service/context/repository 조합을 통해 Category 유즈케이스를 수행하도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| CategoriesService | Controller 진입용 Category 유즈케이스 |
| CategoriesService | Category 도메인 서비스 |
| CategoriesRepository | Category 영속성 접근 |
| SpaceContext | 현재 요청의 spaceId 제공 |

## exports

| export | 설명 |
|--------|------|
| CategoriesService | 다른 모듈이 참조할 수 있는 Category application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | CategoriesModule export를 CategoriesService 기준으로 정렬 | codex |
