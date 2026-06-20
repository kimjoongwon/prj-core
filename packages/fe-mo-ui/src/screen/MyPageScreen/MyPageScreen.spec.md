# MyPageScreen 계약서

## 대상

- `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx`

## 목적

모바일 `/profile` 하단 탭의 마이 페이지 visual composition을 소유한다. route file은 인증 상태, 현재 지점, 로그아웃, navigation wiring만 담당하고 screen에는 표시 props와 handler를 전달한다.

루트 `DESIGN.md`의 따뜻한 예약 운영 플랫폼 원칙을 따른다. 색상은 외부 palette나 임의 hex가 아니라 기존 mobile theme 역할(`background`, `surface`, `foreground`, `muted`, `success`, `danger`, `border`)로 표현하고, 상태와 다음 행동을 가장 먼저 읽히게 한다.

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

## Design Alignment

| 항목 | 기준 |
|------|------|
| 제품 인상 | 따뜻한 예약 운영 플랫폼. 계정 상태, 현재 지점, 다음 이동을 차분하게 안내한다. |
| 플랫폼 기준 | Mobile 우선. safe area, 44px 이상 touch target, 하단 탭과 로그아웃 버튼 겹침 방지. |
| 상태와 다음 행동 | `A AccountSummary`에서 로그인 상태를 먼저 보여주고, `C QuickActionList`에서 예약/결제/설정 이동을 바로 제공한다. |
| 색상 역할 | `background`, `surface`, `foreground`, `muted`, `success`, `danger`, `border` 역할만 사용한다. 임의 hex와 외부 브랜드 색상은 사용하지 않는다. |
| 타이포그래피 | 화면 제목은 route header가 소유하고, screen 내부는 section title/body/caption 역할로 간결하게 구성한다. |
| 표면/형태 | summary/current-space/action-list는 부드러운 `surface` card/list group으로 묶고, 로그아웃은 danger action으로 분리한다. |
| 큰 섹션 | 마이 페이지는 큰 hero가 아니라 상태 요약 + 다음 행동 리스트 중심의 compact service screen으로 유지한다. |

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
Visual tone: background canvas, surface cards, subtle border, medium radius, warm service density
[route/layout] CustomHeader title="마이" subtitle=currentSpaceName

┌─ MyPageScreen / ScreenFrame ─────────────────────┐
│ ┌ A AccountSummaryCard surface p-4 ───────────┐ │
│ │  ◯ Icon(userRound)     회원      [로그인됨]  │ │
│ │  오노라 예약 알림과 계정 상태 관리            │ │
│ └──────────────────────────────────────────────┘ │
│ ┌ B CurrentSpaceCard surface p-4 ─────────────┐ │
│ │  Icon(mapPin)  현재 지점                      │ │
│ │              광화문 스튜디오                  │ │
│ └──────────────────────────────────────────────┘ │
│ 빠른 이동  section label                        │
│ ┌ C QuickActionList / ListGroup surface ──────┐ │
│ │  Icon(calendarCheck) 내 예약         ›        │ │
│ │    예약 확정과 대기 상태 확인                 │ │
│ │  Icon(ticketCheck)   결제/수강권     › muted  │ │
│ │    준비 중인 결제 내역 영역                   │ │
│ │  Icon(info)          알림/설정       › muted  │ │
│ │    예약 알림과 앱 설정 관리                   │ │
│ └──────────────────────────────────────────────┘ │
│ [ D Button variant=danger full-width 로그아웃 ] │
└──────────────────────────────────────────────────┘

Legend: A/B=screen-local DataDisplay sections, C=reusable Widget owned by `fe-widget-agent`, D=reused Action Button.
Rhythm: root `VStack` vertical gap=section, card inner `VStack` gap=block, horizontal rows `HStack` gap=inline, row meta gap=dense, action list rows gap=flush, logout margin uses section rhythm.
```

## Rhythm / Layout Contract

| 영역 | 리듬 컴포넌트 | 방향/정렬 | gap preset | 감싸는 대상 | 재사용/신규 | 소스/대상 | 담당 `agent_type` | 비고 |
|------|---------------|-----------|------------|-------------|-------------|-----------|-------------------|------|
| root content | `VStack` | vertical / stretch | `section` | A AccountSummary, B CurrentSpace, C QuickActionList, D LogoutAction | reuse | `packages/fe-mo-ui/src/rhythm/VStack` | `fe-screen-agent` | screen body의 기본 세로 rhythm owner |
| A AccountSummary | `VStack` + `HStack` | vertical + top row horizontal | `block`, `inline` | icon/name/status/description | reuse | `packages/fe-mo-ui/src/rhythm` | `fe-screen-agent` | 상태 badge는 제목 row 오른쪽에 배치 |
| B CurrentSpace | `HStack` + `VStack` | horizontal icon + vertical copy | `inline`, `dense` | map icon, label, currentSpaceName | reuse | `packages/fe-mo-ui/src/rhythm` | `fe-screen-agent` | 지점명이 길면 2줄까지 자연스럽게 줄바꿈 |
| C QuickActionList | `VStack` + row `HStack` + `ListGroup` | vertical list / row horizontal | `flush`, row `inline`, meta `dense` | quick action rows | new + reuse | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx` | `fe-widget-agent` | row touch target은 44px 이상 |
| D LogoutAction | `VStack` | vertical / stretch | `section` | danger full-width button | reuse | `packages/fe-mo-ui/src/rhythm/VStack`, `Button` | `fe-screen-agent` | bottom tab/safe area와 겹치지 않게 ScreenFrame content padding 고려 |
| route header | `CustomHeader` | route layout owned | n/a | title/subtitle | reuse | `(tabs)/_layout.tsx` | `fe-route-layout-agent` | screen 내부에서 title을 중복 렌더링하지 않음 |

## 렌더링 계약

| 영역 | 컴포넌트 | 계층 | 재사용/신규 | 소스/대상 | Props/이벤트 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` |
|------|-----------|------|-------------|-----------|--------------|-------------------------|---------------------------|
| route header | `CustomHeader` | Navigation/Layout | reuse | `packages/fe-mo-ui/src/navigation/CustomHeader` via `(tabs)/_layout.tsx` | title `"마이"`, subtitle `currentSpaceName` | `fe-navigation-agent` | `fe-route-layout-agent` |
| screen shell | `MyPageScreen` | Screen | new | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.tsx` | all props above | `fe-screen-agent` | `fe-route-agent` |
| screen shell | `ScreenFrame` | Layout | reuse | `packages/fe-mo-ui/src/layout/ScreenFrame` | body safe-area, scroll content | `fe-layout-agent` | `fe-screen-agent` |
| A/B | `Card` | Layout | reuse | `packages/fe-mo-ui/src/layout/Card` | `bg-surface`, `border-border`, `rounded-lg`, `p-4` | `fe-layout-agent` | `fe-screen-agent` |
| A | `AccountSummary` section | DataDisplay / screen-local | new | `MyPageScreen.tsx` internal section, no package export | `displayName`, `accountDescription`, `isAuthenticated` | `fe-screen-agent` | `fe-screen-agent` |
| A | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | `userRound` | none | `fe-screen-agent` |
| A | `Chip` | DataDisplay | reuse | `packages/fe-mo-ui/src/data-display/Chip` | status label | `fe-data-display-agent` | `fe-screen-agent` |
| B | `CurrentSpace` section | DataDisplay / screen-local | new | `MyPageScreen.tsx` internal section, no package export | `currentSpaceName` | `fe-screen-agent` | `fe-screen-agent` |
| B | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | `mapPin` | none | `fe-screen-agent` |
| C | `QuickActionList` | Widget | new | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.tsx` | `items: QuickActionListItem[]` | `fe-widget-agent` | `fe-screen-agent` |
| C | `ListGroup` | Layout | reuse | `packages/fe-mo-ui/src/layout/ListGroup` | rows, suffix chevron | `fe-layout-agent` | `fe-widget-agent` |
| C | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | action row icons | none | `fe-widget-agent` |
| D | `Button` | Action | reuse | `packages/fe-mo-ui/src/action/Button` | `onPressLogout`, `isLogoutPending` | `fe-action-agent` | `fe-screen-agent` |
| D | `Icon` | Icon | reuse | `packages/fe-mo-ui/src/icon/Icon` | `logOut` | none | `fe-screen-agent` |
| none | Input component | Input | none | no text input in this screen | none | none | none |
| none | Feature package component | Feature | none | no cross-screen interaction feature in this route | route injects props directly | none | none |

## Storybook / Test Contract

### Storybook 인벤토리

| 대상 | Story 파일 | 필수 상태/Variant | Fixture/데이터 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
|------|------------|-------------------|----------------|-------------------------|-------------------------|------|
| `QuickActionList` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.stories.tsx` | ready, disabled row, long label | 예약/결제/알림 quick action items | `fe-widget-agent` | `fe-widget-agent` | screen이 소비하는 Widget story |
| `MyPageScreen` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.stories.tsx` | authenticated ready, no current space, logout pending, long display name | auth/current-space props, `QuickActionListItem[]` | `fe-screen-agent` | `fe-screen-agent` | screen visual owner story |

### Unit Test 인벤토리

| 대상 | Test 파일 | 검증 관점 | 주요 케이스 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 비고 |
|------|-----------|-----------|-------------|-------------------------|-------------------------|------|
| `QuickActionList` | `packages/fe-mo-ui/src/widget/QuickActionList/QuickActionList.test.tsx` | row rendering, press event, disabled guard | enabled row press, disabled row no-op, long label rendering | `fe-widget-agent` | `fe-widget-agent` | Widget builder가 component와 함께 작성 |
| `MyPageScreen` | `packages/fe-mo-ui/src/screen/MyPageScreen/MyPageScreen.test.tsx` | props rendering, quick action composition, logout event | account summary, current space, quick actions, logout pending | `fe-screen-agent` | `fe-screen-agent` | Screen builder가 screen과 함께 작성 |

Rendering rules:

- 스타일은 `StyleSheet`/`StyleSheet.create` 없이 uniwind `className`과 `tailwind-variants` slot/variant로 정의한다.
- layout rhythm은 raw `gap-*` class를 흩뿌리지 않고 `tailwind-variants` slot 이름과 semantic rhythm 의도를 함께 드러낸다.
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
| logout | `POST /api/v1/auth/native/logout` | `nativeLogout` | existing `AuthController.nativeLogout` | existing `NativeLogoutPayloadDto` | reuse | `packages/be-controller/src/auth/auth.controller.ts`, `packages/be-dto/src/auth/native-auth.dto.ts` | `be-controller-builder`, `be-dto-builder` | `fe-route-agent` | existing `requestNativeLogout`, no codegen |
| quick action navigation | none | none | none | none | none | route-only navigation to existing/future routes | none | `fe-route-agent` | none |

### UseCase 인벤토리

| 유즈케이스/워크플로 | UseCase | Command/Query | 재사용/신규 | 소스/대상 | 의존 요소 | 소스 담당 `agent_type` | 소비 `agent_type` |
|---------------------|---------|---------------|-------------|-----------|-----------|-------------------------|---------------------|
| native mobile logout | `LogoutNativeMobileSessionUseCase` | `LogoutNativeMobileSessionCommand` | reuse | `packages/be-usecase/src/auth/logout-native-mobile-session.usecase.ts` | `TokenStorageService` | `be-usecase-builder` | `be-controller-builder` |
| account summary/current space | none | none | none | no backend change | route uses existing mobile stores | none | none |

### Service 인벤토리

| 도메인 기능 | Service | 메서드 | 재사용/신규 | 소스/대상 | 의존 요소 | 소스 담당 `agent_type` | 소비 `agent_type` |
|-------------|---------|--------|-------------|-----------|-----------|-------------------------|---------------------|
| native token/session cleanup | `TokenStorageService` | blacklist/delete native session methods used by `LogoutNativeMobileSessionUseCase` | reuse | `packages/be-service/src/auth/token-storage.service.ts` | Redis-backed token/session storage | `be-service-builder` | `be-usecase-builder` |
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