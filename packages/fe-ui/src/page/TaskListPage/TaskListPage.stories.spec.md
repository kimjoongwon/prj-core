# TaskListPage stories 기획서

> 생성일: 2026-04-28
> 타입: stories
> 위치: packages/fe-ui/src/page/TaskListPage/TaskListPage.stories.tsx

## 역할

`TaskListPage`의 기본, 로딩, 삭제 진행, 빈 상태를 Storybook에서 검증합니다. 기본 fixture는 Orval `TaskDto` row 형태에 맞춰 `exercise` 하위에 운동 이름, 영상 파일, 시간, 횟수를 배치합니다.

## Story 계약

| Story | 목적 |
|------|------|
| Default | Task 목록 row와 Exercise 기반 컬럼 표시를 확인 |
| Loading | `isLoading` fallback 렌더링을 확인 |
| Busy | 삭제 진행 중 액션 상태를 확인 |
| EmptyState | 빈 목록 상태를 확인 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | TaskListPage Storybook fixture를 `TaskDto.exercise` 기반 row 계약에 맞게 정의 | codex |
