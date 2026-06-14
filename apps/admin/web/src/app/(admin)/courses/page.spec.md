# Course 목록 페이지 기획서

> 생성일: 2026-05-09
> 타입: page
> 경로: `/courses`

## 사용자 시나리오

1. 관리자가 수강 관리 메뉴에서 Course 섹션을 확인합니다.
2. Course가 무엇을 배우는지, 기본 수강 기간/가격, 운영 중인 반과 활성 수강자를 확인합니다.
3. CourseOffering, Enrollment, CoursePass 섹션으로 이동해 수강권 운영 흐름을 이어서 확인합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `CourseScreen`
- screen component path: `packages/fe-ui/src/screen/CourseScreen/CourseScreen.tsx`
- route는 현재 섹션(`courses`) 선택, Orval Course API 응답 변환, query state 전달, section routing, Timeline routing을 소유합니다.

## API 호출

현재 route는 `useCourseData`를 통해 Orval 생성 Course hook을 호출하고, API 응답을 `CourseScreen` 표시 row와 query state로 변환합니다.

| 시점 | API | Orval hook | 설명 | 상태 |
|------|-----|------------|------|------|
| 클라이언트 렌더 | `GET /api/v1/courses` | `useGetCourses` | Course 목록, 검색, 상태 필터, 기본 가격/기간, active offering/enrollment count 조회 | 구현 완료 |

### Backend/API 계약

| 대상 | 계약 |
|------|------|
| Query DTO | `QueryCourseDto`: `search`, `status`, `spaceId`, `skip`, `take`, `orderBy` |
| Response DTO | `CourseDto`: `id`, `spaceId`, `name`, `description`, `durationMonths`, `basePriceAmount`, `currency`, `status`, `activeOfferingCount`, `activeEnrollmentCount`, `createdAt`, `updatedAt` |
| Stage 2 target | `COURSE-S2-BE-001` ~ `COURSE-S2-BE-004` |
| Stage 3 target | `COURSE-S3-API-001`, `COURSE-S3-FE-001` |

route는 `useGetCourses`의 `isLoading`/`isFetching`/`isError` 상태를 `queryState`로 전달합니다. `CourseConsole`은 loading/refreshing/error/empty 상태를 표 영역에 렌더링하고, API response는 Course display row로 변환해 전달합니다.

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickSection` | route가 선택 섹션 href로 이동 |
| `onClickTimeline` | route가 `/timelines`로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | Course route를 Orval API 연동 및 query state 렌더링 완료 상태로 갱신 | codex |
| 2026-05-09 | Stage 1 re-entry로 Course backend/API/Orval 계약과 Stage 2/3 필요 상태 기록 | orch-requirement |
| 2026-05-09 | Course 목록 route scaffold와 CourseScreen 연결 추가 | codex |
