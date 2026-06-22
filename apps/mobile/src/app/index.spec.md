# mobile home route 계약서

> 생성일: 2026-05-04
> 수정일: 2026-05-24
> 타입: expo-route-delivery-context
> route: `/`
> owner route file: `apps/mobile/src/app/(tabs)/index.tsx`
> 상위 service spec: `docs/services/mobile-reservation.delivery.spec.md`

## 목적

모바일 홈(`/`)은 인증된 사용자가 F45/하이파이브식 날짜 스트립에서 수업 회차를 고르고, 클래스 카드의 CTA로 예약 또는 대기를 생성하는 첫 화면이다. `/reservations` 탭은 로그인 사용자 본인의 예약/대기 목록을 실제 Reservation API로 확인하는 최소 목록 화면이다.

## Route Mapping

| route | route file | 설명 |
|-------|------------|------|
| `/` | `apps/mobile/src/app/(tabs)/index.tsx` | 날짜 스트립 + 수업 카드 booking feed + 예약 정책 sheet |
| `/payments/checkout` | `apps/mobile/src/app/payments/checkout.tsx` | 활성 수강권이 없는 예약 의도의 provider-neutral 예약 결제 checkout |
| `/select-space` | `apps/mobile/src/app/select-space.tsx` | 인증 직후 또는 지점 변경 시 `x-space-id`를 확정하는 지점 선택 화면 |
| `/reservations` | `apps/mobile/src/app/(tabs)/reservations.tsx` | `getMyReservations` 기반 내 예약/대기 목록 |
| `/profile` | `apps/mobile/src/app/(tabs)/profile.tsx` | 마이 페이지 + 계정 상태 + 빠른 이동 + 로그아웃 |
| `/(tabs)` | `apps/mobile/src/app/(tabs)/_layout.tsx` | Expo Router 하단 탭 layout |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | QueryClientProvider-first layout + DesignSystemProvider + AuthSessionGate + IDP bootstrap layout |
| `/auth/login` | `apps/mobile/src/app/auth/login.tsx` | first-party native email/password 로그인 route |

## Shared Screen Targets

| route | shared screen target | screen spec | route boundary |
|-------|----------------------|-------------|----------------|
| `/` | `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.tsx` | `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.spec.md` | route는 Orval hook, query invalidation, DTO mapping, route-local state만 소유하고 screen에 props/handler를 전달한다. |
| `/payments/checkout` | `packages/fe-mo-ui/src/screen/ReservationPaymentCheckoutScreen/ReservationPaymentCheckoutScreen.tsx` | `packages/fe-mo-ui/src/screen/ReservationPaymentCheckoutScreen/ReservationPaymentCheckoutScreen.spec.md` | route는 checkout params, bootstrap/checkout Orval hooks, cache invalidate, navigation만 소유한다. |
| `/reservations` | `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.tsx` | `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.spec.md` | route는 `getMyReservations` API wiring과 `ReservationDto -> MyReservationCardItem` mapping만 소유한다. |
| `/profile` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.spec.md` | route는 auth/session/current-space state, quick action navigation, logout wiring만 소유한다. |
| `/auth/login` | `packages/fe-mo-ui/src/screen/NativeAuthLoginScreen/NativeAuthLoginScreen.tsx` | `packages/fe-mo-ui/src/screen/NativeAuthLoginScreen/NativeAuthLoginScreen.spec.md` | Stage 2에서 로그인 visual owner를 shared screen으로 승격하고, route는 email/password form state, native login mutation, SecureStore restore/logout wiring만 소유한다. |
| `/select-space` | `packages/fe-mo-ui/src/screen/SpaceSelectScreen/SpaceSelectScreen.tsx` | `packages/fe-mo-ui/src/screen/SpaceSelectScreen/SpaceSelectScreen.spec.md` | route는 `getMySpaces`, `setCurrentSpace`, SecureStore 저장, 홈 이동만 소유하고 화면은 지점 목록/상태 표시만 담당한다. |

## Mobile Visual System

- 모바일 전역 톤은 루트 `DESIGN.md`의 따뜻한 예약 운영 플랫폼 원칙을 따른다.
- 배경은 기존 mobile theme 역할(`background`, `surface`, `foreground`, `muted`, `border`)을 사용하고, card/list는 shadow보다 subtle border와 충분한 padding으로 분리한다.
- 화면 여백은 semantic rhythm 중심으로 유지한다: page/screen 주요 블록은 `section`, 카드 내부는 `block`, row metadata는 `dense`, action row는 `inline`을 우선한다.
- 카드와 주요 control은 중간 radius를 유지하며, 상태색은 `success`, `warning`, `danger`, `muted` 역할을 label/icon/text와 함께 사용한다.
- 아이콘은 `@cocrepo/mo-ui` `Icon` primitive와 curated `mobileIcons`만 사용한다. 하단 탭, 로그인 input/CTA, 예약 metadata, 상태 badge, 결제 신뢰 cue처럼 사용자의 scan/decision을 돕는 곳에만 배치한다.
- 로그인, 하단 탭, 프로필 route도 같은 토큰/간격/radius 계약을 따른다.

## Home UX

| 영역 | 계약 |
|------|------|
| 상단 컨텍스트 | Expo Router `CustomHeader`가 “오늘의 수업” 제목을 소유하고, 본문은 선택 날짜 중심의 예약 현황 summary로 조회 기간/내 예약 수/표시 수업 수를 요약한다. |
| 현재 지점 | `CustomHeader` subtitle은 현재 선택된 지점명을 표시하며, 누르면 `SpaceSelectionSheet`로 지점을 변경한다. 변경 완료 후 Core/IDP API `x-space-id` scope와 React Query cache를 갱신한다. |
| 날짜 스트립 | `@cocrepo/mo-ui` `DateStrip`으로 오늘부터 14일을 표시하며, 날짜별 feed item count를 함께 보여준다. |
| 필터 칩 | `전체`, `예약 가능`, `내 예약`, `대기 가능`을 route-local filter로 제공한다. |
| 수업 카드 | `ReservationHomeScreen`이 `BookingClassCard`를 조합해 시간, 프로그램명, 세션명, 타임라인명, 코치, 난이도, 루틴, 운동 미리보기, 잔여석/예약 수/대기 수, 상태, CTA를 한 카드에 표시한다. |
| 정책 sheet | 예약/대기 CTA를 누르면 `ReservationHomeScreen`의 `BookingPolicySheet`가 취소 정책과 memo 입력을 보여주고, 확인 이벤트는 route가 받아 `createReservation`을 호출한다. |

### CTA 상태

| `availabilityStatus` | CTA | 동작 |
|----------------------|-----|------|
| `AVAILABLE` | `예약` | 정책 확인 후 확정 예약 요청 |
| `FEW_LEFT` | `예약` | 정책 확인 후 확정 예약 요청 |
| `WAITLIST_OPEN` | `대기` | 정책 확인 후 대기 등록 요청 |
| `AVAILABLE`/`FEW_LEFT`/`WAITLIST_OPEN` + `paymentRequired = true` | `결제 후 예약` 또는 `결제 후 대기` | `/payments/checkout`으로 이동해 과정 선택, 결제 수단 선택, 결제 후 예약 확정을 진행 |
| `RESERVED` | `예약됨` | 카드 CTA disabled |
| `WAITLISTED` | `대기중` | 카드 CTA disabled |
| `BOOKING_CLOSED` | `마감` | 카드 CTA disabled |

## API 계약

모바일 route는 API client를 직접 만들지 않고 `@cocrepo/api`의 Orval 생성 hook만 사용한다. `request.baseURL`은 `apps/mobile/src/auth/auth-config.ts`의 `getCoreApiBaseUrl()`로 주입한다.

| operationId | hook | method/path | owner |
|-------------|------|-------------|-------|
| `getReservationBookingFeed` | `useGetReservationBookingFeed` | `GET /api/v1/reservations/booking-feed` | `/` 홈 feed |
| `createReservation` | `useCreateReservation` | `POST /api/v1/reservations` | `/` 정책 sheet 확인 |
| `getMyReservations` | `useGetMyReservations` | `GET /api/v1/reservations/me` | `/reservations` 탭 |
| `cancelMyReservation` | `useCancelMyReservation` | `PATCH /api/v1/reservations/me/:reservationId/cancel` | future 목록/상세 취소 |
| `getReservationCheckoutBootstrap` | `useGetReservationCheckoutBootstrap` | `GET /api/v1/reservations/checkout/bootstrap` | `/payments/checkout` 과정/가격/결제수단 bootstrap |
| `createReservationCheckout` | `useCreateReservationCheckout` | `POST /api/v1/reservations/checkout` | `/payments/checkout` 결제 원장 + 수강권 + 예약 확정 |
| `nativeLogin` | generated mutation | `POST /api/v1/auth/login` | `/auth/login` first-party native 로그인 |
| `nativeRefreshToken` | generated mutation 또는 axios native refresh handler | `POST /api/v1/auth/native/token/refresh` | mobile access token 401 refresh |
| `nativeLogout` | generated mutation 또는 auth store request | `POST /api/v1/auth/native/logout` | `/profile` 로그아웃 |
| `getMySpaces` | `useGetMySpaces` | `GET /api/v1/auth/my-spaces` | `/select-space` 지점 선택 + 홈 헤더 지점 변경 |
| `setCurrentSpace` | `useSetCurrentSpace` | `POST /api/v1/auth/current-space` | 선택 지점 검증 후 `x-space-id` 확정 |

## Space Selection 계약

- 인증 직후 저장된 지점 선택이 없으면 `AuthSessionGate`가 `/select-space`로 보낸다.
- `/select-space`는 인증된 사용자가 접근 가능한 지점을 모두 보여주되, `플랫폼 운영본부`/system space는 노출하지 않는다.
- 사용자가 지점을 누르면 `setCurrentSpace({ spaceId })`로 접근 가능한 지점인지 검증하고, 성공 시 `mobileApiScopeStore`와 SecureStore에 선택 정보를 저장한다.
- 이후 `@cocrepo/api` Core/IDP axios interceptor는 저장된 `spaceId`를 `x-space-id` 헤더로 넣는다.
- 홈 상단 지점명 버튼은 같은 지점 리스트 UI를 `SpaceSelectionSheet`에서 재사용한다.

`getReservationBookingFeed` query:

```ts
{
  dateFrom?: string;
  dateTo?: string;
  timeZone?: "Asia/Seoul" | string;
  timelineId?: string;
  programId?: string;
  search?: string;
  skip?: number;
  take?: number;
}
```

- 홈은 14일치 날짜 스트립과 수업 카드를 한 번에 구성하므로 `take: 200`으로 요청해 지점별 다수 수업 seed가 뒤쪽 날짜에서 잘리지 않게 한다.

`createReservation` body:

```ts
{
  timelineId: string;
  sessionId: string;
  programId: string;
  occurrenceStartAt: string;
  memo?: string;
  idempotencyKey: string;
}
```

## State Ownership

홈 예약 흐름은 단일 route 전용 상태이므로 shared MobX store를 만들지 않는다.

```ts
type HomeBookingState = {
  selectedDate: string;
  selectedFeedItem: BookingFeedItemDto | null;
  isPolicySheetOpen: boolean;
  memo: string;
  idempotencyKey: string;
  selectedFilter: "all" | "bookable" | "mine" | "waitlist";
};
```

`/payments/checkout` route는 단일 route 전용 state만 소유한다.

```ts
type ReservationPaymentCheckoutRouteState = {
  idempotencyKey: string;
  selectedCourseOfferingId: string | null;
  selectedPaymentMethod: PaymentMethod | null;
};
```

예약 성공 후에는 React Query cache만 갱신한다.

- `getGetReservationBookingFeedQueryKey(feedParams)` invalidate
- `getGetMyReservationsQueryKey({ skip: 0, take: 20 })` invalidate

화면 visual composition은 `ReservationHomeScreen`과 `MyReservationsScreen`이 소유한다. route file은 DTO를 screen 전용 props로 변환하고 API/state/native wiring만 담당한다.

## Backend 정책 요약

| 정책 | 계약 |
|------|------|
| identity/scope | `spaceId`, `userId`는 client payload가 아니라 `SpaceContext`, `AuthContext`에서 확정한다. |
| 연결 검증 | `Program -> Session -> Timeline` 연결이 payload와 다르면 `404`를 반환한다. |
| 중복 | 동일 user + program + occurrence의 active 예약(`CONFIRMED`, `WAITLISTED`)은 `409`를 반환한다. |
| idempotency | 동일 user + `idempotencyKey`는 기존 예약을 반환한다. |
| 정원 | 좌석이 남으면 `CONFIRMED`, 없으면 `WAITLISTED`와 다음 `waitlistPosition`을 부여한다. |
| 취소 | `CONFIRMED`는 시작 2시간 전까지, `WAITLISTED`는 시작 전까지 허용한다. |
| 승격 | 확정 예약 취소로 자리가 생기면 가장 오래된 `WAITLISTED` 1건을 `CONFIRMED`로 승격한다. |

## `/reservations` 계약

- `apps/mobile/src/app/(tabs)/reservations.tsx`는 `upcomingReservations` 더미 데이터를 사용하지 않는다.
- `useGetMyReservations({ skip: 0, take: 20 })` 결과를 예약 카드로 렌더링한다.
- 카드에는 예약일, 상태(`CONFIRMED`, `WAITLISTED`, `CANCELED`), 프로그램명, 시간, 타임라인/세션명, 대기 순번, memo를 표시한다.
- loading, empty, error + retry 상태를 `StatusFeedback`으로 렌더링한다.

## `/profile` 마이 페이지 계약

- `apps/mobile/src/app/(tabs)/profile.tsx`는 route-local JSX로 마이 페이지 본문을 직접 조합하지 않는다.
- visual composition은 `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx`가 소유한다.
- route는 `mobileAuthStore.isAuthenticated`, `mobileAuthStore.isVerifying`, `mobileApiScopeStore.groundName`, `mobileApiScopeStore.spaceId`를 읽어 screen props로 전달한다.
- route는 quick action navigation과 logout wiring만 소유한다.
- 하단 탭 label과 header title은 "마이"로 맞춘다.
- 로그아웃은 `mobileAuthStore.logout()` 후 `/auth/login`으로 이동한다.
- `MyPageScreen`은 계정 summary, 현재 지점, 빠른 이동 action list, logout danger action을 렌더링한다.

## 딜리버리

### 상위 서비스 Spec

| 항목 | 내용 |
|------|------|
| service spec | `docs/services/mobile-reservation.delivery.spec.md` |
| service step | `MOBILE-RESERVATION-PROFILE` |
| route 역할 | 모바일 예약/내 정보 서비스의 route 실행 slice 묶음 |
| ownership | 모바일 예약 서비스 전체 route 목록, 인증/space/예약/결제/프로필 build order는 service spec이 소유하고, 이 문서는 기존 mobile route 실행 계약을 보조한다. |

### 목표

- 사용자 목표: 모바일 하단 탭의 `/profile`을 "마이 페이지"로 정리해 계정 상태, 현재 지점, 예약/결제 관련 빠른 이동, 로그아웃을 한 화면에서 제공한다.
- 대상 app/domain/platform: `apps/mobile`, Profile, Expo Router + React Native.
- 성공 기준:
  - `/profile` 하단 탭 라벨/헤더가 "마이" 기준으로 정리된다.
  - route file은 auth/logout/navigation wiring만 소유하고, visual composition은 `MyPageScreen`이 소유한다.
  - 구현 전 이 spec 기준 승인 gate를 통과한다.
  - 모바일 route/screen unit test가 마이 페이지 ready 상태와 로그아웃 wiring을 검증한다.
- Out of scope:
  - 신규 backend API, Orval codegen, 결제/예약 상세 기능 구현.
  - 앱 전역 인증 정책 변경.

### 디자인 정렬

| 항목 | 기준 |
|------|------|
| 제품 인상 | 루트 `DESIGN.md`의 따뜻한 예약 운영 플랫폼. `/profile`은 계정 상태와 다음 이동을 부드럽게 안내한다. |
| 플랫폼 기준 | Mobile 우선. safe area, bottom tab, 44px 이상 touch target, 로그아웃 button의 하단 겹침 방지를 고려한다. |
| 상태와 다음 행동 | 로그인 상태와 현재 지점을 먼저 보여주고, `QuickActionList`로 내 예약/결제/설정 이동을 제공한다. |
| 색상 역할 | `background`, `surface`, `foreground`, `muted`, `success`, `danger`, `border` 역할만 사용한다. 임의 hex와 외부 브랜드 palette를 쓰지 않는다. |
| 표면/형태 | Account/current-space/action-list는 부드러운 surface card/list group, 로그아웃은 danger full-width action으로 분리한다. |
| 리듬 | route는 visual rhythm을 직접 만들지 않고, `MyPageScreen`의 `리듬 / 레이아웃 계약`을 소비한다. |

### 화면 러프

```text
Visual Snapshot
┌─ 마이 · 광화문 스튜디오 ───────────────────────┐
│ ┌──────────────────────────────────────────┐ │
│ │ ◯  회원                         로그인됨 │ │
│ │    오노라 예약 알림과 계정 상태 관리       │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ 현재 지점                                │ │
│ │ 광화문 스튜디오                          │ │
│ └──────────────────────────────────────────┘ │
│ 빠른 이동                                   │
│ ┌──────────────────────────────────────────┐ │
│ │ 내 예약                              ›   │ │
│ │ 예약 확정과 대기 상태 확인                │ │
│ │ 결제/수강권                         ›   │ │
│ │ 알림/설정                           ›   │ │
│ └──────────────────────────────────────────┘ │
│ [ 로그아웃 ]                                │
└──────────────────────────────────────────────┘

Annotated Wireframe
Visual tone: mobile profile, warm service density, background canvas, surface cards, subtle border, medium radius
[route] (tabs)/_layout.tsx: CustomHeader("마이", currentSpaceName), bottom tab icon=userRound

┌─ /profile viewport ──────────────────────────────┐
│ ┌ A AccountSummaryCard surface border p-4 ────┐ │
│ │  userRound icon           회원   [로그인됨] │ │
│ │  오노라 예약 알림과 계정 상태 관리            │ │
│ └──────────────────────────────────────────────┘ │
│ ┌ B CurrentSpaceCard surface border p-4 ──────┐ │
│ │  mapPin  현재 지점                            │ │
│ │          광화문 스튜디오                      │ │
│ └──────────────────────────────────────────────┘ │
│ 빠른 이동                                       │
│ ┌ C QuickActionList ListGroup surface ────────┐ │
│ │  calendarCheck  내 예약              ›        │ │
│ │                 예약 확정과 대기 상태 확인    │ │
│ │  ticketCheck    결제/수강권          › muted  │ │
│ │  info           알림/설정            › muted  │ │
│ └──────────────────────────────────────────────┘ │
│ [ D danger Button full-width  로그아웃 ]         │
└──────────────────────────────────────────────────┘

Legend: A/B/D are screen-local sections inside `MyPageScreen`; C is reusable `QuickActionList` Widget that wraps existing `ListGroup`.
Rhythm: root screen vertical gap=section, card inner gap=block, row meta gap=dense, action list rows gap=flush, logout margin=section.
```

### 리듬 / 레이아웃 계약

| 영역 | 리듬 컴포넌트 | 방향/정렬 | gap preset | 감싸는 대상 | 재사용/신규 | 소스/대상 | 담당 `agent_type` | 비고 |
|------|---------------|-----------|------------|-------------|-------------|-----------|-------------------|------|
| route layout | `CustomHeader` + tab layout | route layout owned | n/a | header title/subtitle, bottom tab | reuse/modify | `apps/mobile/src/app/(tabs)/_layout.tsx` | `fe-route-layout-agent` | route는 body rhythm을 직접 만들지 않음 |
| screen root | `VStack` | vertical / stretch | `section` | account card, current space card, quick actions, logout | reuse | `packages/fe-mo-ui/src/rhythm/VStack` | `fe-screen-agent` | screen body의 기본 세로 rhythm owner |
| summary cards | `VStack` + `HStack` | vertical + row horizontal | `block`, `inline`, `dense` | account/current-space copy와 icon/status | reuse | `packages/fe-mo-ui/src/rhythm` | `fe-screen-agent` | 긴 이름/지점명 줄바꿈 허용 |
| quick actions | `VStack` + row `HStack` + `ListGroup` | vertical list / row horizontal | `flush`, row `inline`, meta `dense` | 내 예약/결제/설정 rows | new + reuse | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx` | `fe-widget-agent` | row touch target은 44px 이상 |
| logout action | `VStack` | vertical / stretch | `section` | danger full-width button | reuse | `packages/fe-mo-ui/src/rhythm/VStack`, `Button` | `fe-screen-agent` | bottom tab/safe area와 겹치지 않음 |

### 컴포넌트 인벤토리

| 영역 | 컴포넌트 | 계층 | 재사용/신규 | 소스/대상 | Props/이벤트 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` |
|------|-----------|------|-------------|-----------|--------------|-------------------------|---------------------------|
| route header | `CustomHeader` | Navigation/Layout | reuse | `packages/fe-mo-ui/src/navigation/CustomHeader` via `(tabs)/_layout.tsx` | title `"마이"`, subtitle `currentSpaceName` | `fe-control-agent` | `fe-route-layout-agent` |
| route tab | bottom tab item | Route/Layout | modify | `apps/mobile/src/app/(tabs)/_layout.tsx` | label `"마이"`, icon `userRound` | `fe-route-layout-agent` | `fe-route-layout-agent` |
| route container | `/profile` route | Route | modify | `apps/mobile/src/app/(tabs)/profile.tsx` | auth/space/logout/navigation props | `fe-route-agent` | `fe-route-agent` |
| screen owner | `MyPageScreen` | Screen | new | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx` | `displayName`, `currentSpaceName`, `quickActions: QuickActionListItem[]`, `onPressLogout` | `fe-screen-agent` | `fe-route-agent` |
| quick action widget | `QuickActionList` | Widget | new | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx` | `items`, `onPress`, disabled row behavior | `fe-widget-agent` | `fe-screen-agent` |
| layout primitives | `ScreenFrame`, `Card`, `ListGroup` | Layout/DataDisplay | reuse | `@cocrepo/mo-ui` existing layout exports | body layout, section cards, widget rows | `fe-layout-agent` | `fe-widget-agent`, `fe-screen-agent` |
| rhythm primitives | `VStack`, `HStack` | Layout/Rhythm | reuse | `packages/fe-mo-ui/src/rhythm` | semantic gap: `section`, `block`, `inline`, `dense`, `flush` | `fe-screen-agent`, `fe-widget-agent` | `fe-route-agent` |
| status primitive | `Chip` | DataDisplay | reuse | `packages/fe-mo-ui/src/data-display/Chip` | login state chip | `fe-data-display-agent` | `fe-screen-agent` |
| action primitive | `Button` | Action | reuse | `packages/fe-mo-ui/src/action/Button` | logout button | `fe-control-agent` | `fe-screen-agent` |
| route icon primitive | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | bottom tab `userRound` | none | `fe-route-layout-agent` |
| screen icon primitive | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | `userRound`, `mapPin`, action icons, `logOut` | none | `fe-screen-agent` |
| state | route-local pending state | State | new | `apps/mobile/src/app/(tabs)/profile.tsx` if needed | `isLogoutPending` | `fe-route-agent` | `fe-route-agent` |
| input | none | Input | none | no form/input in this request | none | none | none |
| feature package | none | Feature | none | no cross-screen interaction feature in this request | route injects props directly | none | none |

### Storybook / 테스트 계약

#### Storybook 인벤토리

| 대상 | Story 파일 | 필수 상태/Variant | Fixture/데이터 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
|------|------------|-------------------|----------------|-------------------------|-------------------------|------|
| `QuickActionList` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.stories.tsx` | ready, disabled row, long label | 예약/결제/알림 quick action items | `fe-widget-agent` | `qa-mo-testing` | Widget builder가 component와 함께 작성 |
| `MyPageScreen` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.stories.tsx` | authenticated ready, no current space, logout pending, long display name | `QuickActionListItem[]`, auth/current-space props | `fe-screen-agent` | `qa-mo-testing` | Screen builder가 screen과 함께 작성 |

#### Unit Test 인벤토리

| 대상 | Test 파일 | 검증 관점 | 주요 케이스 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
|------|-----------|-----------|-------------|-------------------------|-------------------------|------|
| `QuickActionList` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.test.tsx` | row rendering, press event, disabled guard | enabled row press, disabled row no-op, long label rendering | `fe-widget-agent` | `qa-mo-testing` | Widget builder가 component와 함께 작성 |
| `MyPageScreen` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.test.tsx` | props rendering, quick action composition, logout event | account summary, current space, quick actions, logout pending | `fe-screen-agent` | `qa-mo-testing` | Screen builder가 screen과 함께 작성 |
| `/profile` route | `apps/mobile/src/route-tests/profile.test.tsx` 또는 existing route test | route wiring, logout navigation | store props mapping, `mobileAuthStore.logout()`, `/auth/login` replace | `qa-mo-testing` | `qa-mo-testing` | route integration은 QA가 보강 |

### 백엔드 / API 계약

#### 엔드포인트 인벤토리

| 필요 | Method/Path | operationId | Controller | DTO/Schema | 재사용/신규 | 소스/대상 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` | codegen |
|------|-------------|-------------|------------|------------|-------------|-----------|-------------------------|---------------------------|---------|
| account summary | none | none | none | none | none | no backend change, use existing auth/session store fallback | none | none | none |
| current space | none | none | none | none | none | no backend change, use `mobileApiScopeStore.groundName` | none | none | none |
| logout | `POST /api/v1/auth/native/logout` | `nativeLogout` | existing `AuthController.nativeLogout` | existing `NativeLogoutPayloadDto` | reuse | `apps/core/api/src/module/auth/auth.controller.ts`, `packages/be-dto/src/auth/native-auth.dto.ts` | `be-controller-builder`, `be-dto-builder` | `fe-route-agent` | existing `requestNativeLogout`, no codegen |
| reservations quick action | none | none | none | none | none | route navigation to existing `/reservations` only | none | `fe-route-agent` | none |

#### UseCase 인벤토리

| 유즈케이스/워크플로 | UseCase handler | Command/Query | 재사용/신규 | 소스/대상 | 의존 요소 | 소스 담당 `agent_type` | 소비 `agent_type` |
|---------------------|-----------------|---------------|-------------|-----------|-----------|-------------------------|---------------------|
| native mobile logout | `LogoutNativeMobileSessionUseCase` | `LogoutNativeMobileSessionCommand` | reuse | `packages/be-usecase/src/auth/auth.usecase.ts` | `TokenStorageService` | `be-usecase-builder` | `be-controller-builder` |
| account summary/current space | none | none | none | no backend change | route uses existing mobile stores | none | none |

#### Service 인벤토리

| 도메인 기능 | Service | 메서드 | 재사용/신규 | 소스/대상 | 의존 요소 | 소스 담당 `agent_type` | 소비 `agent_type` |
|-------------|---------|--------|-------------|-----------|-----------|-------------------------|---------------------|
| native token/session cleanup | `TokenStorageService` | blacklist/delete native session methods used by `logoutNativeMobileSession` | reuse | `packages/be-service/src/auth/token-storage.service.ts` | Redis-backed token/session storage | `be-service-builder` | `be-usecase-builder` |
| profile read | none | none | none | no backend change | route uses existing auth/session/current-space state | none | none |

#### Repository 인벤토리

| 영속성 필요 | Repository | 모델/Aggregate | 메서드 | 재사용/신규 | 소스/대상 | 소스 담당 `agent_type` | 소비 `agent_type` |
|-------------|------------|----------------|--------|-------------|-----------|-------------------------|---------------------|
| profile route backend persistence | none | none | none | none | no repository change for this delivery | none | none |

### 필수 요소

- 신규 Prisma/schema/DTO/Entity/Repository/Service/UseCase/Controller/Module 없음.
- 신규 Orval hook/codegen 없음.
- `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx`
- `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.stories.tsx`
- `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.test.tsx`
- `packages/fe-mo-ui/src/widget/QuickActionList/index.ts`
- `packages/fe-mo-ui/src/widget/index.ts`
- `packages/fe-mo-ui/src/index.ts`
- `QuickActionList.tsx` uses `@cocrepo/mo-ui` `VStack`/`HStack` rhythm primitives with semantic gap presets
- `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.spec.md`
- `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx`
- `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.stories.tsx`
- `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.test.tsx`
- `packages/fe-mo-ui/src/screen/index.ts`
- `apps/mobile/src/app/(tabs)/profile.tsx`
- `apps/mobile/src/app/(tabs)/_layout.tsx`
- route unit test, 필요 시 `apps/mobile/src/route-tests/index.test.tsx` 또는 profile 전용 route test

### Subagent 배정 매트릭스

| step id | phase | agent_type | input files | output files | editable files | depends on | parallel | completion |
|---------|-------|------------|-------------|--------------|----------------|------------|----------|------------|
| S1 | planning | orch-delivery | user request, existing mobile tab files | this spec update | `apps/mobile/src/app/index.spec.md`, `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.spec.md` | none | false | route/screen delivery contract written |
| A1 | approval | orch-delivery | this spec | approval log | `apps/mobile/src/app/index.spec.md` | S1 | false | user approves build |
| M1 | mobile | fe-widget-agent | this spec, `ListGroup`/`Icon` primitives | `QuickActionList.tsx`, `QuickActionList.stories.tsx`, `QuickActionList.test.tsx`, widget barrel export, root export | `packages/fe-mo-ui/src/widget/QuickActionList/**`, `packages/fe-mo-ui/src/widget/index.ts`, `packages/fe-mo-ui/src/index.ts` | A1 | false | widget/story/test cover enabled/disabled quick action rows |
| M2 | mobile | fe-screen-agent | `MyPageScreen.spec.md`, `QuickActionList` export, existing screen patterns | `MyPageScreen.tsx`, `MyPageScreen.stories.tsx`, `MyPageScreen.test.tsx`, screen barrel export | `packages/fe-mo-ui/src/screen/MyPageScreen/**`, `packages/fe-mo-ui/src/screen/index.ts` | M1 | false | shared screen story/test render ready state and logout action |
| M3 | mobile | fe-route-layout-agent | this spec, current tab layout | tab label/icon/header title update | `apps/mobile/src/app/(tabs)/_layout.tsx` | A1 | false | bottom tab and header use "마이" contract |
| M4 | mobile | fe-route-agent | this spec, MyPageScreen export, current profile route | profile route wiring | `apps/mobile/src/app/(tabs)/profile.tsx`, route test if needed | M2, M3 | false | route passes auth/space/logout props to screen |
| Q1 | qa | qa-mo-testing | changed mobile route/screen/widget files | unit test updates | `packages/fe-mo-ui/src/widget/QuickActionList/**`, `packages/fe-mo-ui/src/screen/MyPageScreen/**`, `apps/mobile/src/route-tests/**` | M1, M2, M3, M4 | false | relevant mobile tests pass |

### 실행 그래프

```text
orch-delivery spec gate
→ fe-widget-agent
→ fe-screen-agent
→ fe-route-layout-agent
→ fe-route-agent
→ qa-mo-testing
```

Skipped phases:

- backend: no new API/data contract.
- codegen: no API contract change.
- web: mobile-only request.

### 공유 파일 잠금

| file | lock owner | rule |
|------|------------|------|
| `packages/fe-mo-ui/src/widget/index.ts` | M1 | single writer when exporting `QuickActionList` |
| `packages/fe-mo-ui/src/index.ts` | M1 | add widget root export only; do not reorder unrelated exports |
| `packages/fe-mo-ui/src/screen/index.ts` | M2 | single writer when exporting `MyPageScreen` |
| `apps/mobile/src/app/(tabs)/_layout.tsx` | M3 | tab label/title only; no visual body composition |
| `apps/mobile/src/app/index.spec.md` | S1/M3/M4 | route contract must stay synchronized |
| `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.spec.md` | S1/M2 | screen visual contract must stay synchronized |

### QA / 승인 기준

- `pnpm --filter=@cocrepo/mo-ui test -- QuickActionList`
- `pnpm --filter=@cocrepo/mo-ui test -- MyPageScreen`
- `pnpm --filter=@cocrepo/mo-ui type-check`
- `pnpm --filter=tool-mobile-storybook type-check`
- mobile route unit test for `/profile`, if existing test harness supports route import.
- Manual acceptance:
  - bottom tab shows "마이".
  - header title shows "마이".
  - body shows account/session, current space, quick actions, logout.
  - logout calls `mobileAuthStore.logout()` and navigates to `/auth/login`.

### 차단 / 재진입 규칙

- `spec-gap`: if profile route requires more account data than current stores expose, keep UI to available state only and update this spec.
- `ui-composition-gap`: if existing mo-ui primitives are insufficient, add the smallest screen-local composition using `ScreenFrame`, `Icon`, `Button`, and existing layout primitives.
- `shared-file-conflict`: stop parallel work and make M1 or M2 the single writer for the shared file.
- `test-failure`: distinguish visual screen failure from route wiring failure before re-entry.
## Unit Test Contract

| ID | owner | 검증 |
|----|-------|------|
| `MO-UNIT-AUTH-NATIVE-001` | `apps/mobile/src/route-tests/auth/login.test.tsx` | `/auth/login`이 WebView 없이 email/password native form을 렌더링 |
| `MO-UNIT-AUTH-NATIVE-002` | same | email/password 제출 시 `mobileAuthStore.loginWithCredentials()` 호출 후 인증 route로 이동 |
| `MO-UNIT-AUTH-NATIVE-003` | `apps/mobile/src/route-tests/auth/auth-utils.test.ts` | native login/refresh request가 `/api/v1/auth/native/**` endpoint와 JSON body를 사용 |
| `MO-UNIT-AUTH-NATIVE-004` | same | native session token이 SecureStore에 저장/복원/삭제 |
| `MO-UNIT-AUTH-NATIVE-005` | `apps/mobile/src/route-tests/auth/AuthSessionGate.test.tsx` | 앱 시작 시 memory/SecureStore token restore 후 `verify-token`, `my-spaces`, `current-space`로 인증 context를 복원 |
| `MO-UNIT-SPACE-SELECT-001` | `apps/mobile/src/route-tests/select-space.test.tsx` | `/select-space`가 플랫폼 운영본부를 제외한 지점 목록을 렌더링하고 선택 시 `setCurrentSpace` 후 홈으로 이동 |
| `MO-UNIT-SPACE-SELECT-002` | `apps/mobile/src/route-tests/auth/AuthSessionGate.test.tsx` | 인증됐지만 지점 선택이 미확정이면 `/select-space`로 이동 |
| `MO-UNIT-HOME-BOOKING-001` | `apps/mobile/src/route-tests/index.test.tsx` | 홈이 booking feed 카드와 날짜 스트립을 렌더링하고 PENDING_BACKEND_HANDOFF 문구를 노출하지 않음 |
| `MO-UNIT-HOME-BOOKING-002` | same | feed loading/empty/error + retry 상태 |
| `MO-UNIT-HOME-BOOKING-003` | same | 날짜 선택과 대기 필터가 카드 목록을 변경 |
| `MO-UNIT-HOME-BOOKING-004` | same | CTA -> 정책 sheet -> `createReservation` payload + cache invalidate |
| `MO-UNIT-HOME-CHECKOUT-001` | same | `paymentRequired = true` CTA는 `/payments/checkout`으로 이동하고 기존 `createReservation`은 호출하지 않음 |
| `MO-UNIT-RESERVATIONS-001` | same | `/reservations`가 `getMyReservations` 결과를 렌더링하고 dummy 예약을 노출하지 않음 |
| `MO-UNIT-RESERVATIONS-002` | same | `/reservations` empty/error + retry 상태 |
| `MO-UNIT-QUICK-ACTION-LIST-001` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.test.tsx` | quick action row 렌더링, enabled press, disabled press guard |
| `MO-UNIT-MY-PAGE-001` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.test.tsx` | 마이 페이지 계정 summary, 현재 지점, quick action, 로그아웃 버튼 렌더링 |
| `MO-UNIT-MY-PAGE-002` | `apps/mobile/src/route-tests/index.test.tsx` 또는 profile route test | `/profile` route가 `mobileAuthStore.logout()` 후 `/auth/login`으로 이동 |
| `MO-UNIT-PAYMENT-CHECKOUT-001` | `apps/mobile/src/route-tests/payments-checkout.test.tsx` | `/payments/checkout` route params와 bootstrap 결과를 screen props로 매핑하고 checkout mutation payload 생성 |
| `MO-UNIT-PAYMENT-CHECKOUT-002` | same | checkout 성공 후 진행 상태와 예약 내역 이동 표시 |
| `MO-UNIT-PAYMENT-CHECKOUT-003` | same | 필수 param 누락 시 bootstrap/checkout 미실행과 오류 표시 |

## Verification Status

| 항목 | 상태 | 결과 |
|------|------|------|
| mobile screen target guard | Verified | `pnpm mobile:screen-targets:check` passed, 3 screen targets verified |
| `@cocrepo/mo-ui` unit/type | Verified | `pnpm --filter=@cocrepo/mo-ui test`: 11 suites, 25 tests passed; `pnpm --filter=@cocrepo/mo-ui type-check` passed |
| `mobile-app` route unit | Verified | `pnpm --filter=mobile-app test`: 9 suites, 32 tests passed |
| `mobile-app` type | Verified | `pnpm --filter=mobile-app type-check` passed |
| `mobile-app` E2E smoke | Pending | native runtime fixture 준비 후 검증 |

## Auth Layout 계약

- `AuthSessionGate`는 초기 route 렌더 전에 `mobileAuthStore.verifySession()`으로 memory/SecureStore native 세션을 복원하고 세션을 확인한다.
- Root layout은 `QueryClientProvider`를 `DesignSystemProvider`보다 바깥에 배치해 heroui-native와 route hook이 같은 React Query 컨텍스트를 공유한다.
- Metro resolver는 `react`, `@tanstack/react-query`, `@tanstack/query-core`를 모바일 앱 인스턴스로 고정해 `@cocrepo/api` Orval hook과 root layout이 같은 React/React Query 컨텍스트를 공유한다.
- Metro resolver는 Expo HMR runtime의 `pretty-format` import를 CJS entry로 고정해 dev bundle에서 MJS default wrapper mismatch가 발생하지 않게 한다.
- 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login?returnTo=/`로 보낸다.
- `/auth/login`은 시스템 브라우저, WebView, `/oidc/auth`, `/interaction/:uid`, `/api/v1/auth/callback`, `responseMode=mobile-json`을 사용하지 않는다.
- `/auth/login`은 앱 내부 native email/password form에서 `POST /api/v1/auth/login`을 호출하고 `accessToken`, `refreshToken`, `sessionId`, 만료 시각을 받는다.
- mobile token은 `mobileApiScopeStore` memory store와 `expo-secure-store`에 저장하며, 앱 시작 시 SecureStore에서 복원한다.
- mobile axios 401 refresh는 web cookie refresh endpoint가 아니라 `POST /api/v1/auth/native/token/refresh`를 사용한다.
- `/profile` 로그아웃은 `POST /api/v1/auth/native/logout` 후 memory store와 SecureStore를 삭제한다.
- IDP Web returnTo(`/dashboard` 등)가 섞이면 모바일 인증 홈(`/`)으로 정규화한다.
- `(tabs)/_layout.tsx`는 `/`, `/reservations`, `/profile`을 하단 탭으로 등록한다.
- route 화면은 `@cocrepo/mo-ui` shared screen owner가 조합한 `ScreenFrame`으로 safe-area padding을 적용한다.

## Backend Native Auth Handoff

- `apps/core/api/src/module/auth/auth.controller.ts`는 OIDC `GET /api/v1/auth/oidc/login`, `GET /api/v1/auth/callback`, cookie refresh/logout을 유지하고, first-party `POST /api/v1/auth/login`, mobile token `POST /api/v1/auth/native/token/refresh`, `POST /api/v1/auth/native/logout`을 제공한다.
- credential 검증은 interaction login의 계정 잠금, 실패 횟수, audit 정책을 재사용한다. 후속 정리에서는 `InteractionLoginService`를 mobile/web 공용 credential login service로 승격한다.
- native access token은 `issuer=<oidc issuer>/native`, `aud=user-mobile`, `client_id=user-mobile`로 web OIDC RS256 token과 구분한다.
- core/idp `JwtStrategy`는 cookie token은 RS256만 허용하고, Authorization Bearer token은 RS256 또는 native HS256 token을 검증한다.
- native refresh token은 Redis session(`sessionId -> userId index`)에 저장하고 refresh마다 rotation한다.
- `responseMode=mobile-json` callback branch와 mobile callback exchange 테스트는 제거 대상이다.
