# mobile app route 계약서

> 생성일: 2026-05-04
> 수정일: 2026-05-05
> 타입: app
> 위치: apps/mobile/src/app/index.tsx

## 화면/라우트 목적

모바일 앱의 인증 흐름과 루트 하단 탭 메인 화면(`"/"`, `"/auth/login"`, `"/auth/callback"`) 계약을 소유하고, auth 진입점과 세션 검증/리다이렉트 동작을 정합성 있게 동기화한다.

## 사용자 시나리오

1. 앱 시작 시 `AuthSessionGate`가 어떤 route 화면도 렌더하기 전에 `mobileAuthStore.verifySession()`으로 세션 상태를 먼저 확인한다.
2. 인증 상태면 홈(`/`)으로 보내고, 비인증 상태면 `/auth/login`으로 보낸다.
3. 목표 route pathname이 확정되어 화면 layout이 발생한 뒤에만 native splash view를 끈다.
4. `/auth/login`은 외부 브라우저를 열지 않고 앱 내 WebView에 `user-mobile` clientId 기반 IDP API 로그인 URL을 로드한다.
5. IDP 인증 완료 후 `/auth/callback`에서 callback code/state를 교환하고, native 세션 검증까지 통과한 뒤 루트 하단 탭 메인(`/`)으로 이동한다.
6. `/auth/login`은 네이티브 안내/CTA 없이 full-screen WebView만 렌더링하고, 로그인 문구와 입력 폼은 IDP Web 내부가 소유한다.
7. 인증된 홈(`/`) 화면은 `홈`, `예약`, `내 정보` 하단 탭을 제공하고, `내 정보` 탭에서 로그아웃 완료 후 `/auth/login`으로 이동한다.

## Route Mapping

| route | route file | 설명 |
|-------|------------|------|
| `/` | `apps/mobile/src/app/index.tsx` | 예약 플랫폼 하단 탭 메인 화면 |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | AuthSessionGate + IDP client bootstrap shell |
| `/auth/login` | `apps/mobile/src/app/auth/login.tsx` | native UI 없이 WebView만 렌더링하는 `user-mobile` 로그인 진입점 |
| `/auth/callback` | `apps/mobile/src/app/auth/callback.tsx` | 사용자 친화적인 로그인 확인 상태 + OIDC callback 세션 확인/리다이렉트 처리 |

## Layout/Shell 계약

- root `_layout.tsx`는 `GestureHandlerRootView` 안쪽, `DesignSystemProvider` 바깥쪽에 `SafeAreaProvider`를 한 번만 설치한다.
- route 화면은 `react-native-safe-area-context`를 직접 읽지 않고 `@cocrepo/mo-ui`의 `ScreenFrame`으로 safe-area padding을 적용한다.
- `/` 하단 탭 메인은 `ScreenFrame` 기본 edge를 사용해 bottom safe area까지 확보하고, 하단 탭이 home indicator 영역과 겹치지 않게 한다.
- `/auth/login`은 `ScreenFrame` 안에서 full-screen WebView만 렌더링하고, `/auth/callback`은 사용자 친화적인 처리 상태를 표시한다.

## 모바일 auth 계약

### returnTo deep-link 방식

- 로그인은 `apps/mobile/src/auth/_utils/auth.ts`의 `buildAuthLoginUrl()`로 `clientId=user-mobile`과 `returnTo=onora-mobile://auth/callback?returnTo=/` 형태의 deep-link를 생성한다.
- 생성된 로그인 URL은 `react-native-webview`로 앱 내부에서 로드하며, Chrome/Safari 같은 외부 브라우저나 별도 네이티브 로그인 화면을 열지 않는다.
- Android 에뮬레이터에서 IDP가 `localhost` 절대 URL로 리다이렉트하면 WebView navigation 단계에서 `10.0.2.2` host로 보정해 앱 내부 흐름을 유지한다.
- WebView가 `onora-mobile://auth/callback?...` navigation을 감지하면 로드를 중단하고 Expo Router `/auth/callback`으로 query params를 전달한다.
- 콜백 URL은 `src/auth/_utils/auth.ts`의 `buildAuthCallbackUrl()`/`parseAuthCallbackReturnTarget()`로 정규화한다.
- 초기 앱 진입 기본값은 인증 성공 시 홈(`/`), 비인증 시 `/auth/login?returnTo=/`이다.

### 네이티브 로그인 컨테이너 계약

- `/auth/login`은 네이티브 이메일/비밀번호 폼, “로그인 계속” CTA, 별도 안내 카드를 렌더링하지 않는다.
- `/auth/login`의 사용자 문구와 입력 폼은 WebView 내부의 IDP Web `/interaction/[uid]`가 client별 `loginUi` 설정에 따라 렌더링한다.
- `/auth/login`과 `/auth/callback`은 `복귀 경로`, `target`, callback/API 용어처럼 내부 구현을 설명하는 문구를 화면에 노출하지 않는다.
- `/auth/callback`은 로그인 확인 중/실패 상태를 사용자가 이해할 수 있는 문장으로 표시하고, 실패 시 `로그인 다시 시도` 액션을 제공한다.

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
- 로그아웃:
  - 루트 하단 탭 메인의 `내 정보` 탭은 `로그아웃` 버튼을 노출한다.
  - `mobileAuthStore.logout()` 후 `/auth/login` 이동.

## 테스트 관점

### 소유 테스트(route unit)

| route | 테스트 파일 | 핵심 검증 항목 |
|------|------|--------------|
| `/` | `apps/mobile/src/route-tests/index.test.tsx` | 하단 탭 메인 렌더, 탭 전환, 내 정보 로그아웃 |
| `/_layout` | `apps/mobile/src/route-tests/_layout.test.tsx` | `AuthSessionGate` 래핑과 IDP client bootstrap 호출 |
| `/auth/login` | `apps/mobile/src/route-tests/auth/login.test.tsx` | full-screen WebView URL 로드, callback scheme 가로채기, native CTA 부재 |
| `/auth/callback` | `apps/mobile/src/route-tests/auth/callback.test.tsx` | 에러/성공/재시도 처리, `verifySession` 결과 반영 |
| `AuthSessionGate` | `apps/mobile/src/route-tests/auth/AuthSessionGate.test.tsx` | 인증 선확인, 홈/로그인 선라우팅, layout 이후 splash hide |

## 구현 체크리스트

- [x] `/_layout.tsx`에서 `AuthSessionGate`로 보호 라우트 접근 제어 처리
- [x] IDP 클라이언트 베이스 URL/리다이렉트 URL 셋업 주입 (`setIdpBaseUrl`, `setIdpLoginRedirectUrl`)
- [x] `returnTo` deep-link 방식 유지
- [x] 초기 세션 확인 전 화면 렌더링/스플래시 해제 보류
- [x] 인증 성공 시 홈, 비인증 시 로그인 화면으로 선라우팅
- [x] callback 성공 후 native `verify-token` 검증으로 store 인증 상태 갱신
- [x] 인증된 홈 화면을 하단 탭 메인으로 제공
- [x] `내 정보` 탭에서 로그아웃 액션 제공
- [x] 로그인/콜백 화면에서 내부 경로 노출 제거 및 오노라 예약 플랫폼 문구 적용
- [x] root layout safe-area provider와 route 화면 `ScreenFrame` wrapper 적용
- [x] auth callback/login/index 테스트 산출물 확보
- [x] `apps/mobile/src/app/app.context.md`와 동기화

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-05 | `/auth/login`을 native 안내/CTA 없는 full-screen WebView 전용 컨테이너로 정정 | codex |
| 2026-05-05 | Expo root safe-area provider와 `@cocrepo/mo-ui` `ScreenFrame` 기반 route safe-area wrapper 계약 추가 | codex |
| 2026-05-05 | 모바일 clientId를 `user-mobile`, callback scheme을 `onora-mobile`, 인증 홈을 루트 하단 탭 메인으로 정정 | codex |
| 2026-05-04 | Stage 3 완료 정리를 위해 모바일 route 계약/토큰-세션 체크/라우트 unit ownership 테스트 반영 | codex |
| 2026-05-04 | Expo Router 앱 번들에서 테스트 파일이 제외되도록 route unit test 위치를 `src/route-tests`로 이동 | codex |
| 2026-05-04 | Expo Router route tree 경고 제거를 위해 non-route auth 유틸/스토어를 `src/auth`로 이동 | codex |
| 2026-05-04 | 초기 인증 선확인 후 홈/로그인 선라우팅, 화면 layout 이후 splash hide 정책 반영 | codex |
| 2026-05-04 | 외부 브라우저 실행을 제거하고 WebView 기반 idp/web 로그인 + callback scheme interception으로 변경 | codex |
| 2026-05-04 | Android WebView에서 IDP localhost 리다이렉트를 에뮬레이터 host로 보정하는 계약 추가 | codex |
| 2026-05-04 | callback 성공 후 native 세션 검증으로 인증 store를 갱신해 로그인 루프를 방지하는 계약 추가 | codex |
| 2026-05-04 | 홈 화면 세션 상태 표시와 로그아웃 버튼 계약 추가 | codex |
| 2026-05-05 | 모바일 로그인/콜백 화면에서 내부 경로 노출 제거 및 오노라 예약 플랫폼 사용자 문구 계약 추가 | codex |
