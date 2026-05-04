# mobile app route 계약서

> 생성일: 2026-05-04
> 수정일: 2026-05-04
> 타입: app
> 위치: apps/mobile/src/app/index.spec.md

## 화면/라우트 목적

모바일 앱의 인증 흐름을 위한 4개 라우트(`"/"`, `"/auth/login"`, `"/auth/callback"`, `"/dashboard"`) 계약을 소유하고, auth 진입점과 세션 검증/리다이렉트 동작을 정합성 있게 동기화한다.

## 사용자 시나리오

1. 앱 시작 시 `AuthSessionGate`가 어떤 route 화면도 렌더하기 전에 `mobileAuthStore.verifySession()`으로 세션 상태를 먼저 확인한다.
2. 인증 상태면 홈(`/`)으로 보내고, 비인증 상태면 `/auth/login`으로 보낸다.
3. 목표 route pathname이 확정되어 화면 layout이 발생한 뒤에만 native splash view를 끈다.
4. `/auth/login`은 외부 브라우저를 열지 않고 앱 내 WebView에 `idp/web` 로그인 URL을 로드한다.
5. idp/web 인증 완료 후 `/auth/callback`에서 callback code/state를 교환하고, native 세션 검증까지 통과한 뒤 `returnTo` 경로로 이동한다.
6. 인증된 홈(`/`) 화면은 현재 세션 상태와 로그아웃 버튼을 제공하고, 로그아웃 완료 후 `/auth/login`으로 이동한다.

## Route Mapping

| route | route file | 설명 |
|-------|------------|------|
| `/` | `apps/mobile/src/app/index.tsx` | 홈/인벤토리 화면 |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | AuthSessionGate + IDP client bootstrap shell |
| `/auth/login` | `apps/mobile/src/app/auth/login.tsx` | WebView 기반 idp/web 로그인 진입점 |
| `/auth/callback` | `apps/mobile/src/app/auth/callback.tsx` | OIDC callback + 세션 확인/리다이렉트 처리 |
| `/dashboard` | `apps/mobile/src/app/dashboard.tsx` | 인증 필수 보호 라우트 |

## 모바일 auth 계약

### returnTo deep-link 방식

- 로그인은 `apps/mobile/src/auth/_utils/auth.ts`의 `buildAuthLoginUrl()`로 `returnTo=prjcore://auth/callback?returnTo=/dashboard` 형태의 deep-link를 생성한다.
- 생성된 로그인 URL은 `react-native-webview`로 앱 내부에서 로드하며, Chrome/Safari 같은 외부 브라우저를 열지 않는다.
- Android 에뮬레이터에서 idp-api/idp-web이 `localhost` 절대 URL로 리다이렉트하면 WebView navigation 단계에서 `10.0.2.2` host로 보정해 앱 내부 흐름을 유지한다.
- WebView가 `prjcore://auth/callback?...` navigation을 감지하면 로드를 중단하고 Expo Router `/auth/callback`으로 query params를 전달한다.
- 콜백 URL은 `src/auth/_utils/auth.ts`의 `buildAuthCallbackUrl()`/`parseAuthCallbackReturnTarget()`로 정규화한다.
- `AuthSessionGate`와 `/dashboard`는 인증 라우트 진입 시 `returnTo` 파라미터를 보존한다.
- 초기 앱 진입 기본값은 인증 성공 시 홈(`/`), 비인증 시 `/auth/login?returnTo=/`이다.

### 토큰/세션 체크 체크리스트

- 요청 진입:
  - `AuthSessionGate`가 callback route가 아닌 모든 초기 route에서 `mobileAuthStore.authStatus`가 `unknown`이면 `verifySession()` 수행.
  - `verifySession()` 완료 전에는 `Stack` children을 렌더하지 않고 native splash view를 유지한다.
  - 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login`으로 `router.replace()`를 먼저 보낸다.
  - 목표 화면의 `onLayout` 이후에만 `SplashScreen.hideAsync()`를 호출한다.
- 로그인 콜백:
  - `/auth/callback`에서 `verifySession(params)`가 `error`, `code`, `state`, `returnTo`를 해석한다.
  - 오류가 없으면 `/api/v1/auth/callback` 교환 결과와 redirect location을 사용해 다음 라우트를 결정한다.
  - 콜백 성공 직후 `mobileAuthStore.verifySession()`으로 WebView 쿠키가 native API client에 공유됐는지 검증하고 store를 `authenticated`로 갱신한다.
  - native 세션 검증까지 성공한 경우에만 `nextRoute`로 리다이렉트하고, 실패 시 재시도 가이드를 노출한다.
- 대시보드:
  - `authStatus === "unauthenticated"` 일 때 `/auth/login`로 라우팅 (`returnTo` 파라미터 유지).
- 로그아웃:
  - 홈(`/`)과 대시보드(`/dashboard`)는 `로그아웃` 버튼을 노출한다.
  - `mobileAuthStore.logout()` 후 `/auth/login` 이동.

## 테스트 관점

### 소유 테스트(route unit)

| route | 테스트 파일 | 핵심 검증 항목 |
|------|------|--------------|
| `/` | `apps/mobile/src/route-tests/index.test.tsx` | 홈 인벤토리 렌더 상태, 세션 상태/로그아웃 버튼 |
| `/_layout` | `apps/mobile/src/route-tests/_layout.test.tsx` | `AuthSessionGate` 래핑과 IDP client bootstrap 호출 |
| `/auth/login` | `apps/mobile/src/route-tests/auth/login.test.tsx` | WebView URL 로드, callback scheme 가로채기, 재시도 |
| `/auth/callback` | `apps/mobile/src/route-tests/auth/callback.test.tsx` | 에러/성공/재시도 처리, `verifySession` 결과 반영 |
| `/dashboard` | `apps/mobile/src/route-tests/dashboard.test.tsx` | 보호 라우트 게이트 분기, 로그아웃 처리 |
| `AuthSessionGate` | `apps/mobile/src/route-tests/auth/AuthSessionGate.test.tsx` | 인증 선확인, 홈/로그인 선라우팅, layout 이후 splash hide |

## 구현 체크리스트

- [x] `/_layout.tsx`에서 `AuthSessionGate`로 보호 라우트 접근 제어 처리
- [x] IDP 클라이언트 베이스 URL/리다이렉트 URL 셋업 주입 (`setIdpBaseUrl`, `setIdpLoginRedirectUrl`)
- [x] `returnTo` deep-link 방식 유지
- [x] 초기 세션 확인 전 화면 렌더링/스플래시 해제 보류
- [x] 인증 성공 시 홈, 비인증 시 로그인 화면으로 선라우팅
- [x] callback 성공 후 native `verify-token` 검증으로 store 인증 상태 갱신
- [x] 인증된 홈 화면에서 로그아웃 액션 제공
- [x] auth callback/login/dashboard 테스트 산출물 확보
- [x] `apps/mobile/src/app/app.context.md`와 동기화

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-04 | Stage 3 완료 정리를 위해 모바일 route 계약/토큰-세션 체크/라우트 unit ownership 테스트 반영 | codex |
| 2026-05-04 | Expo Router 앱 번들에서 테스트 파일이 제외되도록 route unit test 위치를 `src/route-tests`로 이동 | codex |
| 2026-05-04 | Expo Router route tree 경고 제거를 위해 non-route auth 유틸/스토어를 `src/auth`로 이동 | codex |
| 2026-05-04 | 초기 인증 선확인 후 홈/로그인 선라우팅, 화면 layout 이후 splash hide 정책 반영 | codex |
| 2026-05-04 | 외부 브라우저 실행을 제거하고 WebView 기반 idp/web 로그인 + callback scheme interception으로 변경 | codex |
| 2026-05-04 | Android WebView에서 IDP localhost 리다이렉트를 에뮬레이터 host로 보정하는 계약 추가 | codex |
| 2026-05-04 | callback 성공 후 native 세션 검증으로 인증 store를 갱신해 로그인 루프를 방지하는 계약 추가 | codex |
| 2026-05-04 | 홈 화면 세션 상태 표시와 로그아웃 버튼 계약 추가 | codex |
