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
| `/(tabs)` | `apps/mobile/src/app/index.spec.md` | Expo Router 하단 탭 shell |
| `/reservations` | `apps/mobile/src/app/index.spec.md` | 예약 탭 |
| `/profile` | `apps/mobile/src/app/index.spec.md` | 내 정보 탭 + 로그아웃 |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | Expo Router root shell |
| `/auth/login` | `apps/mobile/src/app/index.spec.md` | `user-mobile` 로그인 진입 라우트 |
| `/auth/callback` | `apps/mobile/src/app/index.spec.md` | OIDC 콜백 처리 라우트 |

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
| `MO-E2E-002` | `/auth/login` | 로그인 라우트에서 외부 브라우저 없이 WebView가 `user-mobile` IDP API 로그인 URL을 로드하고 callback scheme을 앱 내부로 전달해야 합니다. |
| `MO-E2E-003` | `/auth/callback` | callback 처리 후 세션 검증 통과 시 루트 하단 탭 메인(`/`)으로 라우트해야 합니다. |
| `MO-E2E-004` | `/` | 홈에서 날짜 스트립과 수업 카드 booking feed가 보여야 합니다. |
| `MO-E2E-005` | `/` | 수업 카드 예약/대기 CTA가 정책 sheet를 열고 확인 후 예약 요청을 생성해야 합니다. |
| `MO-E2E-006` | `/` | 예약 제출 실패 시 권한, 검증, 중복 실패 메시지가 사용자에게 노출되어야 합니다. |
| `MO-E2E-007` | `/` | booking feed가 비어 있을 때 빈 상태 가이드와 재조회 action이 동작해야 합니다. |
| `MO-E2E-008` | `/reservations` | 홈에서 생성한 예약/대기 항목이 내 예약 탭에 `CONFIRMED` 또는 `WAITLISTED` 상태로 표시되어야 합니다. |

## auth session 체크

- `AuthSessionGate`는 callback route를 제외한 초기 route 렌더 전에 `mobileAuthStore.verifySession()` 기반 상태 정합성을 먼저 수행한다.
- 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login`으로 route를 먼저 보낸다.
- 목표 route 화면의 layout이 확인된 뒤에만 `SplashScreen.hideAsync()`로 native splash view를 끈다.
- `/auth/login`은 Chrome/Safari를 열지 않고 앱 내 WebView로 `clientId=user-mobile` IDP API 로그인 URL을 로드한다.
- `/auth/login`은 네이티브 로그인 폼/안내 카드/CTA를 렌더링하지 않고, 사용자 문구와 입력 폼은 WebView 내부 IDP Web이 소유한다.
- Android 에뮬레이터 WebView는 IDP가 반환한 `localhost` 절대 리다이렉트를 `10.0.2.2`로 보정해 host 머신의 IDP dev 서버를 계속 바라본다.
- WebView에서 `kr.co.cocdev.onoramobile://auth/callback` navigation이 발생하면 이를 가로채 `/auth/callback` route로 전달한다.
- `/auth/callback`은 에러 파라미터나 콜백 교환 실패 시 개발자용 callback/API 용어 대신 재시도 가능한 사용자 실패 상태를 표시한다.
- 성공 callback은 `mobileAuthStore.verifySession()`으로 native API client의 쿠키 기반 세션을 검증하고, store 인증 상태가 `authenticated`로 갱신된 뒤에만 deep-link 대상을 라우팅한다.
- 인증된 홈(`/`) 화면은 Expo Router `(tabs)` 그룹의 `홈`, `예약`, `내 정보` 하단 탭으로 진입한다.
- callback/returnTo에 IDP Web 경로(`/dashboard` 등)가 섞이면 모바일 인증 홈(`/`)으로 정규화한다.
- `내 정보` 탭에서 `mobileAuthStore.logout()` 완료 후 `/auth/login`으로 이동한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | `/`와 `/reservations`를 shared mobile screen owner 기반으로 정리하고 screen target 자동 검증 명령을 추가 | codex |
| 2026-05-09 | `/`를 실제 Reservation booking feed API 기반 날짜 스트립 + 수업 카드 홈으로, `/reservations`를 `getMyReservations` 기반 내 예약 목록으로 갱신 | codex |
| 2026-05-06 | Stage 1 재시작 기준으로 실제 홈 route(`/`)와 owner file을 명시하고 Reservation API 부재에 따른 backend handoff/test ownership을 보강 | codex |
| 2026-05-06 | 모바일 홈을 Expo Router `(tabs)` 구조로 전환하고 IDP Web returnTo를 홈으로 보정하는 정책 추가 | codex |
| 2026-05-05 | `/auth/login`을 native UI 없는 WebView-only 컨테이너로 정정하고 IDP Web 로그인 화면 소유권을 명시 | codex |
| 2026-05-05 | 모바일 로그인 clientId/callback scheme/루트 하단 탭 메인 계약을 `user-mobile`/`onora-mobile`/`/` 기준으로 정정 | codex |
| 2026-05-06 | OIDC native client 검증에 맞춰 모바일 callback scheme을 reverse-domain 형식으로 정정 | codex |
| 2026-05-06 | `/` 홈 예약 계약(예약 대상/세션/옵션 조회 및 예약 시작 플로우)과 테스트 시나리오를 `apps/mobile/src/app/index.spec.md` 소유로 정리 | codex |
| 2026-04-14 | 모바일 app 수준 route/test ownership 과 Detox smoke 시나리오를 추가 | codex |
| 2026-05-04 | Stage 3 대상 auth 라우트(`login/callback/dashboard`) + `index.spec.md` 정렬 및 세션 체크 항목 동기화 | codex |
| 2026-05-04 | Expo Router runtime bundle 보호를 위해 route unit test 와 non-route auth 모듈 위치를 `src/app` 밖으로 정리 | codex |
| 2026-05-04 | 초기 인증 선확인, 홈/로그인 선라우팅, 화면 layout 이후 splash hide 정책 추가 | codex |
| 2026-05-04 | 외부 브라우저 대신 WebView 기반 idp/web 로그인 정책 추가 | codex |
| 2026-05-04 | Android 에뮬레이터 WebView의 IDP localhost 리다이렉트 보정 정책 추가 | codex |
| 2026-05-04 | callback 성공 후 native verify-token 검증을 통과해야 홈으로 이동하도록 세션 갱신 정책 추가 | codex |
| 2026-05-04 | 홈/대시보드 로그아웃 버튼 정책 추가 | codex |
| 2026-05-05 | 모바일 로그인/콜백 화면의 오노라 예약 플랫폼 문구와 내부 경로 비노출 정책 추가 | codex |
