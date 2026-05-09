# Mobile Agent Index

이 문서는 `.codex/agents/mobile/*.toml`의 모바일 role 인덱스입니다.

원문 우선순위:

1. [.codex/config.toml](../../config.toml)
2. 각 `mobile/*.toml`
3. 이 인덱스

운영 원칙:

- 모바일 role은 iOS/Android React Native + Expo Native 전용 contract입니다.
- Expo Web, react-native-web, browser DOM 타깃은 모바일 role의 지원 범위가 아닙니다.
- 웹용 `fe-*`, `orch-*`, `req-*` role과 분리됩니다.
- 모바일 orchestration 은 mobile route flow 에 공통 backend contract planning 을 포함한 compact 4-stage flow 기준입니다.
- 모바일 검증은 Jest unit test 와 Detox E2E, `qa-mo-*` role 기준으로 정리합니다.
- 모바일 UI 스타일링은 uniwind `className` 계열 prop과 `tailwind-variants`의 `tv({ slots, variants })`를 기본으로 하며, `StyleSheet`/`StyleSheet.create`를 새로 만들지 않습니다.
- `style` 객체는 safe-area inset, navigator option object, third-party native bridge 값처럼 className으로 표현하기 어려운 동적 값에만 제한합니다.
- 전역 sidecar spec 정책상 모바일 route/native wiring 계약은 `apps/mobile/src/app/**/index.spec.md`가 소유합니다.
- 모바일 shared screen visual composition 계약은 `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md`가 소유합니다.
- 테스트 sidecar와 모바일 UI leaf/action 조합 계층(action/input/selection/navigation/data-display/feedback/layout/surface/design-system/widget/feature/form/detail) sidecar는 만들지 않습니다.
- mobile child role은 peer role을 직접 호출하지 않고, 모든 finding을 `Feedback:` packet으로 `orch-mobile-stage` 또는 `orch-mobile-screen-planner`에 반환합니다.
- mobile orchestrator는 packet을 기준으로 `send_input` follow-up, route/screen re-entry, backend handoff, blocked/review pending 중 하나로 재배치합니다.
- packet이 누락되면 같은 agent에 1회 보완 요청하고, 두 번째에도 없으면 `dependency-missing` 또는 `implementation-blocker`로 차단합니다.

## Orchestration

- [orch-mobile-stage.toml](./orch-mobile-stage.toml): 모바일 route flow 와 common backend contract planning 을 함께 조율하는 메타 role
- [orch-mobile-screen-planner.toml](./orch-mobile-screen-planner.toml): 단일 Expo Router native route 의 모바일 화면 기획을 조율하는 오케스트레이터

## Planner

- [req-mo-route-layout-planner.toml](./req-mo-route-layout-planner.toml): Expo Router native `_layout` shell 계약을 기획하는 전문가
- [req-mo-page-planner.toml](./req-mo-page-planner.toml): Expo Router native screen 계약을 상세 기획하는 전문가
- [req-mo-primitive-planner.toml](./req-mo-primitive-planner.toml): 모바일 data-display/feedback/surface/provider primitive 계약을 기획하는 전문가
- [req-mo-action-planner.toml](./req-mo-action-planner.toml): 모바일 command/action 컴포넌트 계약을 기획하는 전문가
- [req-mo-input-planner.toml](./req-mo-input-planner.toml): 모바일 text/input 컴포넌트 계약을 기획하는 전문가
- [req-mo-selection-planner.toml](./req-mo-selection-planner.toml): 모바일 selection/stateful choice 컴포넌트 계약을 기획하는 전문가
- [req-mo-navigation-planner.toml](./req-mo-navigation-planner.toml): 모바일 navigation control 컴포넌트 계약을 기획하는 전문가
- [req-mo-menu-planner.toml](./req-mo-menu-planner.toml): 모바일 navigation/menu contract 를 기획하는 전문가
- [req-mo-widget-planner.toml](./req-mo-widget-planner.toml): 모바일 순수 UI 조합 Widget 계약을 기획하는 전문가
- [req-mo-feature-planner.toml](./req-mo-feature-planner.toml): 모바일 reusable Feature composition 계약을 기획하는 전문가
- [req-mo-form-planner.toml](./req-mo-form-planner.toml): 모바일 입력 form 계약을 기획하는 전문가
- [req-mo-detail-planner.toml](./req-mo-detail-planner.toml): 모바일 읽기 전용 detail/view 계약을 기획하는 전문가
- [req-mo-api-integration-planner.toml](./req-mo-api-integration-planner.toml): 모바일 API 연동 계약을 기획하는 전문가
- [req-mo-store-planner.toml](./req-mo-store-planner.toml): 모바일 공용/로컬 상태 경계를 기획하는 전문가
- [req-mo-state-planner.toml](./req-mo-state-planner.toml): 모바일 route-local 상태와 shared Store 승격 경계를 기획하는 전문가
- [req-mo-fe-test-planner.toml](./req-mo-fe-test-planner.toml): 모바일 route `index.spec.md`와 `app.context.md`의 unit/E2E 테스트 케이스를 기획하는 전문가

## Active Builder

- [fe-mo-action-component-builder.toml](./fe-mo-action-component-builder.toml): `packages/fe-mo-ui/src/action/**`의 RN command/action contract를 생성하거나 정리하는 전문가
- [fe-mo-input-component-builder.toml](./fe-mo-input-component-builder.toml): `packages/fe-mo-ui/src/input/**`의 RN text/input contract를 생성하거나 정리하는 전문가
- [fe-mo-selection-component-builder.toml](./fe-mo-selection-component-builder.toml): `packages/fe-mo-ui/src/selection/**`의 RN selection/stateful choice contract를 생성하거나 정리하는 전문가
- [fe-mo-navigation-component-builder.toml](./fe-mo-navigation-component-builder.toml): `packages/fe-mo-ui/src/navigation/**`의 RN navigation control contract를 생성하거나 정리하는 전문가
- [fe-mo-data-display-component-builder.toml](./fe-mo-data-display-component-builder.toml): `packages/fe-mo-ui/src/data-display/**`, `surface`, `design-system`, 비오버레이 `layout` thin wrapper contract를 생성하거나 정리하는 전문가
- [fe-mo-feedback-component-builder.toml](./fe-mo-feedback-component-builder.toml): `packages/fe-mo-ui/src/feedback/**`와 overlay feedback `layout` thin wrapper contract를 생성하거나 정리하는 전문가
- [fe-mo-menu-builder.toml](./fe-mo-menu-builder.toml): `packages/fe-mo-ui/src/layout/Menu/**`, `packages/fe-mo-ui/src/layout/SubMenu/**`의 RN 메뉴 contract를 생성하거나 정리하는 전문가
- [fe-mo-widget-builder.toml](./fe-mo-widget-builder.toml): `packages/fe-mo-ui/src/widget/**`의 RN 순수 UI 조합 Widget을 생성하거나 정리하는 전문가
- [fe-mo-feature-builder.toml](./fe-mo-feature-builder.toml): `packages/fe-mo-ui/src/feature/**`의 RN reusable Feature composition을 생성하거나 정리하는 전문가
- [fe-mo-form-builder.toml](./fe-mo-form-builder.toml): `packages/fe-mo-ui/src/form/**`의 RN 입력 form 조합을 생성하거나 정리하는 전문가
- [fe-mo-detail-builder.toml](./fe-mo-detail-builder.toml): `packages/fe-mo-ui/src/detail/**`의 RN 읽기 전용 detail/view 조합을 생성하거나 정리하는 전문가
- [fe-mo-route-layout-builder.toml](./fe-mo-route-layout-builder.toml): `apps/mobile/src/app/**/_layout.tsx`를 구현하는 전문가
- [fe-mo-page-builder.toml](./fe-mo-page-builder.toml): `apps/mobile/src/app/**/*.tsx` route file에서 shared screen visual owner를 연결하고 navigation/API/state/native wiring을 구현하는 전문가
- [fe-mo-screen-builder.toml](./fe-mo-screen-builder.toml): 모바일 `fe-ui-page-builder` 대응 screen visual owner를 `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx` 기준으로 생성/정리하는 전문가
- [fe-mo-api-integrator.toml](./fe-mo-api-integrator.toml): 모바일 데이터 조회/변경 연동 기준을 구현하는 전문가
- [fe-mo-state-builder.toml](./fe-mo-state-builder.toml): 모바일 route-local MobX state class/hook과 state slice 전달 구조를 구현하는 전문가
- [fe-mo-store-builder.toml](./fe-mo-store-builder.toml): 모바일 공용/로컬 상태 경계를 정리하고 MobX store 를 구현하는 전문가
- [fe-mo-unit-test-builder.toml](./fe-mo-unit-test-builder.toml): 모바일 Jest unit test 전략을 설계하는 전문가
- [fe-mo-e2e-builder.toml](./fe-mo-e2e-builder.toml): 모바일 Detox E2E 테스트 전략을 설계하는 전문가

## QA

- [qa-mo-testing.toml](./qa-mo-testing.toml): Jest + React Native Testing Library 기반 모바일 단위 테스트 코드를 작성하는 전문가
- [qa-mo-e2e-testing.toml](./qa-mo-e2e-testing.toml): Detox 기반 모바일 E2E 테스트 코드를 작성하는 전문가
