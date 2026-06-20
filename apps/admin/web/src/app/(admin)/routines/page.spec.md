# 루틴 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/routines`

## 사용자 시나리오

1. 관리자가 루틴 목록을 검색하거나 Space 범위로 필터링합니다.
2. 루틴 이름으로 상세 화면에 이동합니다.
3. 삭제 버튼으로 삭제 확인 modal을 열고 루틴을 제거합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/RoutineListScreen/RoutineListScreen.tsx`
- route는 `useGetRoutines`, `useDeleteRoutine`, `nuqs` query state, `router`를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetRoutines({ take, skip, search, spaceScope })` | admin layout의 Space bootstrap/access gate 아래에서 루틴 목록 조회. Space 전환은 hard reload로 query cache를 초기화 |
| 삭제 확인 | `useDeleteRoutine()` | 루틴 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/routines/new`로 이동 |
| `onClickRoutineName` | route가 `/routines/[routineId]`로 이동 |
| `onDeleteRoutine` | route가 삭제 mutation과 캐시 무효화를 처리 |