# MyPageScreen 계약서

## 대상

- `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx`

## 목적

모바일 `/profile` 하단 탭의 마이 페이지 visual composition을 소유한다. route file은 인증 상태, 현재 지점, 로그아웃, navigation wiring만 담당하고 screen에는 표시 props와 handler를 전달한다.

## Props 계약

| prop | type | 소스 담당 | 사용 영역 |
|------|------|-----------|-----------|
| `displayName` | `string` | route가 auth/session store에서 조립, 없으면 `"회원"` fallback | `A AccountSummary` |
| `accountDescription` | `string` | route literal 또는 store-derived copy | `A AccountSummary` |
| `isAuthenticated` | `boolean` | `mobileAuthStore.isAuthenticated` | `A AccountSummary` badge |
| `isLogoutPending` | `boolean` | route-local logout pending state 또는 `mobileAuthStore.isVerifying` | `D LogoutAction` disabled/loading |
| `currentSpaceName` | `string` | `mobileApiScopeStore.groundName`, 없으면 `"지점 선택 필요"` | `B CurrentSpace` |
| `quickActions` | `QuickActionListItem[]` | route가 navigation handler와 함께 생성 | `C QuickActionList` |
| `onPressLogout` | `() => void` | route logout handler | `D LogoutAction` |

`QuickActionListItem`: `id`, `label`, `description`, `iconName: MobileIconName`, `disabled?`, `onPress?`. 타입 source는 `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx`가 소유하고 `MyPageScreen`은 이를 소비한다.

## 화면 러프

```text
Visual Snapshot
┌─ 마이 · 광화문 스튜디오 ───────────────────────┐
│ ┌──────────────────────────────────────────┐ │
│ │ ◯  회원                         로그인됨 │ │
│ │    오노라 예약 알림과 계정 상태 관리       │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ 현재 지점                                │ │
│ │ 광화문 스튜디오                          │ │
│ └──────────────────────────────────────────┘ │
│ 빠른 이동                                   │
│ ┌──────────────────────────────────────────┐ │
│ │ 내 예약                              ›   │ │
│ │ 예약 확정과 대기 상태 확인                │ │
│ │ 결제/수강권                         ›   │ │
│ │ 알림/설정                           ›   │ │
│ └──────────────────────────────────────────┘ │
│ [ 로그아웃 ]                                │
└──────────────────────────────────────────────┘

Annotated Wireframe
Visual tone: bg-background, px-4, pt-4, gap-4, rounded-lg, border-border, bg-surface
[route/layout] CustomHeader title="마이" subtitle=currentSpaceName

┌─ MyPageScreen / ScreenFrame ─────────────────────┐
│ ┌ A AccountSummaryCard bg-surface p-4 ─────────┐ │
│ │  ◯ Icon(userRound, accent-soft)              │ │
│ │  회원                         [로그인됨]     │ │
│ │  오노라 예약 알림과 계정 상태 관리            │ │
│ └──────────────────────────────────────────────┘ │
│ ┌ B CurrentSpaceCard bg-surface p-4 ───────────┐ │
│ │  Icon(mapPin)  현재 지점                      │ │
│ │              광화문 스튜디오                  │ │
│ └──────────────────────────────────────────────┘ │
│ 빠른 이동  text-sm/extrabold                    │
│ ┌ C QuickActionList / ListGroup bg-surface ────┐ │
│ │  Icon(calendarCheck) 내 예약         ›        │ │
│ │    예약 확정과 대기 상태 확인                 │ │
│ │  Icon(ticketCheck)   결제/수강권     › muted  │ │
│ │    준비 중인 결제 내역 영역                   │ │
│ │  Icon(info)          알림/설정       › muted  │ │
│ │    예약 알림과 앱 설정 관리                   │ │
│ └──────────────────────────────────────────────┘ │
│ [ D Button variant=danger full-width 로그아웃 ] │
└──────────────────────────────────────────────────┘

Legend: A/B=screen-local DataDisplay sections, C=reusable Widget owned by `fe-mo-widget-builder`, D=reused Action Button.
Tokens: title text-xl/extrabold, card text-base+text-[13px], status chip success-soft, disabled rows muted.
```

## 렌더링 계약

| 영역 | 컴포넌트 | 계층 | 재사용/신규 | 소스/대상 | Props/이벤트 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` |
|------|-----------|------|-------------|-----------|--------------|-------------------------|---------------------------|
| route header | `CustomHeader` | Navigation/Layout | reuse | `packages/fe-mo-ui/src/navigation/CustomHeader` via `(tabs)/_layout.tsx` | title `"마이"`, subtitle `currentSpaceName` | `fe-mo-navigation-builder` | `fe-mo-route-layout-builder` |
| screen shell | `MyPageScreen` | Screen | new | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx` | all props above | `fe-mo-screen-builder` | `fe-mo-route-builder` |
| screen shell | `ScreenFrame` | Layout | reuse | `packages/fe-mo-ui/src/layout/ScreenFrame` | body safe-area, scroll content | `fe-mo-data-display-builder` | `fe-mo-screen-builder` |
| A/B | `Card` | Layout | reuse | `packages/fe-mo-ui/src/layout/Card` | `bg-surface`, `border-border`, `rounded-lg`, `p-4` | `fe-mo-data-display-builder` | `fe-mo-screen-builder` |
| A | `AccountSummary` section | DataDisplay / screen-local | new | `MyPageScreen.tsx` internal section, no package export | `displayName`, `accountDescription`, `isAuthenticated` | `fe-mo-screen-builder` | `fe-mo-screen-builder` |
| A | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | `userRound` | none | `fe-mo-screen-builder` |
| A | `Chip` | DataDisplay | reuse | `packages/fe-mo-ui/src/data-display/Chip` | status label | `fe-mo-data-display-builder` | `fe-mo-screen-builder` |
| B | `CurrentSpace` section | DataDisplay / screen-local | new | `MyPageScreen.tsx` internal section, no package export | `currentSpaceName` | `fe-mo-screen-builder` | `fe-mo-screen-builder` |
| B | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | `mapPin` | none | `fe-mo-screen-builder` |
| C | `QuickActionList` | Widget | new | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx` | `items: QuickActionListItem[]` | `fe-mo-widget-builder` | `fe-mo-screen-builder` |
| C | `ListGroup` | Layout | reuse | `packages/fe-mo-ui/src/layout/ListGroup` | rows, suffix chevron | `fe-mo-data-display-builder` | `fe-mo-widget-builder` |
| C | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | action row icons | none | `fe-mo-widget-builder` |
| D | `Button` | Action | reuse | `packages/fe-mo-ui/src/action/Button` | `onPressLogout`, `isLogoutPending` | `fe-mo-action-builder` | `fe-mo-screen-builder` |
| D | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | `logOut` | none | `fe-mo-screen-builder` |
| none | Input component | Input | none | no text input in this screen | none | none | none |
| none | Feature package component | Feature | none | no cross-screen interaction feature in this route | route injects props directly | none | none |

## Storybook / Test Contract

### Storybook 인벤토리

| 대상 | Story 파일 | 필수 상태/Variant | Fixture/데이터 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
|------|------------|-------------------|----------------|-------------------------|-------------------------|------|
| `QuickActionList` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.stories.tsx` | ready, disabled row, long label | 예약/결제/알림 quick action items | `fe-mo-widget-builder` | `qa-mo-testing` | screen이 소비하는 Widget story |
| `MyPageScreen` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.stories.tsx` | authenticated ready, no current space, logout pending, long display name | auth/current-space props, `QuickActionListItem[]` | `fe-mo-screen-builder` | `qa-mo-testing` | screen visual owner story |

### Unit Test 인벤토리

| 대상 | Test 파일 | 검증 관점 | 주요 케이스 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
|------|-----------|-----------|-------------|-------------------------|-------------------------|------|
| `QuickActionList` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.test.tsx` | row rendering, press event, disabled guard | enabled row press, disabled row no-op, long label rendering | `fe-mo-widget-builder` | `qa-mo-testing` | Widget builder가 component와 함께 작성 |
| `MyPageScreen` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.test.tsx` | props rendering, quick action composition, logout event | account summary, current space, quick actions, logout pending | `fe-mo-screen-builder` | `qa-mo-testing` | Screen builder가 screen과 함께 작성 |

Rendering rules:

- 스타일은 `StyleSheet`/`StyleSheet.create` 없이 uniwind `className`과 `tailwind-variants` slot/variant로 정의한다.
- render tree는 JSX로 작성하고 `React.createElement` 기반 visual composition을 사용하지 않는다.
- screen은 API hook, router, route params, app alias, backend DTO를 직접 import하지 않는다.
- disabled quick action은 muted 처리하고 press handler를 호출하지 않는다.
- 텍스트는 작은 모바일 화면에서 줄바꿈 가능해야 하며 버튼/row 안에서 overflow 되지 않아야 한다.

## Backend / API 계약

### 엔드포인트 인벤토리

| 필요 | Method/Path | operationId | Controller | DTO/Schema | 재사용/신규 | 소스/대상 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` | codegen |
|------|-------------|-------------|------------|------------|-------------|-----------|-------------------------|---------------------------|---------|
| account summary read | none | none | none | none | none | no backend change, route uses existing auth/session store fallback | none | none | none |
| current space read | none | none | none | none | none | no backend change, route uses existing `mobileApiScopeStore.groundName` | none | none | none |
| logout | `POST /api/v1/auth/native/logout` | `nativeLogout` | existing `AuthController.nativeLogout` | existing `NativeLogoutPayloadDto` | reuse | `apps/idp/api/src/module/auth/auth.controller.ts`, `packages/be-dto/src/auth/native-auth.dto.ts` | `be-controller-builder`, `be-dto-builder` | `fe-mo-route-builder` | existing `requestNativeLogout`, no codegen |
| quick action navigation | none | none | none | none | none | route-only navigation to existing/future routes | none | `fe-mo-route-builder` | none |

### ApplicationService 인벤토리

| 유즈케이스/워크플로 | ApplicationService | 메서드 | 재사용/신규 | 소스/대상 | 의존 요소 | 소스 담당 `agent_type` | 소비 `agent_type` |
|---------------------|--------------------|--------|-------------|-----------|-----------|-------------------------|---------------------|
| native mobile logout | `AuthApplicationService` | `logoutNativeMobileSession` | reuse | `packages/be-app/src/auth.application-service.ts` | `TokenStorageService` | `be-app-builder` | `be-controller-builder` |
| account summary/current space | none | none | none | no backend change | route uses existing mobile stores | none | none |

### Service 인벤토리

| 도메인 기능 | Service | 메서드 | 재사용/신규 | 소스/대상 | 의존 요소 | 소스 담당 `agent_type` | 소비 `agent_type` |
|-------------|---------|--------|-------------|-----------|-----------|-------------------------|---------------------|
| native token/session cleanup | `TokenStorageService` | blacklist/delete native session methods used by `logoutNativeMobileSession` | reuse | `packages/be-service/src/token-storage.service.ts` | Redis-backed token/session storage | `be-service-builder` | `be-app-builder` |
| profile read | none | none | none | no backend change | route uses existing auth/session/current-space state | none | none |

### Repository 인벤토리

| 영속성 필요 | Repository | 모델/Aggregate | 메서드 | 재사용/신규 | 소스/대상 | 소스 담당 `agent_type` | 소비 `agent_type` |
|-------------|------------|----------------|--------|-------------|-----------|-------------------------|---------------------|
| profile route backend persistence | none | none | none | none | no repository change for this delivery | none | none |

## Route Boundary

| route responsibility | allowed source | output to screen |
|----------------------|----------------|------------------|
| auth/session state | `mobileAuthStore` | `isAuthenticated`, `isLogoutPending`, `displayName` fallback |
| current space state | `mobileApiScopeStore` | `currentSpaceName` |
| quick action navigation | `useRouter` | `quickActions[].onPress` |
| logout flow | `mobileAuthStore.logout()` + `router.replace("/auth/login")` | `onPressLogout` |

route-local UI가 필요해도 raw `View`/`Text` 조합을 직접 늘리지 않고 screen props를 보강한다.

## Test Contract

| ID | owner | 검증 |
|----|-------|------|
| `MO-UNIT-QUICK-ACTION-LIST-001` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.test.tsx` | quick action row 렌더링, enabled press, disabled press guard |
| `MO-UNIT-MY-PAGE-SCREEN-001` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.test.tsx` | display name, session badge, current space, quick actions, logout button 렌더링 |
| `MO-UNIT-MY-PAGE-SCREEN-002` | same | disabled quick action은 press handler를 호출하지 않음 |
| `MO-UNIT-MY-PAGE-ROUTE-001` | mobile route test | `/profile` route가 `mobileAuthStore.logout()` 후 `/auth/login`으로 이동 |

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|-----------|--------|
| 2026-05-24 | Storybook/Test 계약을 추가하고 builder 작성 책임을 명시 | orch-delivery |
| 2026-05-24 | 기획 표 헤더를 한글 우선으로 변경 | orch-delivery |
| 2026-05-24 | Backend/API 계약을 endpoint/application/service/repository inventory로 분리 | orch-delivery |
| 2026-05-24 | `QuickActionList`를 screen-local 조합에서 mobile Widget 산출물로 분리하도록 계약 수정 | orch-delivery |
| 2026-05-24 | 화면 러프와 렌더링/API 계약을 component inventory 중심으로 보강 | orch-delivery |
| 2026-05-24 | 모바일 하단 탭 마이 페이지 shared screen 계약 신규 작성 | orch-delivery |
