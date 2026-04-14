# StorybookRuntimeProvider.tsx Spec

## 목적
- Storybook 안에서만 동작하는 로컬 runtime/provider 계층을 제공합니다.
- `next/navigation` 없이도 QueryClient, RootStore, PersistStore, admin/idp bootstrap을 Storybook preview에 주입합니다.

## 핵심 동작
- 모든 스토리는 `QueryClientProvider`, `NuqsReactAdapter`, `RootStoreContext`, `DesignSystemProvider` 안에서 렌더링됩니다.
- `parameters.storybookRuntime = { realm, requiresSpace, currentPath, spaceId }`로 `admin | idp | none` 런타임을 결정합니다.
- `admin` realm에서는 `/api/v1/auth/verify-token`, `/api/v1/auth/my-spaces`, `/api/v1/abilities/my`를 사용해 토큰 만료 시간, 선택 가능한 Space 목록, Ability 규칙을 Storybook 전용 store에 반영합니다.
- admin realm은 첫 accessible space 또는 `spaceId` override를 자동 선택하고, preview 상단에서 Space를 바꿀 수 있습니다.
- `idp` realm에서는 IDP 콘솔에 맞는 navigation/persist store만 부트스트랩하고 권한은 fallback `manage all` 규칙으로 유지합니다.
- `none` realm은 인증 셸은 유지하되 API bootstrap은 건너뛰고 기본 admin-style store만 제공합니다.
- shared axios 인터셉터가 401을 만났을 때도 Storybook 로그인 셸로 복귀하도록 `setLoginRedirectUrl`, `setIdpLoginRedirectUrl`, `setApiPersistStore`, `setIdpPersistStore`를 Storybook store 기준으로 설정합니다.
- 세션 검사가 실패하거나 만료되면 iframe이 아니라 top-level Storybook 전체를 `/__storybook_auth/login`으로 보내 manager/preview를 함께 잠급니다.
- 정적 Storybook/Chromatic 환경에서는 실 API 호출 대신 fallback ability와 placeholder space를 사용해 auth-required story도 렌더링을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Storybook admin runtime의 current space terminology를 `PersistStore.spaceId`/`x-space-id` 기준으로 정리 | codex |
| 2026-03-23 | nuqs Adapter를 @cocrepo/hook/nuqs 브리지로 교체해 workspace 전역 인스턴스를 공유 | codex |
| 2026-03-16 | workspace export import와 auth-flag 기반 runtime gating으로 Storybook 타입 안정성을 보강 | codex |
| 2026-03-16 | story parameter 기반 realm/space bootstrap과 정적 빌드 fallback runtime 동작을 반영 | codex |
| 2026-03-16 | Storybook 전용 QueryClient/RootStore/provider/bootstrap 계층 및 auth-aware runtime resolver 신규 추가 | codex |
