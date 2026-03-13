# Task Facade 기획서

> 생성일: 2026-03-11
> 타입: facade
> 위치: packages/be-facade/src/task.facade.ts

## 역할

Task aggregate root API의 controller boundary를 담당합니다.
Exercise 1:1 detail lifecycle은 Task root 아래에서 처리하며 목록 응답 메타를 조립합니다.

## 공개 메서드 메모

- 유지: 목록 조회, Exercise 조회/수정, Routine 조회, 생성, 삭제
- 제거: frontend 런타임 미사용 Task 상세 wrapper

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Task root facade 신규 생성 | codex |
| 2026-03-13 | `@cocrepo/app`에서 `@cocrepo/facade`로 이관 | codex |
| 2026-03-13 | frontend 런타임 미사용 Task 상세 wrapper를 제거 | codex |
