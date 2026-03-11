# Subjects Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/subjects/subjects.module.ts

## 역할

`SubjectsController`가 ApplicationService와 Subject service/repository 조합을 주입받을 수 있도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| SubjectsApplicationService | Controller 진입용 Subject 유즈케이스 |
| SubjectsService | Subject 도메인 서비스 |
| SubjectsRepository | Subject 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| SubjectsApplicationService | 다른 모듈이 참조할 수 있는 Subject application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | SubjectsModule export를 SubjectsApplicationService 기준으로 정렬 | codex |
