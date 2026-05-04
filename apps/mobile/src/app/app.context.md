# mobile app 기획서

> 생성일: 2026-04-14
> 타입: app
> 위치: apps/mobile/src/app//app.context.md

## 역할

모바일 앱 route/app 수준의 계약과 테스트 ownership 을 정의합니다.

## route 계약

| route | owner spec | 설명 |
|------|------------|------|
| `/` | `apps/mobile/src/app/index.spec.md` | wrapper inventory home |
| `/_layout` | `apps/mobile/src/app/_layout.tsx` | Expo Router root shell |
| `/auth/login` | `apps/mobile/src/app/index.spec.md` | `idp/web` 로그인 진입 라우트 |
| `/auth/callback` | `apps/mobile/src/app/index.spec.md` | OIDC 콜백 처리 라우트 |
| `/dashboard` | `apps/mobile/src/app/index.spec.md` | 인증 필수 진입 라우트 |

## 테스트 전략

- route unit test 는 Expo Router runtime bundle 에 포함되지 않도록 `apps/mobile/src/route-tests/**/*.test.tsx` 를 owner file 로 사용합니다.
- 인증 유틸/스토어/Gate 는 Expo Router route tree 에 포함되지 않도록 `apps/mobile/src/auth/**` 에 둡니다.
- app launch E2E 는 `apps/mobile/e2e/**/*.e2e.js` 를 owner file 로 사용합니다.
- Stage 1 에서 test case 를 spec 에 기록하고, Stage 2/3/4 에서 구현/실행 상태를 동기화합니다.

### 자동 검증

- `pnpm --filter @cocrepo/mo-ui test`
- `pnpm --filter @cocrepo/mo-ui type-check`
- `pnpm --filter mobile-app test`
- `pnpm --filter mobile-app type-check`
- `pnpm --filter mobile-app test:e2e`
- `pnpm --filter mobile-app doctor`

### E2E 시나리오

| ID | 대상 | 설명 |
|----|------|------|
| `MO-E2E-001` | `/` | 앱 launch 후 인벤토리 홈 제목과 Button Showcase 섹션이 보여야 합니다. |
| `MO-E2E-002` | `/auth/login` | 로그인 라우트에서 외부 브라우저 없이 WebView가 idp/web URL을 로드하고 callback scheme을 앱 내부로 전달해야 합니다. |
| `MO-E2E-003` | `/auth/callback` | callback 처리 후 세션 검증 통과 시 `next` 경로로 라우트해야 합니다. |
| `MO-E2E-004` | `/dashboard` | 비인증 접근은 `/auth/login`로 `next=/dashboard`를 보존해 이동해야 합니다. |

## auth session 체크

- `AuthSessionGate`는 callback route를 제외한 초기 route 렌더 전에 `mobileAuthStore.verifySession()` 기반 상태 정합성을 먼저 수행한다.
- 인증 상태면 홈(`/`)으로, 비인증 상태면 `/auth/login`으로 route를 먼저 보낸다.
- 목표 route 화면의 layout이 확인된 뒤에만 `SplashScreen.hideAsync()`로 native splash view를 끈다.
- `/auth/login`은 Chrome/Safari를 열지 않고 앱 내 WebView로 idp/web 로그인 URL을 로드한다.
- Android 에뮬레이터 WebView는 IDP가 반환한 `localhost` 절대 리다이렉트를 `10.0.2.2`로 보정해 host 머신의 idp-api/idp-web dev 서버를 계속 바라본다.
- WebView에서 `prjcore://auth/callback` navigation이 발생하면 이를 가로채 `/auth/callback` route로 전달한다.
- `/auth/callback`은 에러 파라미터나 콜백 교환 실패 시 재시도 가능한 실패 상태를 표시한다.
- 성공 callback은 `mobileAuthStore.verifySession()`으로 native API client의 쿠키 기반 세션을 검증하고, store 인증 상태가 `authenticated`로 갱신된 뒤에만 deep-link 대상을 라우팅한다.
- 인증된 홈(`/`) 화면과 대시보드(`/dashboard`)는 `mobileAuthStore.logout()` 기반 로그아웃 버튼을 제공하고, 완료 후 `/auth/login`으로 이동한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 app 수준 route/test ownership 과 Detox smoke 시나리오를 추가 | codex |
| 2026-05-04 | Stage 3 대상 auth 라우트(`login/callback/dashboard`) + `index.spec.md` 정렬 및 세션 체크 항목 동기화 | codex |
| 2026-05-04 | Expo Router runtime bundle 보호를 위해 route unit test 와 non-route auth 모듈 위치를 `src/app` 밖으로 정리 | codex |
| 2026-05-04 | 초기 인증 선확인, 홈/로그인 선라우팅, 화면 layout 이후 splash hide 정책 추가 | codex |
| 2026-05-04 | 외부 브라우저 대신 WebView 기반 idp/web 로그인 정책 추가 | codex |
| 2026-05-04 | Android 에뮬레이터 WebView의 IDP localhost 리다이렉트 보정 정책 추가 | codex |
| 2026-05-04 | callback 성공 후 native verify-token 검증을 통과해야 홈으로 이동하도록 세션 갱신 정책 추가 | codex |
| 2026-05-04 | 홈/대시보드 로그아웃 버튼 정책 추가 | codex |
