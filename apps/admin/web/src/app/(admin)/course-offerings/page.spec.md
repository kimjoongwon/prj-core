# CourseOffering 목록 페이지 기획서

> 생성일: 2026-05-09
> 타입: page
> 경로: `/course-offerings`

## 사용자 시나리오

1. 관리자가 실제 개설된 과정/반/기수 목록을 확인합니다.
2. CourseOffering별 Space, 운영 기간, 정원, 연결된 Timeline을 확인합니다.
3. Timeline 버튼으로 일정 관리 화면에 이동해 Session/Program 운영을 이어갑니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `CourseManagementPage`
- screen component path: `packages/fe-ui/src/screen/CourseManagementPage/CourseManagementPage.tsx`
- route는 현재 섹션(`course-offerings`) 선택, Orval CourseOffering API 응답 변환, query state 전달, section routing, Timeline routing을 소유합니다.

## API 호출

현재 route는 `useCourseManagementPageData`를 통해 Orval 생성 CourseOffering hook을 호출하고, API 응답을 `CourseManagementPage` 표시 row와 query state로 변환합니다.

| 시점 | API | Orval hook | 설명 | 상태 |
|------|-----|------------|------|------|
| 클라이언트 렌더 | `GET /api/v1/courses/offerings` | `useGetCourseOfferings` | 개설 반/기수 목록, Course/Space/Timeline 연결, 모집 기간, 정원/등록 수, 상태 조회 | 구현 완료 |

### Backend/API 계약

| 대상 | 계약 |
|------|------|
| Query DTO | `QueryCourseOfferingDto`: `courseId`, `spaceId`, `timelineId`, `status`, `recruitingOnly`, `search`, `skip`, `take`, `orderBy` |
| Response DTO | `CourseOfferingDto`: `id`, `courseId`, `course`, `spaceId`, `timelineId`, `timeline`, `timelineProvisioningMode`, `name`, `startsAt`, `endsAt`, `enrollmentStartsAt`, `enrollmentEndsAt`, `capacity`, `enrolledCount`, `status` |
| Timeline linkage | `timelineId`는 기존 Timeline을 연결합니다. 1:1 코칭처럼 개인 Timeline이 필요한 offering은 `timelineProvisioningMode=PER_ENROLLMENT`로 두고 Enrollment 활성화 시 `assignedTimelineId`를 확정합니다. |
| Stage 2 target | `COURSE-S2-BE-001` ~ `COURSE-S2-BE-004` |
| Stage 3 target | `COURSE-S3-API-001`, `COURSE-S3-FE-001` |

route는 `useGetCourseOfferings`의 `isLoading`/`isFetching`/`isError` 상태를 `queryState`로 전달합니다. `CourseManagementConsole`은 loading/refreshing/error/empty 상태를 표 영역에 렌더링하고, Timeline 이동은 API response의 `timelineId`를 기준으로 `/timelines` 계열 route에 연결합니다.

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickSection` | route가 선택 섹션 href로 이동 |
| `onClickTimeline` | route가 `/timelines`로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | CourseOffering route를 nested Course API 연동 및 query state 렌더링 완료 상태로 갱신 | codex |
| 2026-05-09 | Stage 1 re-entry로 CourseOffering backend/API/Timeline linkage 계약과 Stage 2/3 필요 상태 기록 | orch-requirement |
| 2026-05-09 | CourseOffering 목록 route scaffold와 Timeline 연결 표시 추가 | codex |
