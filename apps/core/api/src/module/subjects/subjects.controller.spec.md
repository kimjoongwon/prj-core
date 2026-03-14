# Subjects Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/subjects/subjects.controller.ts`

## 역할

Subject 읽기 전용 API를 노출하며, 보조 조회와 응답 조립은 `SubjectFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| subjectFacade | SubjectFacade | Subject 목록/상세/필드 조회 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getSubjects` | group 필터를 포함한 Subject 목록 조회 |
| GET | `/:id` | `getSubjectById` | Subject 상세 조회 |
| GET | `/:id/fields` | `getSubjectFields` | Subject 필드 목록 조회 |

## 비즈니스 메모

- controller는 `id -> subject -> fields` 보조 조회를 직접 수행하지 않습니다.
- 존재 여부 판단과 필드 조회는 Facade 내부 `SubjectService`가 담당하며, Subject가 없으면 빈 배열을 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 SubjectService로 전환 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `SubjectFacade` 기준으로 갱신 | codex |
