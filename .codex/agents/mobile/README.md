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
- 전역 sidecar spec 정책상 모바일에서 신규/갱신 가능한 route 문서는 Expo Router native route screen owner인 `apps/mobile/src/app/**/index.spec.md`뿐입니다. 테스트 sidecar와 모바일 UI leaf sidecar는 만들지 않고 layout/state/API/test 계약도 route `index.spec.md`에 기록합니다.

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
- [fe-mo-route-layout-builder.toml](./fe-mo-route-layout-builder.toml): `apps/mobile/src/app/**/_layout.tsx`를 구현하는 전문가
- [fe-mo-page-builder.toml](./fe-mo-page-builder.toml): `apps/mobile/src/app/**/index.tsx` route screen 을 구현하는 전문가
- [fe-mo-api-integrator.toml](./fe-mo-api-integrator.toml): 모바일 데이터 조회/변경 연동 기준을 구현하는 전문가
- [fe-mo-state-builder.toml](./fe-mo-state-builder.toml): 모바일 route-local MobX state class/hook과 state slice 전달 구조를 구현하는 전문가
- [fe-mo-store-builder.toml](./fe-mo-store-builder.toml): 모바일 공용/로컬 상태 경계를 정리하고 MobX store 를 구현하는 전문가
- [fe-mo-unit-test-builder.toml](./fe-mo-unit-test-builder.toml): 모바일 Jest unit test 전략을 설계하는 전문가
- [fe-mo-e2e-builder.toml](./fe-mo-e2e-builder.toml): 모바일 Detox E2E 테스트 전략을 설계하는 전문가

## QA

- [qa-mo-testing.toml](./qa-mo-testing.toml): Jest + React Native Testing Library 기반 모바일 단위 테스트 코드를 작성하는 전문가
- [qa-mo-e2e-testing.toml](./qa-mo-e2e-testing.toml): Detox 기반 모바일 E2E 테스트 코드를 작성하는 전문가
