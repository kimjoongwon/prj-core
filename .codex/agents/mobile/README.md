# Mobile Agent Index

이 문서는 `.codex/agents/mobile/*.toml`의 모바일 role 인덱스입니다.

원문 우선순위:

1. [.codex/config.toml](../../config.toml)
2. 각 `mobile/*.toml`
3. 이 인덱스

운영 원칙:

- 모바일 role은 RN/Expo 전용 contract입니다.
- 웹용 `fe-*`, `orch-*`, `req-*` role과 분리됩니다.
- 모바일 orchestration 은 mobile route flow 에 공통 backend spec planning 을 포함한 compact 4-stage flow 기준입니다.
- 모바일 검증은 Jest unit test 와 Detox E2E, `qa-mo-*` role 기준으로 정리합니다.

## Orchestration

- [orch-mobile-stage.toml](./orch-mobile-stage.toml): 모바일 route flow 와 common backend spec planning 을 함께 조율하는 메타 role
- [orch-mobile-screen-planner.toml](./orch-mobile-screen-planner.toml): 단일 Expo route 의 모바일 화면 기획을 조율하는 오케스트레이터

## Planner

- [req-mo-route-layout-planner.toml](./req-mo-route-layout-planner.toml): Expo Router 의 `_layout.spec.md` shell 계약을 기획하는 전문가
- [req-mo-page-planner.toml](./req-mo-page-planner.toml): Expo route screen 의 `index.spec.md`를 상세 기획하는 전문가
- [req-mo-primitive-planner.toml](./req-mo-primitive-planner.toml): 모바일 display/surface/provider primitive sidecar spec 을 기획하는 전문가
- [req-mo-input-planner.toml](./req-mo-input-planner.toml): 모바일 입력 컴포넌트 sidecar spec 을 기획하는 전문가
- [req-mo-menu-planner.toml](./req-mo-menu-planner.toml): 모바일 navigation/menu contract 를 기획하는 전문가
- [req-mo-store-planner.toml](./req-mo-store-planner.toml): 모바일 공용/로컬 상태 경계를 기획하는 전문가
- [req-mo-state-planner.toml](./req-mo-state-planner.toml): 모바일 route-local 상태와 shared Store 승격 경계를 기획하는 전문가
- [req-mo-fe-test-planner.toml](./req-mo-fe-test-planner.toml): 모바일 route 와 app spec 의 unit/E2E 테스트 케이스를 기획하는 전문가

## Active Builder

- [fe-mo-control-component-builder.toml](./fe-mo-control-component-builder.toml): `packages/fe-mo-ui/src/control/**`의 RN 입력/상호작용 contract를 생성하거나 정리하는 전문가
- [fe-mo-display-component-builder.toml](./fe-mo-display-component-builder.toml): `packages/fe-mo-ui/src/display/**`와 `surface`, `design-system`, 비메뉴 `layout` thin wrapper contract를 생성하거나 정리하는 전문가
- [fe-mo-menu-builder.toml](./fe-mo-menu-builder.toml): `packages/fe-mo-ui/src/layout/Menu|SubMenu/**`의 RN 메뉴 contract를 생성하거나 정리하는 전문가
- [fe-mo-route-layout-builder.toml](./fe-mo-route-layout-builder.toml): `apps/mobile/src/app/**/_layout.tsx`를 구현하는 전문가
- [fe-mo-page-builder.toml](./fe-mo-page-builder.toml): `apps/mobile/src/app/**/index.tsx` route screen 을 구현하는 전문가
- [fe-mo-api-integrator.toml](./fe-mo-api-integrator.toml): 모바일 데이터 조회/변경 연동 기준을 구현하는 전문가
- [fe-mo-state-builder.toml](./fe-mo-state-builder.toml): 모바일 route-local MobX state class/hook과 state slice 전달 구조를 구현하는 전문가
- [fe-mo-store-builder.toml](./fe-mo-store-builder.toml): 모바일 공용/로컬 상태 경계를 정리하고 MobX store 를 구현하는 전문가
- [fe-mo-unit-test-builder.toml](./fe-mo-unit-test-builder.toml): 모바일 Jest unit test 전략을 설계하는 전문가
- [fe-mo-e2e-builder.toml](./fe-mo-e2e-builder.toml): 모바일 Detox E2E 테스트 전략을 설계하는 전문가

## Reserved Builder

- [fe-mo-cell-builder.toml](./fe-mo-cell-builder.toml): 모바일 Cell 재사용 계층 예약 role
- [fe-mo-columns-builder.toml](./fe-mo-columns-builder.toml): 모바일 columns 계약 예약 role
- [fe-mo-detail-builder.toml](./fe-mo-detail-builder.toml): 모바일 detail 계층 예약 role
- [fe-mo-feature-builder.toml](./fe-mo-feature-builder.toml): 모바일 feature 계층 예약 role
- [fe-mo-form-builder.toml](./fe-mo-form-builder.toml): 모바일 form 계층 예약 role
- [fe-mo-layout-builder.toml](./fe-mo-layout-builder.toml): 모바일 재사용 layout shell 예약 role
- [fe-mo-master-builder.toml](./fe-mo-master-builder.toml): 모바일 master 계층 예약 role
- [fe-mo-ui-page-builder.toml](./fe-mo-ui-page-builder.toml): `packages/fe-mo-ui/src/page/**` pure page 예약 role
- [fe-mo-widget-builder.toml](./fe-mo-widget-builder.toml): 모바일 widget 계층 예약 role

## QA

- [qa-mo-testing.toml](./qa-mo-testing.toml): Jest + React Native Testing Library 기반 모바일 단위 테스트 코드를 작성하는 전문가
- [qa-mo-e2e-testing.toml](./qa-mo-e2e-testing.toml): Detox 기반 모바일 E2E 테스트 코드를 작성하는 전문가
