# 루틴 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/routines`

## 사용자 시나리오

1. 관리자가 루틴 목록을 검색하거나 Space 범위로 필터링합니다.
2. 루틴 이름으로 상세 화면에 이동합니다.
3. 삭제 버튼으로 삭제 확인 modal을 열고 루틴을 제거합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `master`
- reusable target: `master/table`
- page component path: `packages/fe-ui/src/page/RoutineListPage/RoutineListPage.tsx`
- route는 `useGetRoutines`, `useDeleteRoutine`, `nuqs` query state, `router`를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetRoutines({ take, skip, search, spaceScope })` | 루틴 목록 조회 |
| 삭제 확인 | `useDeleteRoutine()` | 루틴 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/routines/new`로 이동 |
| `onClickRoutineName` | route가 `/routines/[routineId]`로 이동 |
| `onDeleteRoutine` | route가 삭제 mutation과 캐시 무효화를 처리 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `RoutineListPage` pure page와 thin route container 구조로 전환하고 조회/삭제/라우팅을 route로 이동 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 루틴 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
