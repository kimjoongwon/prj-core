# mobile home route 계약서

> 생성일: 2026-05-04
> 수정일: 2026-05-06
> 타입: next-route-page
> route: `/`
> owner route file: `apps/mobile/src/app/(tabs)/index.tsx`

## Stage 1 재분석 근거

- Expo Router `(tabs)` 그룹은 pathless group이므로 `apps/mobile/src/app/(tabs)/index.tsx`의 실제 홈 route는 `/`이다.
- 기존 모바일 하단 탭은 `/`, `/reservations`, `/profile`이며 `apps/mobile/src/app/index.spec.md`가 root app/auth/tabs 계약을 함께 소유하고 있다.
- 현재 모바일 홈은 더미 `todayReservations`를 렌더링하고, 예약 탭은 더미 `upcomingReservations`를 렌더링한다. Stage 1에서는 구현 파일을 수정하지 않는다.
- 현재 admin 예약 관련 운영 UX는 별도 `/reservations` page가 아니라 `/timelines` 목록/상세/등록, `/timelines/[timelineId]/sessions/*`, `/timelines/[timelineId]/sessions/[sessionId]/programs/*` 흐름으로 구현되어 있다.
- 현재 backend scheduling schema/API/Orval 생성물은 `Timeline`, `Session`, `Program`, `ProgramActivity`를 제공한다. `Reservation` Prisma model, DTO, Entity, Repository, Service, Facade/ApplicationService, Controller, Orval hook은 없다.
- 다만 reference data와 권한 카탈로그에는 `entity:Reservation`, `quickAction:todayReservation`, `quickAction:quickReservation`이 존재한다. `VIEW` role은 자신의 Reservation `create/read/update`, `MANAGE`와 `FULL_ACCESS`는 Reservation `manage` seed를 가진다.

## 화면/라우트 목적

모바일 홈(`/`)은 인증된 사용자가 예약 가능 대상, 일정, 옵션을 확인하고 예약 생성 요청까지 이어갈 수 있는 첫 화면이다. 기존 auth/session gate와 하단 탭 shell 계약은 유지하되, 홈 콘텐츠는 `Timeline -> Session -> Program -> Reservation` 예약 흐름의 route owner가 된다.

## 사용자 시나리오

1. 앱 시작 시 `AuthSessionGate`가 callback route가 아닌 route 화면을 렌더하기 전에 `mobileAuthStore.verifySession()`으로 세션을 확인한다.
2. 인증 상태면 홈(`/`)으로 보내고, 비인증 상태면 `/auth/login?returnTo=/`로 보낸다.
3. 인증된 홈(`/`) 화면은 Expo Router `(tabs)` 그룹의 `홈`, `예약`, `내 정보` 하단 탭으로 진입한다.
4. 홈은 `Timeline` 목록을 예약 가능 대상 카탈로그로 보여준다.
5. 사용자가 `Timeline`을 선택하면 해당 타임라인의 `Session` 목록을 일정 후보로 보여준다.
6. 사용자가 `Session`을 선택하면 해당 세션의 `Program` 목록을 예약 옵션으로 보여준다.
7. 사용자는 세션 유형에 맞는 예약 일시(`occurrenceStartAt`)와 메모를 확인/입력한 뒤 예약 요청을 제출한다.
8. 필수 선택이나 예약 일시가 비어 있으면 API 호출 없이 필드별 검증 메시지를 표시한다.
9. 예약 요청 성공 시 생성된 예약 상태를 표시하고 `/reservations` 탭에서 새 예약을 확인할 수 있게 한다.
10. 카탈로그 조회 실패, 빈 상태, 권한/scope 실패, 중복 예약, 정원 초과는 사용자가 복구할 수 있는 메시지와 retry/back 액션을 제공한다.
11. `/auth/login`은 외부 브라우저를 열지 않고 앱 내 WebView에 `user-mobile` clientId 기반 IDP API 로그인 URL을 로드한다.
12. IDP 인증 완료 후 `/auth/callback`에서 callback code/state를 교환하고, native 세션 검증까지 통과한 뒤 홈(`/`)으로 이동한다.
13. callback/returnTo에 IDP Web 경로(`/dashboard` 등)가 섞이면 모바일 인증 홈(`/`)으로 정규화한다.
14. `내 정보` 탭은 로그아웃 버튼을 제공하고, 로그아웃 완료 후 `/auth/login`으로 이동한다.

## Route Mapping

| route | route file | 설명 |
|-------|------------|------|
| `/` | `apps/mobile/src/app/(tabs)/index.tsx` | 예약 카탈로그와 예약 생성 진입점인 홈 탭 |
| `/(tabs)` | `apps/mobile/src/app/(tabs)/_layout.tsx` | Expo Router 하단 탭 shell |
| `/reservations` | `apps/mobile/src/app/(tabs)/reservations.tsx` | 내 예약 목록/상태 확인 탭 |
| `/profile` | `apps/mobile/src/app/(tabs)/profile.tsx` | 내 정보 탭 + 로그아웃 |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | AuthSessionGate + IDP client bootstrap shell |
| `/auth/login` | `apps/mobile/src/app/auth/login.tsx` | native UI 없이 WebView만 렌더링하는 `user-mobile` 로그인 진입점 |
| `/auth/callback` | `apps/mobile/src/app/auth/callback.tsx` | OIDC callback 세션 확인/리다이렉트 처리 |

## Layout/Shell 계약

- root `_layout.tsx`는 `GestureHandlerRootView` 안쪽, `DesignSystemProvider` 바깥쪽에 `SafeAreaProvider`를 한 번만 설치한다.
- route 화면은 `react-native-safe-area-context`를 직접 읽지 않고 `@cocrepo/mo-ui`의 `ScreenFrame`으로 safe-area padding을 적용한다.
- `(tabs)/_layout.tsx`가 Expo Router `Tabs`를 소유하고, `/`, `/reservations`, `/profile`을 하단 탭으로 등록한다.
- 탭 화면은 `ScreenFrame`의 top/left/right edge를 사용하고, bottom safe area와 탭 바 영역은 Expo Router Tabs가 소유한다.
- `/auth/login`은 `ScreenFrame` 안에서 full-screen WebView만 렌더링하고, `/auth/callback`은 사용자 친화적인 처리 상태를 표시한다.

## Admin 예약 UX 기준

| 운영 흐름 | 현재 route/API | 모바일 홈에 반영할 사실 |
|-----------|----------------|--------------------------|
| 예약 대상 관리 | `/timelines`, `useGetTimelines`, `useCreateTimeline` | `Timeline.name`, `description`, space scope를 예약 대상 카탈로그의 기본 정보로 사용 |
| 일정 관리 | `/timelines/[timelineId]/sessions/new`, `useGetSessions`, `useCreateSession` | `Session.type`, `startDateTime`, `endDateTime`, `recurringDayOfWeek`, `repeatCycleType`가 예약 일시 검증의 원천 |
| 옵션 관리 | `/timelines/[timelineId]/sessions/[sessionId]/programs/new`, `useGetPrograms`, `useCreateProgram` | `Program.name`, `routineId`, `instructorId`, `capacity`, `level`, `routineNameSnapshot`, `activityCount`, `previewExerciseNames`를 옵션 카드에 노출 |
| 예약 권한 | reference data `entity:Reservation` | 일반 모바일 사용자는 own Reservation create/read/update, 운영자는 manage 권한 전제로 backend handoff 필요 |

현재 admin web에는 Reservation 자체의 list/detail/create page가 없고, `packages/common-constant/src/routing/endpoints.ts`의 legacy reservation path 상수는 현재 Next.js admin route catalog와 연결되어 있지 않다.

## 모바일 홈 예약 화면 계약

### 화면 구성

| 영역 | 내용 | 상태 |
|------|------|------|
| 홈 요약 | 오늘/다가오는 예약 수, 마지막 생성 상태 | Reservation read API가 생기기 전까지 더미 제거 후 빈/로딩 상태로 전환 |
| 예약 대상 | `Timeline` 카드 목록, 검색/새로고침 | loading, empty, error, selected |
| 일정 선택 | 선택된 Timeline의 `Session` 목록 | disabled until timeline selected, loading, empty, error |
| 옵션 선택 | 선택된 Session의 `Program` 목록 | disabled until session selected, loading, empty, error |
| 예약 확인 | 선택 요약, 예약 일시, memo, 제출 버튼 | validation, submitting, success, failure |

### 예약 일시 규칙

| Session type | `occurrenceStartAt` 결정 |
|--------------|--------------------------|
| `ONE_TIME` | `Session.startDateTime`을 예약 일시로 고정한다. 값이 없으면 해당 session은 예약 불가로 표시한다. |
| `ONE_TIME_RANGE` | 사용자가 `startDateTime <= occurrenceStartAt < endDateTime` 범위 안의 일시를 선택한다. |
| `RECURRING` | 사용자가 `recurringDayOfWeek`와 `repeatCycleType`에 맞는 다음 occurrence를 선택한다. 현재 API가 occurrence 목록을 제공하지 않으므로 backend handoff에서 occurrence read model을 추가한다. |

### 필드/검증 계약

| 필드 | 출처 | 필수 | 검증 |
|------|------|:----:|------|
| `timelineId` | 선택한 `Timeline.id` | O | 존재, 현재 space 접근 가능, `removedAt = null` |
| `sessionId` | 선택한 `Session.id` | O | 선택한 timeline에 속함, `removedAt = null` |
| `programId` | 선택한 `Program.id` | O | 선택한 session에 속함, `removedAt = null` |
| `occurrenceStartAt` | session type별 일시 선택 | O | session schedule 규칙과 일치, 과거 일시 금지 |
| `memo` | 사용자 입력 | X | trim 후 최대 500자 |
| `idempotencyKey` | route-local 생성값 | O | 중복 탭/재시도 제출 방지용 UUID |

예약 생성 요청 시 `spaceId`와 `userId`는 클라이언트가 직접 보내지 않고 인증/space context에서 서버가 확정한다.

## 현재 사용 가능한 API/Orval 계약

새 모바일 API client를 직접 작성하지 않는다. 모바일 route 구현은 `@cocrepo/api/core/timelines`의 Orval 생성 hook만 사용한다.

| 목적 | Backend endpoint | 현재 Orval hook | params |
|------|------------------|-----------------|--------|
| 예약 대상 조회 | `GET /api/v1/timelines` | `useGetTimelines` | `skip`, `take`, `search`, `timelineId?`, `contentLanguageCode?` |
| 일정 조회 | `GET /api/v1/timelines/:timelineId/sessions` | `useGetSessions` | `skip`, `take` |
| 옵션 조회 | `GET /api/v1/timelines/:timelineId/sessions/:sessionId/programs` | `useGetPrograms` | `skip`, `take` |

주의:
- `TimelinesRepository`는 runtime에서 session/program count를 `_count`로 포함하지만 현재 generated `TimelineDto`/`SessionDto` 타입에는 `_count`가 안정 계약으로 노출되지 않는다. 모바일 카드에 count/availability가 필요하면 backend DTO를 `sessionCount`, `programCount`, `availableSeatCount` 같은 명시 필드로 확장한 뒤 Orval 재생성한다.
- 현재 `useGetSessions`/`useGetPrograms` generated params에는 `search`가 없다. 모바일 검색이 필요하면 backend query DTO/Swagger/Orval 계약을 먼저 확장한다.
- Reservation create/read/cancel hook은 현재 없다. 신규 Swagger 반영 후 `pnpm --filter=@cocrepo/api codegen`으로 생성된 hook만 연결한다.

## Backend Reservation Contract HandOff

### 현재 부재한 계층

- Prisma schema에 `Reservation` model이 없다.
- `@cocrepo/dto`, `@cocrepo/entity`, `@cocrepo/repository`, `@cocrepo/service`, `@cocrepo/app`, `@cocrepo/facade`, `apps/core/api`에 Reservation 전용 계약이 없다.
- `packages/fe-api/src/core`에 Reservation Orval namespace/hook이 없다.

### 추가할 핵심 도메인 계약

| Layer | handoff |
|------|---------|
| Prisma | `Reservation` model, `ReservationStatus` enum(`PENDING`, `CONFIRMED`, `CANCELLED`) 추가. `spaceId`, `userId`, `timelineId`, `sessionId`, `programId`, `occurrenceStartAt`, `status`, `memo`, audit timestamps를 포함한다. |
| DTO | `ReservationDto`, `CreateReservationDto`, `QueryReservationDto`, `CancelReservationDto` 추가. |
| Entity | `Reservation` entity 추가. |
| Repository | active reservation 중복 조회, capacity 집계, own reservation 조회, status 변경, soft delete/cancel 처리. |
| Service | Program-Session-Timeline 연결 검증, session schedule 검증, capacity 초과 검증, own scope 검증, idempotency 처리. |
| ApplicationService/Facade | 모바일 홈 예약 생성 workflow, 내 예약 read model, 운영자 confirm/cancel workflow 조립. |
| API/Module | `ReservationsController`, `ReservationsModule`, Swagger `operationId` 고정 후 Orval 생성. |
| 권한/scope | existing `entity:Reservation` seed를 사용한다. `VIEW`는 own create/read/update, `MANAGE`/`FULL_ACCESS`는 manage. Catalog read는 `@ApiAuth` + selected space가 필요하다. |

### API handoff

| operationId | method/path | owner | 설명 |
|-------------|-------------|-------|------|
| `createReservation` | `POST /api/v1/reservations` | mobile home | 홈 선택값으로 예약 생성 |
| `getMyReservations` | `GET /api/v1/reservations/me` | mobile reservations tab | 본인 예약 목록 조회 |
| `getMyReservationById` | `GET /api/v1/reservations/me/:reservationId` | mobile reservations detail future | 본인 예약 상세 |
| `cancelMyReservation` | `PATCH /api/v1/reservations/me/:reservationId/cancel` | mobile reservations tab/detail | 본인 예약 취소 |
| `getReservations` | `GET /api/v1/reservations` | admin future | 운영자 예약 목록 |
| `confirmReservation` | `PATCH /api/v1/reservations/:reservationId/confirm` | admin future | 운영자 예약 확정 |

`CreateReservationDto` 최소 요청:

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

성공 응답은 `ReservationDto`를 반환한다. 생성 직후 기본 status는 `PENDING`이며, backend 정책상 즉시 확정되는 옵션이면 `CONFIRMED`를 반환할 수 있다.

### 실패 코드 계약

| code | 상황 | 모바일 처리 |
|------|------|-------------|
| `400` | 필수 필드 누락, schedule 규칙 불일치, memo 초과 | 필드별 검증 메시지 |
| `401` | 세션 없음/만료 | `/auth/login?returnTo=/`로 이동 |
| `403` | space/scope 또는 Reservation 권한 부족 | 권한 안내와 홈 복귀 |
| `404` | timeline/session/program 없음 또는 연결 불일치 | 선택 초기화 후 카탈로그 재조회 |
| `409` | 중복 예약, 정원 초과, idempotency 충돌 | 선택 유지, 다른 일정/옵션 선택 안내 |
| `500` | 서버 오류 | retry 제공 |

## State Ownership

- 홈 예약 상태는 `/` route 단일 화면 전용이므로 `packages/fe-store`로 승격하지 않는다.
- Stage 3에서 `apps/mobile/src/app/(tabs)/index.tsx` 또는 route-local hook/class가 소유한다.
- 인증 상태는 기존 `mobileAuthStore`를 계속 사용한다.
- Reservation 생성 후 `/reservations` 탭과 공유해야 하는 목록 캐시는 Orval/React Query cache invalidation으로 처리하고, 별도 shared MobX store를 만들지 않는다.

## State Shape

```ts
type HomeReservationPhase =
  | "timeline"
  | "session"
  | "program"
  | "confirm"
  | "success";

type HomeReservationState = {
  phase: HomeReservationPhase;
  selectedTimelineId: string | null;
  selectedSessionId: string | null;
  selectedProgramId: string | null;
  occurrenceStartAt: string;
  memo: string;
  idempotencyKey: string;
  fieldErrors: Partial<Record<"timelineId" | "sessionId" | "programId" | "occurrenceStartAt" | "memo", string>>;
  queryErrorScope: "timeline" | "session" | "program" | null;
  submitState: "idle" | "submitting" | "succeeded" | "failed";
  createdReservationId: string | null;
};
```

## Mobile UI/State/Test HandOff

### Stage 2 UI targets

- 우선 재사용: `ScreenFrame`, `Button`, `Chip`, `TagGroup`, `Skeleton`, `SkeletonGroup`, `Alert`, `Card`, `ListGroup`, `BottomSheet`, `Select`, `Textarea`.
- 필요 시 추가할 mobile UI target:
  - 예약 대상/일정/옵션을 같은 선택 패턴으로 보여주는 selectable list/card primitive.
  - 예약 생성 confirm summary와 submit result 상태를 표현하는 feedback surface.
  - session type별 occurrence picker. `RECURRING` occurrence는 backend read model이 생긴 뒤 정확히 구현한다.

Stage 2 구현 결과:
- `@cocrepo/mo-ui` `SelectableCardList`: `Timeline`/`Session`/`Program` 선택 카드 목록 공통 primitive.
- `@cocrepo/mo-ui` `OccurrencePicker`: `ONE_TIME` 고정 일시, `ONE_TIME_RANGE` 옵션 목록, `RECURRING` occurrence read model 대기 상태를 표시하는 선택 primitive.
- `@cocrepo/mo-ui` `SummaryList`: 예약 확인 단계의 선택 요약/미선택 placeholder 표시.
- `@cocrepo/mo-ui` `StatusFeedback`: loading/empty/error/submitting/success 상태와 retry/result 액션 표시.

### Stage 3 API/state integration

- `useGetTimelines`, `useGetSessions`, `useGetPrograms`는 Orval hook 그대로 사용한다.
- `useCreateReservation`, `useGetMyReservations`, `useCancelMyReservation`는 backend Swagger 반영 후 Orval 재생성 결과만 사용한다.
- 홈 route는 `isLoading`, `isFetching`, `error`, `data` 기반으로 로딩/빈/실패 상태를 분기한다.
- 현재 generated Orval export 재검색 결과 `createReservation`/`useCreateReservation`, `getMyReservations`/`useGetMyReservations`, `cancelMyReservation`/`useCancelMyReservation`는 없다.
- Stage 3 구현은 `apps/mobile/src/app/(tabs)/index.tsx`가 route-local state로 `Timeline -> Session -> Program -> occurrence -> confirm` 선택값과 field error/submitting/success 상태를 소유한다.
- `useGetTimelines`, `useGetSessions`, `useGetPrograms`는 `@cocrepo/api/core/timelines`의 generated hook을 그대로 호출하며, mobile runtime을 위해 root layout이 `QueryClientProvider`를 설치하고 core client 401 redirect를 `/auth/login`으로 맞춘다.
- `apps/mobile/src/auth/auth-config.ts`는 Android emulator와 iOS/dev host 차이를 흡수하는 `getCoreApiBaseUrl()`을 제공하고, route는 Orval hook의 `request.baseURL` 옵션으로만 core API host를 주입한다. 별도 manual API client는 작성하지 않는다.
- `createReservation` Orval hook이 없으므로 submit은 네트워크를 호출하지 않는다. 필수 선택과 occurrence/memo 검증이 통과하면 route-local `submitting` 후 `success` 상태로 전환하고, `idempotencyKey`와 선택값을 `PENDING_BACKEND_HANDOFF` 성격의 draft로 기록한다.
- Reservation create/read/cancel hook이 생성되기 전까지 `/reservations` 탭 cache invalidation 및 더미 목록 제거는 Stage 3에서 수행하지 않는다. backend 계약 반영 후 Orval codegen이 완료되면 create 성공 시 Reservation query cache invalidation으로 연결한다.

### Unit test contract

| ID | owner | 검증 |
|----|-------|------|
| `MO-UNIT-HOME-RES-001` | `apps/mobile/src/route-tests/index.test.tsx` | 홈 route가 `/` owner로 렌더되고 기존 인벤토리 문구가 노출되지 않음 |
| `MO-UNIT-HOME-RES-002` | same | Timeline 로딩/빈/에러 상태와 retry action 렌더 |
| `MO-UNIT-HOME-RES-003` | same | Timeline 선택 전 Session/Program/Submit 비활성 |
| `MO-UNIT-HOME-RES-004` | same | Timeline -> Session -> Program 선택 시 confirm summary 갱신 |
| `MO-UNIT-HOME-RES-005` | same | session type별 `occurrenceStartAt` 검증 |
| `MO-UNIT-HOME-RES-006` | same | createReservation hook 부재 시 route-local pending backend success state 기록 |
| `MO-UNIT-HOME-RES-007` | same | 400/401/403/404/409/500 실패 메시지 분기 |

Stage 3 route unit 구현 결과:
- `MO-UNIT-HOME-RES-001`: 홈 route가 `/` owner로 렌더되고 기존 더미 홈 예약(`헤어 케어 예약`)과 오래된 인벤토리 문구가 노출되지 않음을 확인한다.
- `MO-UNIT-HOME-RES-002`: Timeline loading/empty/retry 상태를 확인한다.
- `MO-UNIT-HOME-RES-003`: Timeline 선택 전 Session/Program/Submit 검증 대기 상태를 확인한다.
- `MO-UNIT-HOME-RES-004`: Timeline -> Session -> Program 선택 후 `SummaryList` 확인 요약과 `ONE_TIME` 고정 occurrence 표시를 확인한다.
- `MO-UNIT-HOME-RES-005`: `ONE_TIME_RANGE` occurrence 미선택 검증, occurrence 선택 후 submit 흐름, `RECURRING` occurrence read model 부재 메시지를 확인한다.
- `MO-UNIT-HOME-RES-006`: `createReservation` hook 부재 상태에서 네트워크 호출 없이 route-local pending backend success 상태와 `idempotencyKey` 안내를 확인한다.
- `MO-UNIT-HOME-RES-007`: Timeline 조회 400/401/403/404/409/500 에러 메시지와 retry action을 확인한다.

### E2E contract

| ID | 대상 | 핵심 시나리오 |
|----|------|---------------|
| `MO-E2E-004` | `/` | 홈에서 타임라인 -> 세션 -> 옵션 -> 예약 일시 선택 후 예약 요청 성공 상태를 확인 |
| `MO-E2E-005` | `/` | 카탈로그 조회 실패 시 retry가 동작하고 선택 상태가 안전하게 복구됨 |
| `MO-E2E-006` | `/` | 중복 예약/정원 초과/권한 실패 메시지가 사용자에게 노출됨 |
| `MO-E2E-007` | `/` | 홈 예약 카탈로그가 비어 있을 때 빈 상태 가이드와 재조회 action이 동작함 |
| `MO-E2E-008` | `/reservations` | 홈에서 생성한 예약이 내 예약 탭에 `PENDING` 또는 `CONFIRMED`로 표시됨 |

Stage 4 E2E smoke 구현 결과:
- `apps/mobile/e2e/smoke.e2e.js`는 오래된 인벤토리 홈 문구(`모바일 컴포넌트 인벤토리`, `Button Showcase`) 대신 `MO-E2E-004`의 홈 예약 시작 화면 문구(`오노라`, `예약을 시작하세요`, `예약 대상`, `예약 요청 제출`)를 기대한다.
- `apps/mobile/e2e/jest.config.js`는 Detox 20 runner 계약에 맞춰 `detox/runners/jest/globalSetup`, `globalTeardown`, `testEnvironment`, `reporter`를 사용한다.
- 기존 `apps/mobile/e2e/init.js`의 수동 `detox.init()`/`detox.cleanup()` setup은 Detox 20 public export와 맞지 않아 제거했다.

### Stage 4 verification status

| 항목 | Verified 상태 | 결과 |
|------|---------------|------|
| `@cocrepo/mo-ui` unit | Verified | `pnpm --filter @cocrepo/mo-ui test`: 5 suites, 11 tests passed |
| `@cocrepo/mo-ui` type | Verified | `pnpm --filter @cocrepo/mo-ui type-check`: `tsc --noEmit` passed |
| `mobile-app` route unit | Verified | `pnpm --filter mobile-app test`: 8 suites, 32 tests passed. `MO-UNIT-HOME-RES-001`~`007` are covered by `apps/mobile/src/route-tests/index.test.tsx` |
| `mobile-app` type | Verified | `pnpm --filter mobile-app type-check`: `tsc --noEmit` passed |
| `mobile-app` Detox smoke | Blocked after harness fix | Pre-fix `pnpm --filter mobile-app test:e2e` failed before launch with `TypeError: detox.init is not a function` and `device is not defined`. After Stage 4 setup update, the command reaches Detox environment validation but fails before the smoke body because `/Users/in05895_mac/Library/Detox/ios/framework/9fed164016853a53835f43f0fc185587351fea37/Detox.framework` is missing. Detox recommends `detox clean-framework-cache && detox build-framework-cache` |
| `mobile-app` doctor | Blocked | Requested exact command `pnpm --filter mobile-app doctor` is intercepted by pnpm and fails with `ERROR Unknown option: 'recursive'`. Equivalent `pnpm --filter mobile-app run doctor` runs `expo-doctor`; 14/17 checks pass, but duplicate `react` native module dependencies are installed, Xcode 16.4.0 is incompatible with Expo SDK 55's required Xcode `>=26.0.0`, and 8 Expo SDK package patch versions are behind expected versions |
| diff hygiene | Verified | `git diff --check`: passed |

Residual risk:
- Detox has not executed the updated `MO-E2E-004` smoke body in this environment because the local iOS Detox framework cache is missing.
- `MO-E2E-005`~`MO-E2E-008` remain contract-level E2E scenarios until native Detox runtime, backend catalog fixtures, and Reservation create/read API are available.

## 모바일 auth 계약

### returnTo deep-link 방식

- 로그인은 `apps/mobile/src/auth/_utils/auth.ts`의 `buildAuthLoginUrl()`로 `clientId=user-mobile`과 `returnTo=kr.co.cocdev.onoramobile://auth/callback?returnTo=/` 형태의 deep-link를 생성한다.
- 생성된 로그인 URL은 `react-native-webview`로 앱 내부에서 로드하며, Chrome/Safari 같은 외부 브라우저나 별도 네이티브 로그인 화면을 열지 않는다.
- Android 에뮬레이터에서 IDP가 `localhost` 절대 URL로 리다이렉트하면 WebView navigation 단계에서 `10.0.2.2` host로 보정해 앱 내부 흐름을 유지한다.
- WebView가 `kr.co.cocdev.onoramobile://auth/callback?...` navigation을 감지하면 로드를 중단하고 Expo Router `/auth/callback`으로 query params를 전달한다.
- 콜백 URL은 `src/auth/_utils/auth.ts`의 `buildAuthCallbackUrl()`/`parseAuthCallbackReturnTarget()`로 정규화한다.
- 초기 앱 진입 기본값은 인증 성공 시 홈(`/`), 비인증 시 `/auth/login?returnTo=/`이다.

### 네이티브 로그인 컨테이너 계약

- `/auth/login`은 네이티브 이메일/비밀번호 폼, "로그인 계속" CTA, 별도 안내 카드를 렌더링하지 않는다.
- `/auth/login`의 사용자 문구와 입력 폼은 WebView 내부의 IDP Web `/interaction/[uid]`가 client별 `loginUi` 설정에 따라 렌더링한다.
- `/auth/login`과 `/auth/callback`은 `복귀 경로`, `target`, callback/API 용어처럼 내부 구현을 설명하는 문구를 화면에 노출하지 않는다.
- `/auth/callback`은 로그인 확인 중/실패 상태를 사용자가 이해할 수 있는 문장으로 표시하고, 실패 시 `로그인 다시 시도` 액션을 제공한다.

### 토큰/세션 체크 체크리스트

- `AuthSessionGate`가 callback route가 아닌 모든 초기 route에서 `mobileAuthStore.authStatus`가 `unknown`이면 `verifySession()`을 수행한다.
- `verifySession()` 완료 전에는 `Stack` children을 렌더하지 않고 native splash view를 유지한다.
- 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login`으로 `router.replace()`를 먼저 보낸다.
- 목표 화면의 `onLayout` 이후에만 `SplashScreen.hideAsync()`를 호출한다.
- 인증/콜백 흐름에 IDP Web 경로가 섞이면 `resolveAuthenticatedRoutePath()`가 `/`, `/reservations`, `/profile`만 허용하고 나머지는 홈(`/`)으로 보정한다.
- `/auth/callback`은 `verifySession(params)`가 `error`, `code`, `state`, `returnTo`를 해석한다.
- 콜백 성공 직후 `mobileAuthStore.verifySession()`으로 WebView 쿠키가 native API client에 공유됐는지 검증하고 store를 `authenticated`로 갱신한다.
- native 세션 검증까지 성공한 경우에만 `nextRoute`로 리다이렉트하고, 실패 시 재시도 가이드를 노출한다.
- 루트 하단 탭 메인의 `내 정보` 탭은 `mobileAuthStore.logout()` 후 `/auth/login`으로 이동한다.

## 구현 체크리스트

- [x] 실제 홈 route가 `/`이며 owner file이 `apps/mobile/src/app/(tabs)/index.tsx`임을 확인
- [x] `/_layout.tsx`에서 `AuthSessionGate`로 보호 라우트 접근 제어 처리
- [x] IDP 클라이언트 베이스 URL/리다이렉트 URL 셋업 주입
- [x] 인증된 홈 화면을 하단 탭 메인으로 제공
- [x] `apps/mobile/src/app/app.context.md`와 route ownership 동기화
- [x] admin Timeline/Session/Program UX와 backend/Orval 현재 계약을 기준으로 Stage 1 예약 플로우 계약 정리
- [x] Reservation backend contract handoff 정리
- [x] mobile UI/state/unit/E2E test contract 정리
- [x] Stage 2에서 필요한 mobile UI target 구현
- [x] Stage 3에서 route-local state와 Orval read hook 연동
- [ ] Backend Reservation API 구현 및 Orval codegen 후 create/read/cancel hook 연동
- [x] Stage 4에서 route unit 검증, Detox smoke 기대값, Detox setup, 검증 결과와 잔여 risk 반영

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-06 | Stage 4에서 모바일 홈 예약 route unit/type 검증 결과를 Verified로 반영하고, 오래된 인벤토리 Detox smoke를 홈 예약 시작 화면 기준으로 갱신했으며, Detox framework cache/Expo doctor 잔여 risk를 기록 | codex |
| 2026-05-06 | Stage 3에서 모바일 홈 route를 Timeline/Session/Program Orval read hook과 Stage 2 UI target으로 통합하고, Reservation create hook 부재에 따른 route-local pending backend submit 결과와 route unit 테스트 계약을 반영 | codex |
| 2026-05-06 | Stage 2에서 홈 예약 플로우용 `SelectableCardList`, `OccurrencePicker`, `SummaryList`, `StatusFeedback` UI package target 구현 결과를 반영 | codex |
| 2026-05-06 | Stage 1 재시작 기준으로 실제 `/` 홈 route, admin Timeline/Session/Program UX, 현재 backend/Orval 부재 계약을 재검증하고 Reservation handoff/UI/state/test 계약을 전면 정리 | codex |
| 2026-05-06 | Orval hook 전제, Reservation backend handoff 계층, 제출 성공 상태 및 모바일 UI/state/test handoff를 보강 | codex |
| 2026-05-06 | 홈 화면을 예약 카탈로그 기반 예약 생성 진입점으로 확장하고 예약 대상/일정/옵션 데이터 모델, validation, 실패/빈 상태 및 E2E 계약을 추가 | codex |
| 2026-05-06 | 홈/예약/내 정보 화면을 Expo Router `(tabs)` 그룹으로 분리하고 IDP Web returnTo를 모바일 홈으로 보정하는 계약 추가 | codex |
| 2026-05-05 | `/auth/login`을 native 안내/CTA 없는 full-screen WebView 전용 컨테이너로 정정 | codex |
| 2026-05-05 | Expo root safe-area provider와 `@cocrepo/mo-ui` `ScreenFrame` 기반 route safe-area wrapper 계약 추가 | codex |
| 2026-05-05 | 모바일 clientId를 `user-mobile`, callback scheme을 `onora-mobile`, 인증 홈을 루트 하단 탭 메인으로 정정 | codex |
| 2026-05-06 | OIDC native client 검증에 맞춰 모바일 callback scheme을 reverse-domain 형식으로 정정 | codex |
| 2026-05-04 | Stage 3 완료 정리를 위해 모바일 route 계약/토큰-세션 체크/라우트 unit ownership 테스트 반영 | codex |
| 2026-05-04 | Expo Router 앱 번들에서 테스트 파일이 제외되도록 route unit test 위치를 `src/route-tests`로 이동 | codex |
| 2026-05-04 | Expo Router route tree 경고 제거를 위해 non-route auth 유틸/스토어를 `src/auth`로 이동 | codex |
| 2026-05-04 | 초기 인증 선확인 후 홈/로그인 선라우팅, 화면 layout 이후 splash hide 정책 반영 | codex |
| 2026-05-04 | 외부 브라우저 실행을 제거하고 WebView 기반 idp/web 로그인 + callback scheme interception으로 변경 | codex |
| 2026-05-04 | Android WebView에서 IDP localhost 리다이렉트를 에뮬레이터 host로 보정하는 계약 추가 | codex |
| 2026-05-04 | callback 성공 후 native 세션 검증으로 인증 store를 갱신해 로그인 루프를 방지하는 계약 추가 | codex |
| 2026-05-04 | 홈 화면 세션 상태 표시와 로그아웃 버튼 계약 추가 | codex |
| 2026-05-05 | 모바일 로그인/콜백 화면에서 내부 경로 노출 제거 및 오노라 예약 플랫폼 문구 계약 추가 | codex |
