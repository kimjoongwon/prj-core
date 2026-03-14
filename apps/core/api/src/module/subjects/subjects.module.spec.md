# Subjects Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/subjects/subjects.module.ts

## 역할

`SubjectsController`가 `SubjectFacade`를 주입받도록 facade/service/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| SubjectFacade | Controller boundary 유즈케이스 및 응답 조립 |
| SubjectService | Subject 조회 규칙 및 필드 조회 처리 |
| SubjectsRepository | Subject 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| SubjectFacade | 다른 모듈이 참조할 수 있는 Subject boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | SubjectsModule export를 SubjectService 기준으로 정렬 | codex |
| 2026-03-13 | SubjectsModule boundary provider/export를 `SubjectFacade` 기준으로 갱신 | codex |
