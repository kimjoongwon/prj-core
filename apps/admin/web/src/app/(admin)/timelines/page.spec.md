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
- page role: `collection`
- reusable target: `data-grid`
- page component path: `packages/fe-ui/src/page/TimelineListPage/TimelineListPage.tsx`
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

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure page에 직접 주입하도록 정리 | codex |
| 2026-04-28 | grid 컴포넌트 명칭을 DataGrid로 통일한 구조 변경을 반영 | codex |
| 2026-04-28 | page role을 `collection`으로 갱신 | codex |
| 2026-04-28 | DataGrid 공식 재사용 타깃을 `data-grid`로 갱신 | codex |
| 2026-04-27 | 타임라인 목록의 수동 Space queryKey 분리를 제거하고 admin layout bootstrap/access gate와 hard reload 기반 cache 초기화 정책으로 갱신 | codex |
| 2026-04-26 | 목록 query가 Space bootstrap 완료 후 실행되고 현재 spaceId별로 캐시를 분리하도록 반영 | codex |
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-04-08 | 타임라인 상세 진입을 callback 버튼이 아니라 route가 주입한 이름 링크 href 기준으로 정리 | codex |
| 2026-03-29 | `TimelineListPage` pure page와 thin route container 구조로 전환하고 조회/삭제/라우팅을 route로 이동 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 타임라인 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
