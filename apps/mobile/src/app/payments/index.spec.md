# mobile payments route 계약서

> 생성일: 2026-05-10
> 수정일: 2026-05-10
> 타입: expo-route-owner
> route: `/payments/checkout`
> owner route file: `apps/mobile/src/app/payments/checkout.tsx`

## 목적

`/payments/checkout`은 로그인 사용자가 예약 가능한 수강권을 보유하지 않은 상태에서 홈 예약 CTA를 누른 경우 진입하는 예약 결제 checkout route다. 결제 제공자는 아직 미정이므로 화면은 실제 결제처럼 보이되 provider-neutral placeholder 방식으로 동작한다. 백엔드는 `Payment`, `Enrollment/CoursePass`, `Reservation`을 하나의 checkout 유즈케이스에서 생성해 예약 의도가 결제 원장과 수강 권리로 남도록 한다.

활성 수강권이 있는 사용자는 기존 홈 예약 정책 sheet와 `createReservation` 흐름을 그대로 사용하며, 이 route로 우회하지 않는다.

## Shared Screen Target

| route | shared screen target | screen spec | route boundary |
|-------|----------------------|-------------|----------------|
| `/payments/checkout` | `packages/fe-mo-ui/src/screen/ReservationPaymentCheckoutScreen/ReservationPaymentCheckoutScreen.tsx` | `packages/fe-mo-ui/src/screen/ReservationPaymentCheckoutScreen/ReservationPaymentCheckoutScreen.spec.md` | route는 Expo search params, Orval bootstrap/checkout hooks, React Query invalidate, navigation, API error mapping만 소유하고 screen에 props/handler를 전달한다. |

## Route Params

| param | required | 설명 |
|-------|:--------:|------|
| `timelineId` | ✅ | 예약할 타임라인 ID |
| `sessionId` | ✅ | 예약할 세션 ID |
| `programId` | ✅ | 예약할 프로그램 ID |
| `occurrenceStartAt` | ✅ | 예약 회차 시작 시각 ISO string |
| `programName` | △ | bootstrap 전 화면 표시용 클래스명 fallback |
| `sessionName` | △ | bootstrap 전 화면 표시용 세션명 fallback |
| `timelineName` | △ | bootstrap 전 화면 표시용 지점/타임라인명 fallback |
| `timeLabel` | △ | bootstrap 전 화면 표시용 시간 범위 fallback |

필수 param이 없으면 route는 bootstrap query와 checkout mutation을 실행하지 않고 오류 상태를 렌더링한다.

## API 계약

모바일 route는 API client를 직접 만들지 않고 `@cocrepo/api`의 Orval 생성 hook만 사용한다. `request.baseURL`은 `apps/mobile/src/auth/auth-config.ts`의 `getCoreApiBaseUrl()`로 주입한다.

| operationId | hook | method/path | owner |
|-------------|------|-------------|-------|
| `getReservationCheckoutBootstrap` | `useGetReservationCheckoutBootstrap` | `GET /api/v1/reservations/checkout/bootstrap` | `/payments/checkout` 과정/가격/결제수단 bootstrap |
| `createReservationCheckout` | `useCreateReservationCheckout` | `POST /api/v1/reservations/checkout` | `/payments/checkout` 결제 원장 + 수강권 + 예약 확정 |

bootstrap query:

```ts
{
  timelineId: string;
  sessionId: string;
  programId: string;
  occurrenceStartAt: string;
}
```

bootstrap response data:

```ts
{
  context: {
    feedItemId: string;
    timelineId: string;
    sessionId: string;
    programId: string;
    occurrenceStartAt: string;
    occurrenceEndsAt: string;
    timelineName: string;
    sessionName: string;
    programName: string;
    coachName: string | null;
  };
  options: Array<{
    courseId: string;
    courseOfferingId: string;
    timelineId: string;
    courseName: string;
    courseOfferingName: string;
    durationMonths: number;
    priceAmount: number;
    currency: string;
    reservationLimit: number;
  }>;
  paymentMethods: PaymentMethod[];
}
```

checkout request body:

```ts
{
  courseOfferingId: string;
  timelineId: string;
  sessionId: string;
  programId: string;
  occurrenceStartAt: string;
  idempotencyKey: string;
  paymentMethod: PaymentMethod;
  memo?: string | null;
}
```

checkout response data:

```ts
{
  status: PaymentStatus;
  payment: PaymentDto;
  enrollment: EnrollmentDto;
  coursePass: CoursePassDto;
  reservation: ReservationDto;
  progressSteps: Array<{
    id: string;
    label: string;
    status: "COMPLETED" | "CURRENT" | "PENDING";
  }>;
}
```

## Backend 정책 요약

| 정책 | 계약 |
|------|------|
| identity/scope | `spaceId`, `userId`는 client payload가 아니라 `SpaceContext`, `AuthContext`에서 확정한다. |
| 상품 결정 | backend는 timeline/occurrence에 연결된 `ENROLLING` 또는 `ACTIVE` CourseOffering과 ACTIVE Course를 찾아 금액과 통화를 확정한다. |
| 결제 수단 | v1은 `CARD`, `EXTERNAL`, `BANK_TRANSFER` placeholder 수단을 bootstrap으로 내려준다. |
| provider-neutral | 실제 PG가 붙기 전까지 backend placeholder adapter가 선택된 결제 수단을 받아 성공 처리처럼 `PAID` 결제 원장을 생성한다. |
| 수강 권리 | checkout 성공 시 `Enrollment`를 `ACTIVE`로 만들고 발급된 `CoursePass`를 예약에 연결한다. |
| 예약 확정 | 결제와 수강권 활성화 뒤 기존 예약 정책을 재사용해 `Reservation`을 `CONFIRMED` 또는 `WAITLISTED`로 생성한다. |
| idempotency | 같은 user + `idempotencyKey` 재시도는 기존 예약의 결제/수강권/예약 결과를 재구성해 같은 checkout 결과로 반환한다. |
| 기존 수강권 보존 | 활성 수강권이 있으면 홈에서 기존 예약 CTA를 사용한다. 결제 필요 여부는 booking feed의 `paymentRequired`가 결정한다. |
| cache refresh | checkout 성공 후 booking feed와 내 예약 목록을 invalidate/refetch한다. |

## State Ownership

체크아웃은 단일 route 전용 상태이므로 shared MobX store를 만들지 않는다.

```ts
type ReservationPaymentCheckoutRouteState = {
  idempotencyKey: string;
  selectedCourseOfferingId: string | null;
  selectedPaymentMethod: PaymentMethod | null;
};
```

## Unit Test Contract

| ID | owner | 검증 |
|----|-------|------|
| `MO-UNIT-PAYMENT-CHECKOUT-001` | `apps/mobile/src/route-tests/payments-checkout.test.tsx` | route params와 bootstrap 결과를 screen props로 매핑하고 선택된 과정/결제수단으로 checkout mutation payload를 생성 |
| `MO-UNIT-PAYMENT-CHECKOUT-002` | same | checkout 성공 후 진행 상태를 표시하고 예약 내역으로 이동 |
| `MO-UNIT-PAYMENT-CHECKOUT-003` | same | 필수 route params 누락 시 bootstrap/checkout 실행 없이 오류 상태 |
| `MO-UNIT-HOME-CHECKOUT-001` | `apps/mobile/src/route-tests/index.test.tsx` | `paymentRequired = true`인 예약 가능 CTA는 `/payments/checkout`으로 이동하고 기존 `createReservation`은 호출하지 않음 |

## Verification Status

| 항목 | 상태 | 결과 |
|------|------|------|
| mobile screen target guard | Verified | `pnpm mobile:screen-targets:check` passed, 3 screen targets verified |
| `@cocrepo/mo-ui` unit/type | Verified | `pnpm --filter=@cocrepo/mo-ui test`: 11 suites, 25 tests passed; `pnpm --filter=@cocrepo/mo-ui type-check` passed |
| `mobile-app` route unit/type | Verified | `pnpm --filter=mobile-app test`: 9 suites, 35 tests passed; `pnpm --filter=mobile-app type-check` passed |
| backend/API type | Verified | `pnpm --filter=core-api type-check`, `pnpm --filter=@cocrepo/dto type-check`, `pnpm --filter=@cocrepo/service type-check`, `pnpm --filter=@cocrepo/usecase type-check`, `pnpm --filter=@cocrepo/api type-check` passed |
| API generation | Pending | local Swagger 서버 실행 후 `pnpm --filter=@cocrepo/api codegen`로 재생성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-10 | checkout route를 `/api/v1/reservations/checkout/bootstrap` + `/api/v1/reservations/checkout` 기준으로 갱신하고 Payment, Enrollment/CoursePass, Reservation 통합 흐름을 명시 | codex |
| 2026-05-10 | provider-neutral 예약 결제 checkout route, backend contract, shared screen target, unit test contract를 추가 | codex |
