# Enrollment 목록 페이지 기획서

> 생성일: 2026-05-09
> 타입: page
> 경로: `/enrollments`

## 사용자 시나리오

1. 관리자가 결제 이후 활성화되는 수강 신청 목록을 확인합니다.
2. 수강자, Course, CourseOffering, Payment 상태, 유효기간, 예약 사용 현황을 확인합니다.
3. CoursePass 섹션으로 이동해 수강권 단위의 잔여 권리를 확인합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `CourseScreen`
- screen component path: `packages/fe-ui/src/screen/CourseScreen/CourseScreen.tsx`
- route는 현재 섹션(`enrollments`) 선택, Orval Enrollment API 응답 변환, query state 전달, section routing, Timeline routing을 소유합니다.

## API 호출

현재 route는 `useCourseData`를 통해 Orval 생성 Enrollment hook을 호출하고, API 응답을 `CourseScreen` 표시 row와 query state로 변환합니다.

| 시점 | API | Orval hook | 설명 | 상태 |
|------|-----|------------|------|------|
| 클라이언트 렌더 | `GET /api/v1/courses/enrollments` | `useGetEnrollments` | 결제 후 등록된 수강 신청 목록, Payment linkage, Course/CourseOffering, 유효기간, 예약 사용 현황 조회 | 구현 완료 |

### Backend/API 계약

| 대상 | 계약 |
|------|------|
| Query DTO | `QueryEnrollmentDto`: `courseId`, `courseOfferingId`, `userId`, `paymentStatus`, `status`, `validOn`, `search`, `skip`, `take`, `orderBy` |
| Response DTO | `EnrollmentDto`: `id`, `userId`, `user`, `courseId`, `course`, `courseOfferingId`, `courseOffering`, `coursePassId`, `coursePass`, `assignedTimelineId`, `paymentStatus`, `paymentProvider`, `paymentExternalId`, `paidAt`, `paidAmount`, `currency`, `validFrom`, `validUntil`, `reservationUsedCount`, `reservationCanceledCount`, `status` |
| Payment linkage | 독립 Payment 도메인이 없으므로 Enrollment가 최소 결제 참조를 보관합니다. `paymentStatus=PAID` 또는 관리자 수동 grant 사유가 있어야 CoursePass 발급이 가능합니다. |
| Stage 2 target | `COURSE-S2-BE-001` ~ `COURSE-S2-BE-005` |
| Stage 3 target | `COURSE-S3-API-001`, `COURSE-S3-FE-001` |

route는 `useGetEnrollments`의 `isLoading`/`isFetching`/`isError` 상태를 `queryState`로 전달합니다. `CourseConsole`은 loading/refreshing/error/empty 상태를 표 영역에 렌더링하고, 결제/수강 상태 badge는 API enum을 display label/tone으로 변환합니다.

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickSection` | route가 선택 섹션 href로 이동 |
| `onClickTimeline` | route가 `/timelines`로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | Enrollment route를 nested Course API 연동 및 query state 렌더링 완료 상태로 갱신 | codex |
| 2026-05-09 | Stage 1 re-entry로 Enrollment backend/API/Payment linkage 계약과 Stage 2/3 필요 상태 기록 | orch-requirement |
| 2026-05-09 | Enrollment 목록 route scaffold와 결제/예약 상태 표시 추가 | codex |
