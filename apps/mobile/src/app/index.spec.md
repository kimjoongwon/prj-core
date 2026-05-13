# mobile home route 계약서

> 생성일: 2026-05-04
> 수정일: 2026-05-13
> 타입: next-route-page
> route: `/`
> owner route file: `apps/mobile/src/app/(tabs)/index.tsx`

## 목적

모바일 홈(`/`)은 인증된 사용자가 F45/하이파이브식 날짜 스트립에서 수업 회차를 고르고, 클래스 카드의 CTA로 예약 또는 대기를 생성하는 첫 화면이다. `/reservations` 탭은 로그인 사용자 본인의 예약/대기 목록을 실제 Reservation API로 확인하는 최소 목록 화면이다.

## Route Mapping

| route | route file | 설명 |
|-------|------------|------|
| `/` | `apps/mobile/src/app/(tabs)/index.tsx` | 날짜 스트립 + 수업 카드 booking feed + 예약 정책 sheet |
| `/payments/checkout` | `apps/mobile/src/app/payments/checkout.tsx` | 활성 수강권이 없는 예약 의도의 provider-neutral 예약 결제 checkout |
| `/reservations` | `apps/mobile/src/app/(tabs)/reservations.tsx` | `getMyReservations` 기반 내 예약/대기 목록 |
| `/profile` | `apps/mobile/src/app/(tabs)/profile.tsx` | 내 정보 탭 + 로그아웃 |
| `/(tabs)` | `apps/mobile/src/app/(tabs)/_layout.tsx` | Expo Router 하단 탭 shell |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | QueryClientProvider-first shell + DesignSystemProvider + AuthSessionGate + IDP bootstrap shell |
| `/auth/login` | `apps/mobile/src/app/auth/login.tsx` | first-party native email/password 로그인 route |

## Shared Screen Targets

| route | shared screen target | screen spec | route boundary |
|-------|----------------------|-------------|----------------|
| `/` | `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.tsx` | `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.spec.md` | route는 Orval hook, query invalidation, DTO mapping, route-local state만 소유하고 screen에 props/handler를 전달한다. |
| `/payments/checkout` | `packages/fe-mo-ui/src/screen/ReservationPaymentCheckoutScreen/ReservationPaymentCheckoutScreen.tsx` | `packages/fe-mo-ui/src/screen/ReservationPaymentCheckoutScreen/ReservationPaymentCheckoutScreen.spec.md` | route는 checkout params, bootstrap/checkout Orval hooks, cache invalidate, navigation만 소유한다. |
| `/reservations` | `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.tsx` | `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.spec.md` | route는 `getMyReservations` API wiring과 `ReservationDto -> MyReservationCardItem` mapping만 소유한다. |
| `/auth/login` | `packages/fe-mo-ui/src/screen/NativeAuthLoginScreen/NativeAuthLoginScreen.tsx` | `packages/fe-mo-ui/src/screen/NativeAuthLoginScreen/NativeAuthLoginScreen.spec.md` | Stage 2에서 로그인 visual owner를 shared screen으로 승격하고, route는 email/password form state, native login mutation, SecureStore restore/logout wiring만 소유한다. |

## Mobile Visual System

- 모바일 전역 톤은 Linear/Stripe 계열의 dense premium aesthetic을 따른다.
- 배경은 muted neutral semantic token을 사용하고, primary surface/card/list는 shadow 대신 subtle border로 분리한다.
- 화면 여백은 8pt rhythm 중심으로 유지한다: route body `px-4`, 큰 stack `gap-4`, compact stack `gap-2`, card body `p-4`.
- 카드와 주요 control은 `rounded-lg` 중심으로 맞추며, 상태색은 soft token(`accent-soft`, `success-soft`, `warning-soft`, `danger-soft`)을 우선 사용해 과한 색 대비를 피한다.
- 아이콘은 `@cocrepo/mo-ui` `Icon` primitive와 curated `mobileIcons`만 사용한다. 하단 탭, 로그인 input/CTA, 예약 metadata, 상태 badge, 결제 신뢰 cue처럼 사용자의 scan/decision을 돕는 곳에만 배치한다.
- 로그인, 하단 탭, 프로필 route도 같은 토큰/간격/radius 계약을 따른다.

## Home UX

| 영역 | 계약 |
|------|------|
| 상단 컨텍스트 | Expo Router `CustomHeader`가 “오늘의 수업” 제목을 소유하고, 본문은 선택 날짜 중심의 예약 현황 summary로 조회 기간/내 예약 수/표시 수업 수를 요약한다. |
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
| `nativeLogin` | generated mutation | `POST /api/v1/auth/native/login` | `/auth/login` first-party native 로그인 |
| `nativeRefreshToken` | generated mutation 또는 axios native refresh handler | `POST /api/v1/auth/native/token/refresh` | mobile access token 401 refresh |
| `nativeLogout` | generated mutation 또는 auth store request | `POST /api/v1/auth/native/logout` | `/profile` 로그아웃 |

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

## Unit Test Contract

| ID | owner | 검증 |
|----|-------|------|
| `MO-UNIT-AUTH-NATIVE-001` | `apps/mobile/src/route-tests/auth/login.test.tsx` | `/auth/login`이 WebView 없이 email/password native form을 렌더링 |
| `MO-UNIT-AUTH-NATIVE-002` | same | email/password 제출 시 `mobileAuthStore.loginWithCredentials()` 호출 후 인증 route로 이동 |
| `MO-UNIT-AUTH-NATIVE-003` | `apps/mobile/src/route-tests/auth/auth-utils.test.ts` | native login/refresh request가 `/api/v1/auth/native/**` endpoint와 JSON body를 사용 |
| `MO-UNIT-AUTH-NATIVE-004` | same | native session token이 SecureStore에 저장/복원/삭제 |
| `MO-UNIT-AUTH-NATIVE-005` | `apps/mobile/src/route-tests/auth/AuthSessionGate.test.tsx` | 앱 시작 시 memory/SecureStore token restore 후 `verify-token`, `my-spaces`, `current-space`로 인증 context를 복원 |
| `MO-UNIT-HOME-BOOKING-001` | `apps/mobile/src/route-tests/index.test.tsx` | 홈이 booking feed 카드와 날짜 스트립을 렌더링하고 PENDING_BACKEND_HANDOFF 문구를 노출하지 않음 |
| `MO-UNIT-HOME-BOOKING-002` | same | feed loading/empty/error + retry 상태 |
| `MO-UNIT-HOME-BOOKING-003` | same | 날짜 선택과 대기 필터가 카드 목록을 변경 |
| `MO-UNIT-HOME-BOOKING-004` | same | CTA -> 정책 sheet -> `createReservation` payload + cache invalidate |
| `MO-UNIT-HOME-CHECKOUT-001` | same | `paymentRequired = true` CTA는 `/payments/checkout`으로 이동하고 기존 `createReservation`은 호출하지 않음 |
| `MO-UNIT-RESERVATIONS-001` | same | `/reservations`가 `getMyReservations` 결과를 렌더링하고 dummy 예약을 노출하지 않음 |
| `MO-UNIT-RESERVATIONS-002` | same | `/reservations` empty/error + retry 상태 |
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

## Auth Shell 계약

- `AuthSessionGate`는 초기 route 렌더 전에 `mobileAuthStore.verifySession()`으로 memory/SecureStore native 세션을 복원하고 세션을 확인한다.
- Root layout은 `QueryClientProvider`를 `DesignSystemProvider`보다 바깥에 배치해 heroui-native와 route hook이 같은 React Query 컨텍스트를 공유한다.
- Metro resolver는 `react`, `@tanstack/react-query`, `@tanstack/query-core`를 모바일 앱 인스턴스로 고정해 `@cocrepo/api` Orval hook과 root layout이 같은 React/React Query 컨텍스트를 공유한다.
- Metro resolver는 Expo HMR runtime의 `pretty-format` import를 CJS entry로 고정해 dev bundle에서 MJS default wrapper mismatch가 발생하지 않게 한다.
- 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login?returnTo=/`로 보낸다.
- `/auth/login`은 시스템 브라우저, WebView, `/oidc/auth`, `/interaction/:uid`, `/api/v1/auth/callback`, `responseMode=mobile-json`을 사용하지 않는다.
- `/auth/login`은 앱 내부 native email/password form에서 `POST /api/v1/auth/native/login`을 호출하고 `accessToken`, `refreshToken`, `sessionId`, 만료 시각을 받는다.
- mobile token은 `mobileApiScopeStore` memory store와 `expo-secure-store`에 저장하며, 앱 시작 시 SecureStore에서 복원한다.
- mobile axios 401 refresh는 web cookie refresh endpoint가 아니라 `POST /api/v1/auth/native/token/refresh`를 사용한다.
- `/profile` 로그아웃은 `POST /api/v1/auth/native/logout` 후 memory store와 SecureStore를 삭제한다.
- IDP Web returnTo(`/dashboard` 등)가 섞이면 모바일 인증 홈(`/`)으로 정규화한다.
- `(tabs)/_layout.tsx`는 `/`, `/reservations`, `/profile`을 하단 탭으로 등록한다.
- route 화면은 `@cocrepo/mo-ui` shared screen owner가 조합한 `ScreenFrame`으로 safe-area padding을 적용한다.

## Backend Native Auth Handoff

- `apps/idp/api/src/module/auth/auth.controller.ts`는 기존 web OIDC `GET /login`, `GET /callback`, cookie refresh/logout을 유지하고, mobile 전용 `POST /api/v1/auth/native/login`, `POST /api/v1/auth/native/token/refresh`, `POST /api/v1/auth/native/logout`을 추가한다.
- credential 검증은 interaction login의 계정 잠금, 실패 횟수, audit 정책을 재사용한다. 후속 정리에서는 `InteractionLoginService`를 mobile/web 공용 credential login service로 승격한다.
- native access token은 `issuer=<oidc issuer>/native`, `aud=user-mobile`, `client_id=user-mobile`로 web OIDC RS256 token과 구분한다.
- core/idp `JwtStrategy`는 cookie token은 RS256만 허용하고, Authorization Bearer token은 RS256 또는 native HS256 token을 검증한다.
- native refresh token은 Redis session(`sessionId -> userId index`)에 저장하고 refresh마다 rotation한다.
- `responseMode=mobile-json` callback branch와 mobile callback exchange 테스트는 제거 대상이다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-13 | 모바일 전역/route visual system을 Linear/Stripe 계열의 muted background, subtle border, 8pt rhythm, rounded-lg 중심으로 갱신 | codex |
| 2026-05-13 | `@cocrepo/mo-ui` icon primitive 기반으로 하단 탭, 로그인, 예약/결제 metadata의 semantic icon cue 계약을 추가 | codex |
| 2026-05-13 | 모바일 인증을 WebView/OIDC callback/mobile-json에서 first-party native login + native token/refresh/logout + SecureStore 복원 계약으로 전환 | codex |
| 2026-05-10 | 모바일 OIDC 로그인 후 first-party consent 화면을 건너뛰고 `mobile-json` 세션 저장 후 홈으로 진입하는 auth route 계약을 반영 | codex |
| 2026-05-10 | Lazyweb 예약 화면 개선 리뷰를 반영해 홈 본문을 CustomHeader 중복 hero 대신 예약 현황 summary + 수업 목록 구조로 정리 | codex |
| 2026-05-09 | `/`와 `/reservations`의 shared screen target을 명시하고 route file은 API/state wiring만 소유하도록 screen ownership 계약을 복구 | codex |
| 2026-05-10 | Metro resolver가 workspace package의 React Query/React와 Expo HMR pretty-format entry를 안정적인 인스턴스로 고정하도록 런타임 계약을 추가 | codex |
| 2026-05-10 | Root layout의 Provider 순서를 QueryClientProvider-first로 명시해 로그인 후 앱 진입 시 React Query 컨텍스트가 먼저 준비되도록 갱신 | codex |
| 2026-05-10 | 모바일 결제 흐름을 `/reservations/checkout/bootstrap` + `/reservations/checkout` 기준으로 갱신하고 `paymentRequired` CTA 계약을 반영 | codex |
| 2026-05-10 | 활성 수강권이 없는 예약 의도를 `/payments/checkout` provider-neutral 결제 checkout으로 연결하는 route/API/screen/test 계약 추가 | codex |
| 2026-05-09 | 홈 route를 날짜 스트립 + booking feed + 정책 sheet 기반 실제 Reservation API 계약으로 전환하고 `/reservations` 더미 제거 및 `getMyReservations` 계약을 반영 | codex |
| 2026-05-09 | Reservation backend v1 정책, Orval hook, route-local state, React Query invalidate, unit test contract를 실제 구현 기준으로 갱신 | codex |
| 2026-05-06 | Stage 3에서 모바일 홈 route를 Timeline/Session/Program Orval read hook과 Stage 2 UI target으로 통합하고 Reservation backend handoff 상태를 기록 | codex |
| 2026-05-06 | Stage 2에서 홈 예약 플로우용 mobile UI package target 구현 결과를 반영 | codex |
| 2026-05-06 | 실제 `/` 홈 route, admin Timeline/Session/Program UX, Reservation handoff/UI/state/test 계약을 정리 | codex |
| 2026-05-04 | Expo Router 앱 번들에서 route unit test와 non-route auth 모듈 위치를 분리 | codex |
| 2026-05-04 | 초기 인증 선확인, WebView 기반 IDP 로그인, callback scheme interception, native 세션 검증 계약 추가 | codex |
