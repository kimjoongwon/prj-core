# 태스크 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/tasks`

## 사용자 시나리오

1. 관리자가 태스크 목록을 검색하거나 Space 범위로 필터링합니다.
2. 목록에서 각 Exercise의 `스케줄 가능` 상태를 확인합니다.
3. 태스크 이름으로 상세 화면에 이동합니다.
4. 삭제 버튼으로 삭제 확인 modal을 열고 태스크를 제거합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `master`
- reusable target: `master/table`
- page component path: `packages/fe-ui/src/page/AdminTasksPage/AdminTasksPage.tsx`
- route는 `useGetTasks`, `useDeleteTask`, `useMetaDataGridQueryStates`, `router`를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetTasks({ take, skip, search, spaceScope })` | 태스크 목록 조회 |
| 삭제 확인 | `useDeleteTask()` | 태스크 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/tasks/new`로 이동 |
| `onClickTaskName` | route가 `/tasks/[taskId]/exercise`로 이동 |
| `onDeleteTask` | route가 삭제 mutation과 캐시 무효화를 처리 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | 태스크 목록 시나리오에 Exercise 영상 기반 `스케줄 가능` 상태 확인 단계를 추가 | codex |
| 2026-03-29 | `AdminTasksPage` pure page와 thin route container 구조로 전환하고 조회/삭제/라우팅을 route로 이동 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 태스크 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
