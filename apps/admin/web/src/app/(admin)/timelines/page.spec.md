# 타임라인 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/timelines`

## 사용자 시나리오

1. 관리자가 타임라인 목록을 검색합니다.
2. 타임라인 이름으로 상세 화면에 이동합니다.
3. 삭제 버튼으로 삭제 확인 modal을 열고 타임라인을 제거합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/TimelineListScreen/TimelineListScreen.tsx`
- route는 `useGetTimelines`, `useDeleteTimeline`, `nuqs` query state, `router`, row href 생성을 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetTimelines({ take, skip, search })` | admin layout의 Space bootstrap/access gate 아래에서 타임라인 목록 조회. Space 전환은 hard reload로 query cache를 초기화 |
| 삭제 확인 | `useDeleteTimeline()` | 타임라인 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/timelines/new`로 이동 |
| `timelineRow.href` | route가 `/timelines/[timelineId]` href를 주입하고 page는 이름 링크로 렌더 |
| `onDeleteTimeline` | route가 삭제 mutation과 캐시 무효화를 처리 |