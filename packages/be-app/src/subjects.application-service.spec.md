# Subjects ApplicationService 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-app/src/subjects.application-service.ts

## 역할

Subject 읽기 API에서 컨트롤러가 수행하던 `id -> subject name -> field` 조회 보조 로직을 ApplicationService로 이동합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| SubjectsService | Subject 및 필드 정보 조회 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getSubjects | group 유무에 따라 전체/그룹별 Subject 조회 |
| getSubjectFields | Subject ID 기준 필드 목록 조회 |
| getSubjectById | Subject 상세 조회 |

## 비즈니스 규칙

- Subject가 없으면 필드 조회는 빈 배열을 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Subjects 도메인 thin wrapper application service 신규 생성 | codex |
