# MyReservationsScreen 계약서

## 대상

- `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.tsx`

## 목적

모바일 `/reservations` 탭의 내 예약/대기 목록 visual composition을 소유한다. route file은 `getMyReservations` API 연동과 `ReservationDto -> MyReservationCardItem` mapping만 담당한다.

## Props 계약

- `items`: screen 전용 표시 타입인 `MyReservationCardItem[]`.
- `status`: `loading`, `error`, `empty`, `ready` 중 하나의 목록 상태.
- `errorDescription`: error 상태에서 노출할 사용자 메시지.
- `onPressRetry`: error/empty 상태의 재조회 handler.

## 화면 스케치

```text
┌────────────────────────────────────┐
│ 내 예약                              │
│ 예약 확정과 대기 상태를 실제 Reservation │
│ API 기준으로 확인합니다.                │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 5월 9일              예약 확정  │ │
│ │ F45 Strength                    │ │
│ │ 10:00 · Gangnam Studio          │ │
│ │ Morning Class                   │ │
│ │ front desk note                 │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ 5월 10일              대기중    │ │
│ │ HIIT Waitlist                   │ │
│ │ 19:00 · Gangnam Studio          │ │
│ │ Evening Class · 대기 2번         │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘

loading:
┌────────────────────────────────────┐
│ 내 예약을 불러오는 중                  │
│ 예약과 대기 목록을 확인하고 있습니다.     │
└────────────────────────────────────┘

empty/error:
┌────────────────────────────────────┐
│ 아직 예약이 없습니다                    │
│ 홈에서 수업을 선택하면 예약 또는 대기...   │
│ [목록 새로고침]                       │
└────────────────────────────────────┘
```

## 렌더링 계약

- Expo Router의 `CustomHeader`가 상단 safe-area와 header를 소유하고, screen은 본문 safe-area shell만 적용한다.
- `ScreenFrame`으로 본문 safe-area shell을 적용한다.
- 시각 스타일은 `StyleSheet`가 아니라 uniwind `className`과 `tailwind-variants` slot/variant로 정의한다.
- render tree는 JSX로 작성하고 `createElement` 기반 visual composition을 사용하지 않는다.
- 상태별 feedback과 예약 카드 반복 JSX는 별도 `render*` helper나 재사용 목적 없는 조각 컴포넌트로 분리하지 않고 `MyReservationsScreen` 본문 안에서 직접 조합한다.
- 색상은 heroui-native semantic token(`background`, `surface`, `foreground`, `muted`, `accent`, `border`)을 사용한다.
- 내 예약 목록은 Linear/Stripe 계열의 dense premium 톤을 따른다. 본문은 muted neutral 배경 위에 shadow 없는 subtle border 카드, 8pt 리듬(`px-4`, `gap-4`, `gap-2`, `p-4`)과 `rounded-lg` 중심으로 표현한다.
- 아이콘은 예약일(`calendarCheck`)과 예약 상태 badge(`badgeCheck`)처럼 목록 scan 속도를 높이는 semantic cue로만 사용한다.
- ready 상태에서는 예약일, 상태, 제목, 메타, memo를 카드로 표시한다.
- loading/empty/error 상태는 `StatusFeedback`으로 표시한다.
- API hook, router, route params, app alias, backend DTO를 직접 import하지 않는다.

## 변경 이력

| 날짜       | 변경 내용                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-13 | 내 예약 카드의 날짜/상태 영역에 semantic icon cue를 추가하는 계약을 반영했습니다.                                              |
| 2026-05-13 | Linear/Stripe 계열의 조밀한 프리미엄 모바일 톤을 반영해 shadow 제거, subtle border, 8pt 리듬, 작은 radius 계약을 추가했습니다. |
| 2026-05-11 | 예약 목록 상태/카드 JSX를 screen 본문 안으로 인라인하고 `render*` helper 및 일회성 조각 컴포넌트 금지 계약을 추가했습니다.      |
| 2026-05-11 | screen render tree를 JSX로 전환하고 `createElement` 기반 visual composition 금지 계약을 추가했습니다.                           |
| 2026-05-10 | Expo Router `CustomHeader` 아래에서 본문 safe-area만 소유하고 heroui-native semantic token을 쓰도록 렌더링 계약을 갱신했습니다. |
| 2026-05-09 | screen 스타일 계약을 uniwind className과 tailwind-variants slot 기반으로 정리했습니다.                                          |
| 2026-05-09 | screen visual owner spec에 Markdown 화면 스케치를 추가했습니다.                                                                 |
| 2026-05-09 | `/reservations` route의 visual owner를 route file에서 shared screen component로 복구했습니다.                                   |
