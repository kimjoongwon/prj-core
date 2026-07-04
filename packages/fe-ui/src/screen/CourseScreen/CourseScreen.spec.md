# CourseScreen

## 책임

- Course aggregate root 관리 화면을 렌더링합니다.
- Course, CourseOffering, Enrollment, CoursePass는 독립 screen이 아니라 이 화면의 섹션으로 표시합니다.
- route, API 호출, URL query 해석은 소유하지 않습니다.

## Props 계약

- `activeSectionId`는 현재 보여줄 Course aggregate 섹션을 지정합니다.
- `sections`는 각 섹션의 라벨, 설명, 이동 href, count, tone을 제공합니다.
- `queryState`는 loading/fetching/error 표시만 제어합니다.
- `courses`, `offerings`, `enrollments`, `passes`는 각 섹션 DataGrid row로 그대로 렌더링됩니다.
- `onClickSection`과 `onClickTimeline`은 route container가 제공한 navigation handler만 호출합니다.
