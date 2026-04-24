# 타임라인 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/timelines`

## 사용자 시나리오

1. 관리자가 타임라인 목록을 검색합니다.
2. 타임라인 이름으로 상세 화면에 이동합니다.
3. 삭제 버튼으로 삭제 확인 modal을 열고 타임라인을 제거합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `master`
- reusable target: `master/table`
- page component path: `packages/fe-ui/src/page/TimelineListPage/TimelineListPage.tsx`
- route는 `useGetTimelines`, `useDeleteTimeline`, `nuqs` query state, `router`, row href 생성을 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetTimelines({ take, skip, search })` | 타임라인 목록 조회 |
| 삭제 확인 | `useDeleteTimeline()` | 타임라인 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/timelines/new`로 이동 |
| `timelineRow.href` | route가 `/timelines/[timelineId]` href를 주입하고 page는 이름 링크로 렌더 |
| `onDeleteTimeline` | route가 삭제 mutation과 캐시 무효화를 처리 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-04-08 | 타임라인 상세 진입을 callback 버튼이 아니라 route가 주입한 이름 링크 href 기준으로 정리 | codex |
| 2026-03-29 | `TimelineListPage` pure page와 thin route container 구조로 전환하고 조회/삭제/라우팅을 route로 이동 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 타임라인 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
