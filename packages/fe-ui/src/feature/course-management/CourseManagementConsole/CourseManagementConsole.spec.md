# CourseManagementConsole feature 기획서

> 생성일: 2026-05-09
> 타입: feature
> 위치: packages/fe-ui/src/feature/course-management/CourseManagementConsole/CourseManagementConsole.tsx

## 역할

Course 계열 admin page의 업무 조합 feature입니다. Page가 전달한 Course, CourseOffering, Enrollment, CoursePass 데이터, query state, route handler를 받아 flow rail, metrics, section tabs, active table/state widget을 조합합니다.

## 화면 러프

```text
CourseManagementConsole
├─ CourseFlowRail
│  ├─ Course
│  ├─ CourseOffering
│  ├─ Enrollment / Pass
│  └─ Timeline / Reservation
├─ CourseMetricGrid
│  ├─ 운영 Course
│  ├─ 모집 Offering
│  ├─ 활성 Enrollment
│  └─ 활성 Pass
├─ CourseSectionTabs
│  ├─ Course
│  ├─ CourseOffering
│  ├─ Enrollment
│  └─ CoursePass
├─ CourseTableStatePanel (loading / refreshing / error / empty)
└─ Active Table (ready 상태)
   ├─ CourseTable
   ├─ CourseOfferingTable
   ├─ CourseEnrollmentTable
   └─ CoursePassTable
```

## 공개 계약

| 항목 | 설명 |
|------|------|
| CourseManagementConsoleProps.activeSectionId | 현재 표시할 Course 계열 섹션 |
| CourseManagementConsoleProps.sections | 상단 section tab 표시 데이터 |
| CourseManagementConsoleProps.queryState | Orval query 상태. `isLoading`, `isFetching`, `isError`를 표 영역 상태 UI로 렌더링 |
| CourseManagementConsoleProps.courses | Course table rows |
| CourseManagementConsoleProps.offerings | CourseOffering table rows |
| CourseManagementConsoleProps.enrollments | Enrollment table rows |
| CourseManagementConsoleProps.passes | CoursePass table rows |
| CourseManagementConsoleProps.onClickSection | route thin container가 주입하는 section 이동 이벤트 |
| CourseManagementConsoleProps.onClickTimeline | Timeline route 이동 이벤트 |

## 조합 계층

| 계층 | 컴포넌트 | 책임 |
|------|----------|------|
| Widget | CourseFlowRail | Course 계열 운영 흐름 표시 |
| Widget | CourseMetricGrid | 도메인별 건수 summary |
| Widget | CourseSectionTabs | Course 계열 section 선택 |
| Widget | CourseTableStatePanel | loading/refreshing/error/empty 상태 표시 |
| Widget | CourseTable | Course 목록 표시 |
| Widget | CourseOfferingTable | Offering와 Timeline 연결 표시 |
| Widget | CourseEnrollmentTable | 결제 후 수강 신청 상태 표시 |
| Widget | CoursePassTable | 6개월 수강권 상태 표시 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | Orval query state를 CourseTableStatePanel로 렌더링하는 계약 추가 | codex |
| 2026-05-09 | CourseManagementPage 내부에 있던 업무 조합을 feature로 분리 | codex |
