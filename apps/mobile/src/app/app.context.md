# mobile app 기획서

> 생성일: 2026-04-14
> 타입: app
> 위치: apps/mobile/src/app//app.context.md

## 역할

모바일 앱 route/app 수준의 계약과 테스트 ownership 을 정의합니다.

## route 계약

| route | owner spec | 설명 |
|------|------------|------|
| `/` | `apps/mobile/src/app/index.spec.md` | 예약 플랫폼 홈 탭 |
| `/(tabs)` | `apps/mobile/src/app/index.spec.md` | Expo Router 하단 탭 layout |
| `/reservations` | `apps/mobile/src/app/index.spec.md` | 예약 탭 |
| `/profile` | `apps/mobile/src/app/index.spec.md` | 내 정보 탭 + 로그아웃 |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | Expo Router root layout |
| `/auth/login` | `apps/mobile/src/app/index.spec.md` | first-party native 로그인 진입 라우트 |

`(tabs)` route group은 URL segment를 만들지 않으므로 실제 홈 route는 `/`이며, route owner file은 `apps/mobile/src/app/(tabs)/index.tsx`입니다.

`/` 홈 예약 기능은 `apps/mobile/src/app/index.spec.md`가 route 계약을 소유합니다. 현재 계약은 실제 Reservation API의 `getReservationBookingFeed`/`createReservation` Orval hook을 기준으로 하며, visual composition은 `packages/fe-mo-ui/src/screen/ReservationHomeScreen/ReservationHomeScreen.tsx`가 소유합니다.

`/reservations` 탭은 더미 예약 데이터를 사용하지 않고 `getMyReservations` Orval hook으로 로그인 사용자의 예약/대기 목록을 가져오며, visual composition은 `packages/fe-mo-ui/src/screen/MyReservationsScreen/MyReservationsScreen.tsx`가 소유합니다.

## 테스트 전략

- route unit test 는 Expo Router runtime bundle 에 포함되지 않도록 `apps/mobile/src/route-tests/**/*.test.tsx` 를 owner file 로 사용합니다.
- 인증 유틸/스토어/Gate 는 Expo Router route tree 에 포함되지 않도록 `apps/mobile/src/auth/**` 에 둡니다.
- app launch E2E 는 `apps/mobile/e2e/**/*.e2e.js` 를 owner file 로 사용합니다.
- Stage 1 에서 test case 를 spec 에 기록하고, Stage 2/3/4 에서 구현/실행 상태를 동기화합니다.

### 자동 검증

- `pnpm --filter @cocrepo/mo-ui test`
- `pnpm --filter @cocrepo/mo-ui type-check`
- `pnpm mobile:screen-targets:check`
- `pnpm --filter mobile-app test`
- `pnpm --filter mobile-app type-check`
- `pnpm --filter mobile-app test:e2e`
- `pnpm --filter mobile-app doctor`

### E2E 시나리오

| ID | 대상 | 설명 |
|----|------|------|
| `MO-E2E-001` | `/` | 앱 launch 후 오노라 하단 탭 메인의 홈/예약/내 정보 탭이 보여야 합니다. |
| `MO-E2E-002` | `/auth/login` | 로그인 라우트에서 WebView 없이 native email/password form으로 IDP API native login endpoint를 호출해야 합니다. |
| `MO-E2E-003` | app launch | SecureStore에 저장된 native token/session을 복원하고 refresh 필요 시 native refresh endpoint로 갱신해야 합니다. |
| `MO-E2E-004` | `/` | 홈에서 날짜 스트립과 수업 카드 booking feed가 보여야 합니다. |
| `MO-E2E-005` | `/` | 수업 카드 예약/대기 CTA가 정책 sheet를 열고 확인 후 예약 요청을 생성해야 합니다. |
| `MO-E2E-006` | `/` | 예약 제출 실패 시 권한, 검증, 중복 실패 메시지가 사용자에게 노출되어야 합니다. |
| `MO-E2E-007` | `/` | booking feed가 비어 있을 때 빈 상태 가이드와 재조회 action이 동작해야 합니다. |
| `MO-E2E-008` | `/reservations` | 홈에서 생성한 예약/대기 항목이 내 예약 탭에 `CONFIRMED` 또는 `WAITLISTED` 상태로 표시되어야 합니다. |

## auth session 체크

- `AuthSessionGate`는 초기 route 렌더 전에 `mobileSession.verifySession()` 기반 memory/SecureStore native session 복원을 먼저 수행한다.
- 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login`으로 route를 먼저 보낸다.
- 목표 route 화면의 layout이 확인된 뒤에만 `SplashScreen.hideAsync()`로 native splash view를 끈다.
- `/auth/login`은 Chrome/Safari, WebView, OIDC Authorization Code redirect를 사용하지 않고 native email/password form을 렌더링한다.
- `/auth/login`은 `POST /api/v1/auth/login`으로 `accessToken`, `refreshToken`, `sessionId`를 받고 memory scope와 SecureStore에 저장한다.
- 앱 시작 시 SecureStore의 native session을 복원하고 `verify-token`, `my-spaces`, `current-space`로 인증 context를 재구성한다.
- 401 refresh는 web cookie refresh가 아니라 `POST /api/v1/auth/native/token/refresh`를 사용하고 refresh token을 rotation한다.
- `내 정보` 탭 로그아웃은 `POST /api/v1/auth/native/logout` 후 memory scope와 SecureStore를 삭제한다.
- 인증된 홈(`/`) 화면은 Expo Router `(tabs)` 그룹의 `홈`, `예약`, `내 정보` 하단 탭으로 진입한다.
- returnTo에 IDP Web 경로(`/dashboard` 등)가 섞이면 모바일 인증 홈(`/`)으로 정규화한다.
- `내 정보` 탭에서 `mobileSession.logout()` 완료 후 `/auth/login`으로 이동한다.
