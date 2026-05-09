# CoursePass 목록 페이지 기획서

> 생성일: 2026-05-09
> 타입: page
> 경로: `/course-passes`

## 사용자 시나리오

1. 관리자가 결제 후 발급된 수강권 목록을 확인합니다.
2. 보유자, Course, 수강권 유형, 발급일, 만료일, 잔여 예약 권리를 확인합니다.
3. Timeline 관리로 이동해 수강권이 실제 예약 가능한 운영 일정을 확인합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `collection`
- reusable target: `CourseManagementPage`
- page component path: `packages/fe-ui/src/page/CourseManagementPage/CourseManagementPage.tsx`
- route는 현재 섹션(`course-passes`) 선택, Orval CoursePass API 응답 변환, query state 전달, section routing, Timeline routing을 소유합니다.

## API 호출

현재 route는 `useCourseManagementPageData`를 통해 Orval 생성 CoursePass hook을 호출하고, API 응답을 `CourseManagementPage` 표시 row와 query state로 변환합니다.

| 시점 | API | Orval hook | 설명 | 상태 |
|------|-----|------------|------|------|
| 클라이언트 렌더 | `GET /api/v1/courses/passes` | `useGetCoursePasses` | 발급된 6개월 수강권 목록, Course/Offering/Timeline, 만료일, 잔여 예약 권리, 상태 조회 | 구현 완료 |

### Backend/API 계약

| 대상 | 계약 |
|------|------|
| Query DTO | `QueryCoursePassDto`: `courseId`, `courseOfferingId`, `enrollmentId`, `userId`, `timelineId`, `status`, `expiresBefore`, `search`, `skip`, `take`, `orderBy` |
| Response DTO | `CoursePassDto`: `id`, `enrollmentId`, `userId`, `holder`, `courseId`, `course`, `courseOfferingId`, `courseOffering`, `timelineId`, `timeline`, `kind`, `issuedAt`, `validFrom`, `expiresAt`, `reservationLimit`, `reservationUsedCount`, `reservationRemainingCount`, `status` |
| Reservation linkage | Reservation 생성 DTO/API에 `coursePassId`가 추가되어야 합니다. 예약은 CoursePass 유효기간, Timeline 범위, 잔여 예약권을 통과해야 좌석 점유가 가능합니다. |
| Stage 2 target | `COURSE-S2-BE-001` ~ `COURSE-S2-BE-005` |
| Stage 3 target | `COURSE-S3-API-001`, `COURSE-S3-FE-001` |

route는 `useGetCoursePasses`의 `isLoading`/`isFetching`/`isError` 상태를 `queryState`로 전달합니다. `CourseManagementConsole`은 loading/refreshing/error/empty 상태를 표 영역에 렌더링하고, 잔여 예약 권리는 API의 `reservationRemainingCount`를 단일 source of truth로 표시합니다.

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickSection` | route가 선택 섹션 href로 이동 |
| `onClickTimeline` | route가 `/timelines`로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | CoursePass route를 nested Course API 연동 및 query state 렌더링 완료 상태로 갱신 | codex |
| 2026-05-09 | Stage 1 re-entry로 CoursePass backend/API/Reservation linkage 계약과 Stage 2/3 필요 상태 기록 | orch-requirement |
| 2026-05-09 | CoursePass 목록 route scaffold와 잔여 예약 권리 표시 추가 | codex |
