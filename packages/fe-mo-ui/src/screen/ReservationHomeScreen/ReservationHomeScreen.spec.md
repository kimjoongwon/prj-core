# ReservationHomeScreen 계약서

## 대상

- `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.tsx`

## 목적

모바일 홈(`/`) 예약 피드의 page-level visual composition을 소유한다. route file은 API, route-local state, DTO mapping, cache invalidation만 처리하고 이 screen에 props와 handler를 전달한다.

## Props 계약

- `dateOptions`, `selectedDate`, `onSelectDate`: 날짜 스트립 표시와 선택 이벤트.
- `filterOptions`, `selectedFilter`, `onPressFilter`: `전체`, `예약 가능`, `내 예약`, `대기 가능` 필터 칩 표시와 선택 이벤트.
- `cardItems`, `feedStatus`, `feedErrorDescription`, `isFetching`, `onPressRetry`: booking feed 카드와 loading/empty/error/refetch 상태.
- `policySheet`: 정책 확인 sheet의 open 상태, 선택 카드, memo, confirm/cancel handler.
- `reservationSuccessDescription`, `reservationErrorDescription`: 예약 생성 결과 피드백.
- `bookingWindowDays`, `reservedCount`, `selectedDateLabel`: 홈 상단 요약과 선택 날짜 표시.

## 화면 스케치

```text
┌────────────────────────────────────┐
│ 예약 현황                           │
│ 5월 9일 토요일                       │
│ 예약 가능한 수업과 내 예약 상태를 한 화면에서 │
│ 확인합니다.                          │
│  조회 기간 14일  ·  내 예약 2  ·  표시 수업 3개 │
│                                    │
│ 예약 날짜                           │
│ 오늘부터 14일간의 예약 가능 수업입니다.     │
│ [오늘 토 3] [5/10 일 4] [5/11 월 2]  │
│                                    │
│ 수업 목록                           │
│ 5월 9일 토요일 기준으로 예약 상태를 보여줍니다.│
│ [전체] [예약 가능] [내 예약] [대기 가능]  │
│ 최신 예약 상태를 확인 중입니다.            │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 10:00 - 11:00  예약 가능        │ │
│ │ F45 Strength                    │ │
│ │ Morning Class · Gangnam Studio  │ │
│ │ Coach Kim · INTERMEDIATE        │ │
│ │ 잔여 6석 · 예약 12/18            │ │
│ │ [Squat] [Row]                   │ │
│ │                         [예약]  │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘

정책 sheet open:
┌────────────────────────────────────┐
│ 예약 정책 확인                       │
│ 10:00 - 11:00 · F45 Strength       │
│ Cancellation policy                │
│ 확정 예약은 시작 2시간 전까지...         │
│ 요청 메모                            │
│ ┌────────────────────────────────┐ │
│ │ 코치에게 전달할 메모              │ │
│ └────────────────────────────────┘ │
│ [닫기]                    [예약 확인] │
└────────────────────────────────────┘
```

## 렌더링 계약

- Expo Router의 `CustomHeader`가 상단 safe-area와 header를 소유하고, screen은 본문 safe-area 레이아웃만 적용한다.
- `ScreenFrame`으로 본문 safe-area 레이아웃을 적용한다.
- 시각 스타일은 `StyleSheet`가 아니라 uniwind `className`과 `tailwind-variants` slot/variant로 정의한다.
- render tree는 JSX로 작성하고 `createElement` 기반 visual composition을 사용하지 않는다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui` `Text` primitive로 감싸고, `react-native` `Text`를 직접 import하지 않는다.
- 상태별 feedback, filter chip, summary, card 반복 JSX는 별도 `render*` helper나 재사용 목적 없는 조각 컴포넌트로 분리하지 않고 `ReservationHomeScreen` 본문 안에서 직접 조합한다.
- 색상은 heroui-native semantic token(`background`, `surface`, `foreground`, `muted`, `accent`, `border`)을 사용한다.
- 모바일 예약 홈은 Linear/Stripe 계열의 dense premium 톤을 따르되, 첫 화면은 답답하게 보이지 않도록 summary와 section의 visual weight를 낮춘다. `background`는 밝은 neutral, 주요 surface는 border보다 면과 여백으로 구분하고, 요약/날짜/필터는 필요한 최소 border와 `font-bold` 중심으로 표현한다.
- 아이콘은 장식이 아니라 예약 맥락을 읽게 하는 semantic cue로만 사용한다. 요약 카드(`calendarRange`, `ticketCheck`, `listChecks`), 수업 카드의 시간/지점/정원/상태/CTA, 정책 확인 shield icon만 허용한다.
- `DateStrip`, `BookingClassCard`, `BookingPolicySheet`, `StatusFeedback`만 조합한다.
- screen 내부에서는 `CustomHeader`와 중복되는 큰 hero title을 만들지 않고, 선택 날짜 중심의 예약 현황 summary를 표시한다.
- API hook, router, route params, app alias, backend DTO를 직접 import하지 않는다.
- CTA, sheet 확인, retry, 날짜/필터 선택은 모두 route에서 받은 handler를 호출한다.