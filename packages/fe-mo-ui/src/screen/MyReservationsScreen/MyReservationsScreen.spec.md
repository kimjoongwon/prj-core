# MyReservationsScreen 계약서

## 대상

- `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.tsx`
- `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.stories.tsx`
- `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.test.tsx`

## 목적

모바일 `/reservations` 탭의 내 예약/대기 목록 visual composition을 소유한다. route file은 `getMyReservations` API 연동과 `ReservationDto -> MyReservationCardItem` mapping만 담당한다.

## Props 계약

| Prop | 타입 | 책임 |
| --- | --- | --- |
| `items` | `readonly MyReservationCardItem[]` | screen 전용 표시 모델. route가 `ReservationDto`에서 변환한다. |
| `status` | `loading` / `error` / `empty` / `ready` | 목록 상태. route가 API 상태와 빈 목록을 판정한다. |
| `errorDescription` | `ReactNode` | error 상태에서 노출할 사용자 메시지. |
| `onPressRetry` | `() => void` | error/empty 상태의 재조회 이벤트. route가 React Query `refetch`를 연결한다. |

## 화면 러프

### Visual Snapshot

component명 없이 사용자가 보게 될 밀도와 분위기만 그린다.

```text
┌────────────────────────────────────┐
│ 내 예약                              │
│ 예약 확정과 대기 상태를 실제 기준으로 확인 │
│                                    │
│  5월 9일                 예약 확정  │
│  Morning Reformer                  │
│  09:30 · Studio A · Coach Hana     │
│  상체 강도는 낮춰 주세요.              │
│                                    │
│  5월 16일                  대기 2번 │
│  Weekend Barre                     │
│  11:00 · Studio B · Coach Jin      │
└────────────────────────────────────┘

loading
┌────────────────────────────────────┐
│ 내 예약을 불러오는 중                  │
│ 예약과 대기 목록을 확인하고 있습니다.     │
└────────────────────────────────────┘

empty/error
┌────────────────────────────────────┐
│ 아직 예약이 없습니다                    │
│ 홈에서 수업을 선택하면 이곳에 표시됩니다.  │
│ [목록 새로고침]                       │
└────────────────────────────────────┘
```

### Annotated Wireframe

component와 계층을 표시해 개발자가 바로 구현 경계를 읽을 수 있게 한다.

```text
Route Layout
┌────────────────────────────────────┐
│ CustomHeader: 상단 safe-area/header │  A
└────────────────────────────────────┘

Screen Owner
┌────────────────────────────────────┐
│ ScreenFrame(edges: right,left)      │  B
│ ┌────────────────────────────────┐ │
│ │ Header copy                    │ │  C
│ │ "내 예약" + 설명                  │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ Reservation card block         │ │  D
│ │ Icon(calendarCheck) + date      │ │
│ │ Icon(badgeCheck) + status badge │ │
│ │ title / meta / memo             │ │
│ └────────────────────────────────┘ │
│ StatusFeedback                     │  E: loading/empty/error
└────────────────────────────────────┘
```

## 렌더링 계약

- Expo Router의 `CustomHeader`가 상단 safe-area와 header를 소유하고, screen은 본문 safe-area shell만 적용한다.
- `ScreenFrame`으로 본문 safe-area shell을 적용한다.
- 시각 스타일은 `StyleSheet`가 아니라 uniwind `className`과 `tailwind-variants` slot/variant로 정의한다.
- render tree는 JSX로 작성하고 `createElement` 기반 visual composition을 사용하지 않는다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui` `Text` primitive로 감싸고, `react-native` `Text`를 직접 import하지 않는다.
- 상태별 feedback과 예약 카드 반복 JSX는 별도 `render*` helper나 재사용 목적 없는 조각 컴포넌트로 분리하지 않고 `MyReservationsScreen` 본문 안에서 직접 조합한다.
- `MyReservationsScreen.tsx`는 하나의 owner component만 가진다. 예약 카드가 재사용 component로 승격되면 별도 파일로 분리하고 `fe-widget-agent`가 story/test까지 함께 소유한다.
- 색상은 heroui-native semantic token(`background`, `surface`, `foreground`, `muted`, `accent`, `border`)을 사용한다.
- 내 예약 목록은 Linear/Stripe 계열의 dense premium 톤을 따른다. 본문은 muted neutral 배경 위에 shadow 없는 subtle border 카드, 8pt 리듬(`px-4`, `gap-4`, `gap-2`, `p-4`)과 `rounded-lg` 중심으로 표현한다.
- 아이콘은 예약일(`calendarCheck`)과 예약 상태 badge(`badgeCheck`)처럼 목록 scan 속도를 높이는 semantic cue로만 사용한다.
- ready 상태에서는 예약일, 상태, 제목, 메타, memo를 카드로 표시한다.
- loading/empty/error 상태는 `StatusFeedback`으로 표시한다.
- API hook, router, route params, app alias, backend DTO를 직접 import하지 않는다.

## Screen Planning Elements

| 분류 | 필요한 요소 | 재사용/신규 | 소스/대상 | 담당 `agent_type` | 화면 책임 |
| --- | --- | --- | --- | --- | --- |
| Mobile Screen | `MyReservationsScreen` | modify | `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.tsx` | `fe-screen-agent` | visual owner. API/route import 금지. |
| Storybook | screen 상태 story | modify | `MyReservationsScreen.stories.tsx` | `fe-screen-agent` | ready, loading, empty, error, long text variant를 표현한다. |
| Unit Test | screen 상태/이벤트 테스트 | modify | `MyReservationsScreen.test.tsx` | `fe-screen-agent` | 상태 분기, 카드 필드, retry 위임을 검증한다. |

## Component Inventory

| 영역 | 컴포넌트 | 계층 | 재사용/신규 | 소스/대상 | Props/이벤트 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B. 본문 shell | `ScreenFrame` | Layout primitive | reuse | `packages/fe-mo-ui/src/layout/ScreenFrame/index.tsx` | `edges`, `className`, `contentClassName` | `fe-display-agent` | `fe-screen-agent` |
| C. 화면 제목 | screen-local header copy | Screen block | modify | `MyReservationsScreen.tsx` | title, description | `fe-screen-agent` | `fe-screen-agent` |
| D. 예약 카드 반복 | screen-local card block | Screen block | modify | `MyReservationsScreen.tsx` | `MyReservationCardItem` fields | `fe-screen-agent` | `fe-screen-agent` |
| D-1. 날짜/상태 cue | `Icon` | Data display | reuse | `packages/fe-mo-ui/src/icon` | `calendarCheck`, `badgeCheck`, tone | `fe-display-agent` | `fe-screen-agent` |
| E. 상태 feedback | `StatusFeedback` | Feedback | reuse | `packages/fe-mo-ui/src/feedback/StatusFeedback/index.tsx` | `status`, title, description, primary action | `fe-display-agent` | `fe-screen-agent` |

## State Rendering Contract

| 상태 | 렌더링 | 사용자 문구 방향 | 이벤트 |
| --- | --- | --- | --- |
| `ready` | 예약 카드 목록 | 날짜, 수업명, 시간/지점/코치, 메모를 빠르게 스캔하게 한다. | 없음 |
| `loading` | `StatusFeedback` | "내 예약을 불러오는 중"처럼 진행 중인 일을 설명한다. | 없음 |
| `empty` | `StatusFeedback` | 예약이 없는 이유와 홈에서 다음 행동을 안내한다. | `onPressRetry` |
| `error` | `StatusFeedback` | 실패 이유를 짧게 설명하고 다시 시도할 수 있게 한다. | `onPressRetry` |

## Route Dependency Contract

이 screen planning spec은 화면 조합만 소유한다. route/API/backend/codegen/E2E 실행 판단은 route delivery spec에서 관리한다.

| 의존 대상 | 위치 | 담당 `agent_type` | screen에서 보는 계약 | 비고 |
| --- | --- | --- | --- | --- |
| `/reservations` route delivery | `apps/mobile/src/app/index.spec.md` | `orch-delivery` | `MyReservationsScreen`을 planning reference로 소비한다. | route 실행 순서와 API 변경 여부를 소유한다. |
| `/reservations` route source | `apps/mobile/src/app/(tabs)/reservations.tsx` | `fe-route-agent` | `items`, `status`, `errorDescription`, `onPressRetry` props만 전달한다. | Orval hook과 DTO mapping은 screen에 노출하지 않는다. |
| API client | `useGetMyReservations` | `fe-route-agent` | screen은 API client를 import하지 않는다. | API 변경 시 route delivery spec의 foundation/API 표에 반영한다. |
| E2E | mobile route flow | `qa-mo-e2e-testing` | screen spec은 E2E 흐름을 소유하지 않는다. | route delivery spec의 QA 항목에서 관리한다. |

## Storybook / Test Contract

### Storybook

| 대상 | Story 파일 | 필수 상태/Variant | Fixture/데이터 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
| --- | --- | --- | --- | --- | --- | --- |
| `MyReservationsScreen` | `MyReservationsScreen.stories.tsx` | ready, loading, empty, error, long text | 예약 확정, 대기, memo 있음/없음, 긴 지점/수업명 | `fe-screen-agent` | `qa-mo-testing` | route/API mocking 없이 props fixture로 표현한다. |

### Unit Test

| 대상 | Test 파일 | 검증 관점 | 주요 케이스 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
| --- | --- | --- | --- | --- | --- | --- |
| `MyReservationsScreen` | `MyReservationsScreen.test.tsx` | 상태 분기, 카드 필드, retry 위임 | ready card, loading, empty retry, error retry, optional memo/meta | `fe-screen-agent` | `qa-mo-testing` | API hook mocking 없이 props 기반으로 검증한다. |

## Planning QA

- screen source를 수정하면 `MyReservationsScreen.stories.tsx`와 `MyReservationsScreen.test.tsx`를 같은 작업에서 갱신한다.
- Storybook은 ready, loading, empty, error, long text/memo variant를 확인 가능해야 한다.
- Unit test는 ready card, loading feedback, empty retry, error retry, optional memo/meta 렌더링을 검증한다.
- route/API 변경, route test, E2E, codegen 검증은 route delivery spec으로 이동한다.
- 권장 검증 명령:
  - `pnpm --filter=@cocrepo/mo-ui test -- MyReservationsScreen.test.tsx`

## Planning Re-entry Rules

| 조건 | 사유 | re-entry `agent_type` | 처리 |
| --- | --- | --- | --- |
| `MyReservationCardItem` 표시 필드가 부족함 | screen이 필요한 텍스트/상태를 props로 받을 수 없음 | `fe-route-agent` | route display model을 갱신하고 route delivery spec에 반영한다. |
| 예약 카드가 다른 화면에서도 필요 | screen-local JSX가 재사용 component가 됨 | `fe-widget-agent` | 별도 widget 파일로 분리하고 story/test를 함께 작성한다. |
| loading/error/empty 표현이 공통 feedback으로 부족 | reusable feedback 수정 필요 | `fe-display-agent` | `StatusFeedback` 계약을 먼저 갱신한다. |
| story/unit test가 화면 계약과 불일치 | planning spec과 구현이 어긋남 | `fe-screen-agent` / `qa-mo-testing` | source, story, unit test를 같은 화면 계약으로 맞춘다. |

## 변경 이력

| 날짜 | 변경 내용 |
| --- | --- |
| 2026-05-24 | 화면 내부 텍스트를 `@cocrepo/mo-ui` `Text` primitive로 감싸도록 렌더링 계약을 추가했습니다. |
| 2026-05-24 | Route Delivery Spec 정책에 맞춰 screen planning spec에서 route/API 실행 세부표를 제거하고 Route 의존 계약, screen component inventory, story/unit test 계약으로 축약했습니다. |
| 2026-05-13 | 내 예약 카드의 날짜/상태 영역에 semantic icon cue를 추가하는 계약을 반영했습니다. |
| 2026-05-13 | Linear/Stripe 계열의 조밀한 프리미엄 모바일 톤을 반영해 shadow 제거, subtle border, 8pt 리듬, 작은 radius 계약을 추가했습니다. |
| 2026-05-11 | 예약 목록 상태/카드 JSX를 screen 본문 안으로 인라인하고 `render*` helper 및 일회성 조각 컴포넌트 금지 계약을 추가했습니다. |
| 2026-05-11 | screen render tree를 JSX로 전환하고 `createElement` 기반 visual composition 금지 계약을 추가했습니다. |
| 2026-05-10 | Expo Router `CustomHeader` 아래에서 본문 safe-area만 소유하고 heroui-native semantic token을 쓰도록 렌더링 계약을 갱신했습니다. |
| 2026-05-09 | screen 스타일 계약을 uniwind className과 tailwind-variants slot 기반으로 정리했습니다. |
| 2026-05-09 | screen visual owner spec에 Markdown 화면 스케치를 추가했습니다. |
| 2026-05-09 | `/reservations` route의 visual owner를 route file에서 shared screen component로 복구했습니다. |
