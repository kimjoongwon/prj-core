# ReservationPaymentCheckoutScreen 계약서

## 대상

- `packages/fe-mo-ui/src/screen/ReservationPaymentCheckoutScreen/ReservationPaymentCheckoutScreen.tsx`

## 목적

모바일 `/payments/checkout` route의 예약 결제 visual owner다. route file은 Expo Router params, Orval bootstrap/checkout hooks, React Query invalidate, API error mapping만 소유하고 이 screen에는 예약 요약, 과정 선택, 결제 방법 선택, 진행 상태, handler를 props로 전달한다.

## Props 계약

- `summaryItems`: 타임라인, 클래스, 세션, 회차 시간 등 route/backend가 확정한 예약 의도 요약.
- `courseOptions`: checkout bootstrap이 내려준 구매 가능한 CourseOffering 목록.
- `selectedCourseOfferingId`, `onSelectCourseOption`: 사용자가 결제할 과정/반/기수를 선택한다.
- `methodOptions`: placeholder 결제 수단 목록. v1 기본값은 카드/간편결제/계좌이체 계열이다.
- `selectedPaymentMethod`, `onSelectPaymentMethod`: 선택된 결제 수단을 route에 위임한다.
- `amountLabel`, `currencyLabel`: 선택된 과정의 가격 요약.
- `progressSteps`: 결제 요청 생성, 승인 처리, 수강권 활성화, 예약 확정 진행 상태.
- `status`: `idle`, `loading`, `submitting`, `success`, `error` 상태.
- `errorDescription`: route/API가 매핑한 사용자 표시 오류 문구.
- `isSubmitDisabled`, `submitLabel`: submit 버튼 상태와 문구.
- `onPressSubmit`: route가 `createReservationCheckout` mutation을 실행한다.
- `onPressReservations`: 성공 후 예약 내역으로 이동한다.

## 화면 스케치

```text
┌────────────────────────────────────┐
│ RESERVATION CHECKOUT               │
│ 결제 후 예약                         │
│ 선택한 수업에 필요한 과정을...          │
│                                    │
│ 예약하려는 수업                       │
│ 클래스  F45 Strength                │
│ 세션    Morning Class               │
│ 시간    10:00 - 11:00               │
│ 지점    Gangnam Studio              │
│ 결제 금액              450,000 KRW   │
│                                    │
│ 과정 선택                            │
│ (●) 초급 필라테스 6개월권  450,000 KRW│
│ ( ) 1:1 코칭 4회권       320,000 KRW │
│                                    │
│ 결제 방법                            │
│ [카드] [간편결제] [계좌이체]            │
│                                    │
│ 진행 상태                            │
│ ✓ 예약 정보 확인                      │
│ ✓ 결제 요청 생성                      │
│ … 결제 승인 처리                      │
│ ○ 수강권 활성화                       │
│ ○ 예약 확정                          │
│                                    │
│ [결제하고 예약하기]                    │
└────────────────────────────────────┘
```

## 렌더링 계약

- Expo Router의 `CustomHeader`가 상단 safe-area, title, back action을 소유하고, screen은 결제 본문만 렌더링한다.
- `ScreenFrame`으로 본문 safe-area 레이아웃을 적용한다.
- `StyleSheet`를 쓰지 않고 uniwind `className`과 `tailwind-variants` slot/variant만 사용한다.
- render tree는 JSX로 작성하고 `createElement` 기반 visual composition을 사용하지 않는다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui` `Text` primitive로 감싸고, `react-native` `Text`를 직접 import하지 않는다.
- 화면 본문과 본문이 조합하는 재사용 컴포넌트는 heroui-native/@cocrepo/mo-ui primitive로 표현 가능한 CTA, 컨테이너, 선택 컨트롤을 직접 `Pressable`/박스 조합으로 재구현하지 않고 `Button`, `Card`, `Radio` 같은 기존 컴포넌트를 우선 사용한다.
- 상태별 feedback, 진행 상태, submit CTA는 별도 `render*` helper, return 밖 JSX 변수, 재사용 목적 없는 조각 컴포넌트로 분리하지 않고 returned JSX 안에서 직접 조합한다.
- 색상은 heroui-native semantic token(`background`, `surface`, `foreground`, `muted`, `accent`, `border`)을 사용한다.
- 예약 결제 화면은 Linear/Stripe 계열의 dense premium 톤을 따른다. 결제 요약, 선택 카드, 진행 상태는 shadow 대신 subtle border, muted neutral 배경, 8pt 리듬(`px-4`, `gap-4`, `gap-2`, `p-4`)과 `rounded-lg` 중심으로 표현한다.
- 아이콘은 결제 의도와 신뢰감을 보강하는 semantic cue로만 사용한다. checkout header/summary는 `receipt`, 과정 선택은 `walletCards`, 결제 방법은 `creditCard`, 진행 상태는 `circleCheck`/`hourglass`/`circle`을 사용한다.
- 예약 요약 조각은 `ReservationCheckoutSummary`가 소유한다.
- 과정/결제수단 선택은 `SelectableCardList` 같은 selection 계층으로 분리한다.
- API hook, route params, app alias, backend DTO를 직접 import하지 않는다.
- 결제 provider별 SDK, redirect, deep link 구현은 route/API integration 단계에서 주입되며 screen은 provider-neutral placeholder UX만 렌더링한다.
- 성공 상태는 “수강권 활성화 + 예약 확정” 완료로 보여주고 `예약 내역 보기` 액션을 제공한다.