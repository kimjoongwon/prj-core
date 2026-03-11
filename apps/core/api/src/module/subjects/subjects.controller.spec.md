# Subjects Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/subjects/subjects.controller.ts`

## 역할

Subject 읽기 전용 API를 노출하며, Subject ID 기반 필드 조회 보조 로직은 `SubjectsApplicationService`로 이동했습니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| subjectsApplicationService | SubjectsApplicationService | Subject 목록/상세/필드 조회 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getSubjects` | group 필터를 포함한 Subject 목록 조회 |
| GET | `/:id` | `getSubjectById` | Subject 상세 조회 |
| GET | `/:id/fields` | `getSubjectFields` | Subject 필드 목록 조회 |

## 비즈니스 메모

- controller는 더 이상 `id -> subject -> fields` 보조 조회를 직접 수행하지 않습니다.
- Subject가 없으면 필드 조회는 빈 배열을 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 SubjectsApplicationService로 전환 | codex |
