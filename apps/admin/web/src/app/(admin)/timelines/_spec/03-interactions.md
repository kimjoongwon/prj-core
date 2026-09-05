# 타임라인 상세 화면 연결

## Route / Screen Mapping

아래 경로는 `apps/admin/web/src/app/(admin)/timelines`와 `packages/fe-ui/src/screen`을 기준으로 한다.

| Route | Screen | page 역할 / reusable 대상 |
|-------|--------|--------------------------|
| `[timelineId]/page.tsx` | `TimelineEditScreen/TimelineEditScreen.tsx` | `detail` / `detail/view` |
| `[timelineId]/sessions/[sessionId]/page.tsx` | `TimelineSessionEditScreen/TimelineSessionEditScreen.tsx` | `detail` / `detail/view` |
| `[timelineId]/sessions/[sessionId]/programs/[programId]/page.tsx` | `TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx` | `detail` / `detail/view` |

## SDK와 경로 연결

- 생성 SDK와 Screen이 공유하는 세션·프로그램 식별자는 `bigint`로 전달한다.
- 행 클릭 핸들러도 `bigint`를 받고, URL과 삭제 mutation의 path parameter 경계에서 decimal string으로 변환한다.
- 생성일은 SDK가 복원한 `Date`를 그대로 Screen에 전달한다.
- 기존 이동·삭제·Query 무효화 및 클라이언트 렌더링 방식을 유지한다. 새로운 SSR/prefetch 예외는 도입하지 않는다.
- route owner는 앱 타입 검사와 lint로 SDK·Screen 콜백·mutation 입력 계약을 검증한다.
