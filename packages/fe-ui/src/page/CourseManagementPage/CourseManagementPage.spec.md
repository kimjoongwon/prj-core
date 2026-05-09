# CourseManagementPage page 기획서

> 생성일: 2026-05-09
> 타입: page
> 위치: packages/fe-ui/src/page/CourseManagementPage/CourseManagementPage.tsx

## 역할

Course 계열 admin 화면의 pure page 컴포넌트입니다. route thin container가 선택 섹션, 표시 데이터, 라우팅 핸들러를 주입하고 이 컴포넌트는 page title/action과 CourseManagementConsole feature 조합만 담당합니다.

## 화면 러프

### Desktop

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ 수강 관리                                             [타임라인 관리]       │
│ Course, CourseOffering, Enrollment, CoursePass 책임을 분리한다.             │
├────────────────────────────────────────────────────────────────────────────┤
│ [01 Course]     [02 CourseOffering] [03 Enrollment/Pass] [04 Timeline]      │
│ 무엇을 배우는가  실제 개설 반/기수   결제 후 수강 권리     회차 좌석 확보       │
├────────────────────────────────────────────────────────────────────────────┤
│ 운영 Course       모집 Offering        활성 Enrollment      활성 Pass        │
│ 3개               2개                  3건                  3건              │
├────────────────────────────────────────────────────────────────────────────┤
│ [Course 3] [CourseOffering 2] [Enrollment 3] [CoursePass 3]                 │
├────────────────────────────────────────────────────────────────────────────┤
│ Loading/Error/Empty/Refreshing State 또는 Active Table                       │
│ Course: 과정 / 설명 / 기간 / 기본가 / 운영 / 상태                            │
│ CourseOffering: 개설 반 / Course / Space / 기간 / Timeline / 정원 / 상태      │
│ Enrollment: 수강자 / Course / Offering / Payment / 유효기간 / 예약 / 상태     │
│ CoursePass: 보유자 / Course / Pass / 발급일 / 만료일 / 예약 권리 / 상태       │
└────────────────────────────────────────────────────────────────────────────┘
```

### Tablet

```text
┌──────────────────────────────────────────────┐
│ 수강 관리                         [Timeline] │
├──────────────────────────────────────────────┤
│ [Course] [Offering]                          │
│ [Enrollment/Pass] [Timeline/Reservation]     │
├──────────────────────────────────────────────┤
│ [운영 Course] [모집 Offering]                 │
│ [활성 Enrollment] [활성 Pass]                 │
├──────────────────────────────────────────────┤
│ [Course] [Offering]                          │
│ [Enrollment] [CoursePass]                    │
├──────────────────────────────────────────────┤
│ State panel 또는 active table은 horizontal scroll 유지 │
└──────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ 수강 관리        [Timeline]   │
├──────────────────────────────┤
│ [Course]                     │
│ [CourseOffering]             │
│ [Enrollment / Pass]          │
│ [Timeline / Reservation]     │
├──────────────────────────────┤
│ 운영 Course                  │
│ 모집 Offering                │
│ 활성 Enrollment              │
│ 활성 Pass                    │
├──────────────────────────────┤
│ Section tabs stack           │
├──────────────────────────────┤
│ State panel / active table   │
└──────────────────────────────┘
```

## 공개 계약

| 항목 | 설명 |
|------|------|
| CourseManagementSectionId | Course 관리 섹션 식별자 |
| CourseManagementSection | route tab/summary 계약 |
| CourseManagementCourse | Course 목록 row 계약 |
| CourseManagementOffering | CourseOffering 목록 row 계약 |
| CourseManagementEnrollment | Enrollment 목록 row 계약 |
| CourseManagementPass | CoursePass 목록 row 계약 |
| CourseManagementQueryState | Orval loading/fetching/error 상태 계약 |
| CourseManagementPageProps | pure page 입력 계약 |
| CourseManagementPage | Course 계열 admin pure page |

## 의존성

| 모듈 | 용도 |
|------|------|
| ../../feature/course-management | CourseManagementConsole feature |
| ../../widget | PageTitleBar |
| ../../rhythm | VStack |
| @cocrepo/ui/heroui | Button |
| lucide-react | action icon |
| mobx-react-lite | observer wrapper |

## 하위 조합

| 계층 | 컴포넌트 | 책임 |
|------|----------|------|
| Feature | CourseManagementConsole | Course 계열 업무 콘솔 조합 |
| Widget | CourseFlowRail | Course → Reservation 운영 흐름 |
| Widget | CourseMetricGrid | 도메인별 건수 요약 |
| Widget | CourseSectionTabs | active section 선택 |
| Widget | CourseTableStatePanel | active section의 loading/refreshing/error/empty 상태 표시 |
| Widget | CourseTable / CourseOfferingTable / CourseEnrollmentTable / CoursePassTable | 각 도메인 row 표시 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | CourseManagementQueryState와 표 영역 상태 패널 계약 추가 | codex |
| 2026-05-09 | page 내부 lower-layer 구현을 CourseManagementConsole feature와 course-management widget 계층으로 분리하고 텍스트 화면 러프 추가 | codex |
| 2026-05-09 | Course/CourseOffering/Enrollment/CoursePass 책임 분리 콘솔 pure page 추가 | codex |
