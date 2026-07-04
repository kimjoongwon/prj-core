# Courses Route

## Route / Screen Mapping

- page 역할: collection
- reusable 대상: data-grid
- screen component path: `packages/fe-ui/src/screen/CourseScreen/CourseScreen.tsx`
- SSR/prefetch 예외 승인 여부: 없음

## 계약

- `/courses`는 Course aggregate root의 canonical admin route입니다.
- `section` search param은 `courses`, `offerings`, `enrollments`, `passes` 중 하나를 받습니다.
- `section`이 없거나 유효하지 않으면 `courses` 섹션을 기본으로 렌더링합니다.
- route는 `useCourseData` 결과를 `CourseScreen`에 전달하고, 섹션/타임라인 이동은 route handler에서 URL push만 수행합니다.
- `page.tsx`는 `section` query를 해석하고, client hook 연결은 `CoursesPageRouteClient.tsx`가 담당합니다.
