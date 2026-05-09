# mobile home route 계약서

> 생성일: 2026-05-04
> 수정일: 2026-05-09
> 타입: next-route-page
> route: `/`
> owner route file: `apps/mobile/src/app/(tabs)/index.tsx`

## 목적

모바일 홈(`/`)은 인증된 사용자가 F45/하이파이브식 날짜 스트립에서 수업 회차를 고르고, 클래스 카드의 CTA로 예약 또는 대기를 생성하는 첫 화면이다. `/reservations` 탭은 로그인 사용자 본인의 예약/대기 목록을 실제 Reservation API로 확인하는 최소 목록 화면이다.

## Route Mapping

| route | route file | 설명 |
|-------|------------|------|
| `/` | `apps/mobile/src/app/(tabs)/index.tsx` | 날짜 스트립 + 수업 카드 booking feed + 예약 정책 sheet |
| `/reservations` | `apps/mobile/src/app/(tabs)/reservations.tsx` | `getMyReservations` 기반 내 예약/대기 목록 |
| `/profile` | `apps/mobile/src/app/(tabs)/profile.tsx` | 내 정보 탭 + 로그아웃 |
| `/(tabs)` | `apps/mobile/src/app/(tabs)/_layout.tsx` | Expo Router 하단 탭 shell |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | AuthSessionGate + QueryClientProvider + IDP bootstrap shell |
| `/auth/login` | `apps/mobile/src/app/auth/login.tsx` | `user-mobile` 로그인 WebView 컨테이너 |
| `/auth/callback` | `apps/mobile/src/app/auth/callback.tsx` | OIDC callback 세션 확인/리다이렉트 처리 |

## Shared Screen Targets

| route | shared screen target | screen spec | route boundary |
|-------|----------------------|-------------|----------------|
| `/` | `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.tsx` | `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.spec.md` | route는 Orval hook, query invalidation, DTO mapping, route-local state만 소유하고 screen에 props/handler를 전달한다. |
| `/reservations` | `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.tsx` | `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.spec.md` | route는 `getMyReservations` API wiring과 `ReservationDto -> MyReservationCardItem` mapping만 소유한다. |

## Home UX

| 영역 | 계약 |
|------|------|
| 상단 컨텍스트 | 현재 지점/회원 맥락을 “오늘의 수업” 피드로 요약하고 조회 기간/내 예약 수를 표시한다. |
| 날짜 스트립 | `@cocrepo/mo-ui` `DateStrip`으로 오늘부터 14일을 표시하며, 날짜별 feed item count를 함께 보여준다. |
| 필터 칩 | `전체`, `예약 가능`, `내 예약`, `대기 가능`을 route-local filter로 제공한다. |
| 수업 카드 | `ReservationHomeScreen`이 `BookingClassCard`를 조합해 시간, 프로그램명, 세션명, 타임라인명, 코치, 난이도, 루틴, 운동 미리보기, 정원/예약/잔여석/대기 수, 상태, CTA를 한 카드에 표시한다. |
| 정책 sheet | 예약/대기 CTA를 누르면 `ReservationHomeScreen`의 `BookingPolicySheet`가 취소 정책과 memo 입력을 보여주고, 확인 이벤트는 route가 받아 `createReservation`을 호출한다. |

### CTA 상태

| `availabilityStatus` | CTA | 동작 |
|----------------------|-----|------|
| `AVAILABLE` | `예약` | 정책 확인 후 확정 예약 요청 |
| `FEW_LEFT` | `예약` | 정책 확인 후 확정 예약 요청 |
| `WAITLIST_OPEN` | `대기` | 정책 확인 후 대기 등록 요청 |
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
| `MO-UNIT-HOME-BOOKING-001` | `apps/mobile/src/route-tests/index.test.tsx` | 홈이 booking feed 카드와 날짜 스트립을 렌더링하고 PENDING_BACKEND_HANDOFF 문구를 노출하지 않음 |
| `MO-UNIT-HOME-BOOKING-002` | same | feed loading/empty/error + retry 상태 |
| `MO-UNIT-HOME-BOOKING-003` | same | 날짜 선택과 대기 필터가 카드 목록을 변경 |
| `MO-UNIT-HOME-BOOKING-004` | same | CTA -> 정책 sheet -> `createReservation` payload + cache invalidate |
| `MO-UNIT-RESERVATIONS-001` | same | `/reservations`가 `getMyReservations` 결과를 렌더링하고 dummy 예약을 노출하지 않음 |
| `MO-UNIT-RESERVATIONS-002` | same | `/reservations` empty/error + retry 상태 |

## Verification Status

| 항목 | 상태 | 결과 |
|------|------|------|
| mobile screen target guard | Verified | `pnpm mobile:screen-targets:check` passed, 2 screen targets verified |
| `@cocrepo/mo-ui` unit/type | Verified | `pnpm --filter=@cocrepo/mo-ui test`: 10 suites, 22 tests passed; `pnpm --filter=@cocrepo/mo-ui type-check` passed |
| `mobile-app` route unit | Verified | `pnpm --filter=mobile-app test`: 8 suites, 30 tests passed |
| `mobile-app` type | Verified | `pnpm --filter=mobile-app type-check` passed |
| `mobile-app` E2E smoke | Pending | native runtime fixture 준비 후 검증 |

## Auth Shell 계약

- `AuthSessionGate`는 callback route가 아닌 초기 route 렌더 전에 `mobileAuthStore.verifySession()`으로 세션을 확인한다.
- 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login?returnTo=/`로 보낸다.
- `/auth/login`은 외부 브라우저를 열지 않고 앱 내 WebView로 `clientId=user-mobile` IDP 로그인 URL을 로드한다.
- callback/returnTo에 IDP Web 경로(`/dashboard` 등)가 섞이면 모바일 인증 홈(`/`)으로 정규화한다.
- `(tabs)/_layout.tsx`는 `/`, `/reservations`, `/profile`을 하단 탭으로 등록한다.
- route 화면은 `@cocrepo/mo-ui` shared screen owner가 조합한 `ScreenFrame`으로 safe-area padding을 적용한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | `/`와 `/reservations`의 shared screen target을 명시하고 route file은 API/state wiring만 소유하도록 screen ownership 계약을 복구 | codex |
| 2026-05-09 | 홈 route를 날짜 스트립 + booking feed + 정책 sheet 기반 실제 Reservation API 계약으로 전환하고 `/reservations` 더미 제거 및 `getMyReservations` 계약을 반영 | codex |
| 2026-05-09 | Reservation backend v1 정책, Orval hook, route-local state, React Query invalidate, unit test contract를 실제 구현 기준으로 갱신 | codex |
| 2026-05-06 | Stage 3에서 모바일 홈 route를 Timeline/Session/Program Orval read hook과 Stage 2 UI target으로 통합하고 Reservation backend handoff 상태를 기록 | codex |
| 2026-05-06 | Stage 2에서 홈 예약 플로우용 mobile UI package target 구현 결과를 반영 | codex |
| 2026-05-06 | 실제 `/` 홈 route, admin Timeline/Session/Program UX, Reservation handoff/UI/state/test 계약을 정리 | codex |
| 2026-05-04 | Expo Router 앱 번들에서 route unit test와 non-route auth 모듈 위치를 분리 | codex |
| 2026-05-04 | 초기 인증 선확인, WebView 기반 IDP 로그인, callback scheme interception, native 세션 검증 계약 추가 | codex |
