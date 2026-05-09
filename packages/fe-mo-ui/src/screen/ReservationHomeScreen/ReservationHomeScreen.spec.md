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
│ ONORA BOOKING                      │
│ 오늘의 수업                         │
│ 지점의 예약 가능한 클래스와 내 예약 상태를 │
│ 날짜별로 확인합니다.                    │
│ ┌──────────────┐ ┌──────────────┐  │
│ │ 조회 기간     │ │ 내 예약       │  │
│ │ 14일         │ │ 2            │  │
│ └──────────────┘ └──────────────┘  │
│                                    │
│ 날짜                                │
│ 클래스를 볼 날짜를 선택하세요.             │
│ [오늘 토 3] [5/10 일 4] [5/11 월 2]  │
│                                    │
│ [전체] [예약 가능] [내 예약] [대기 가능]  │
│ 최신 예약 상태를 확인 중입니다.            │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 10:00 - 11:00   예약 가능       │ │
│ │ F45 Strength                    │ │
│ │ Morning Class · Gangnam Studio  │ │
│ │ Coach Kim · INTERMEDIATE        │ │
│ │ Capacity 18 / Confirmed 12      │ │
│ │ [Squat] [Row]                   │ │
│ │                         [예약]  │ │
│ └────────────────────────────────┘ │
│                                    │
│ 선택 날짜: 5월 9일 토요일              │
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

- `ScreenFrame`으로 safe-area shell을 적용한다.
- 시각 스타일은 `StyleSheet`가 아니라 uniwind `className`과 `tailwind-variants` slot/variant로 정의한다.
- `DateStrip`, `BookingClassCard`, `BookingPolicySheet`, `StatusFeedback`만 조합한다.
- API hook, router, route params, app alias, backend DTO를 직접 import하지 않는다.
- CTA, sheet 확인, retry, 날짜/필터 선택은 모두 route에서 받은 handler를 호출한다.

## 변경 이력

| 날짜 | 변경 내용 |
| --- | --- |
| 2026-05-09 | screen 스타일 계약을 uniwind className과 tailwind-variants slot 기반으로 정리했습니다. |
| 2026-05-09 | screen visual owner spec에 Markdown 화면 스케치를 추가했습니다. |
| 2026-05-09 | Reservation 홈 route의 visual owner를 route file에서 shared screen component로 복구했습니다. |
