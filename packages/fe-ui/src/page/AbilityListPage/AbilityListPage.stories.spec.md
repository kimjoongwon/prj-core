# AbilityListPage stories 기획서

> 생성일: 2026-04-28
> 타입: stories
> 위치: packages/fe-ui/src/page/AbilityListPage/AbilityListPage.stories.tsx

## 역할

`AbilityListPage`의 기본, 로딩, 빈 상태를 Storybook에서 검증합니다. 기본 fixture는 Orval `AbilityResponseDto` row 계약과 `DataGridStateModel`에 필요한 query state 계약을 함께 제공합니다.

## Story 계약

| Story | 목적 |
|------|------|
| Default | 권한 목록 row, Subject/Action 표시명, 조건/필드 수 컬럼 표시를 확인 |
| Loading | `isLoading` fallback 렌더링을 확인 |
| EmptyState | 빈 목록과 필터 옵션 없음 상태를 확인 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | AbilityListPage Storybook fixture를 DTO row와 DataGrid query state 계약에 맞게 정의 | codex |
