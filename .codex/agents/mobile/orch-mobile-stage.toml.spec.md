# orch-mobile-stage.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/orch-mobile-stage.toml

## 역할

`orch-mobile-stage`를 Expo/RN 전용 stage 오케스트레이터로 정의합니다.
이 role은 모바일 feature 기획부터 `packages/fe-mo-ui` 구현, `apps/mobile` route 통합, unit/E2E 검증까지 compact 4-stage flow를 조율합니다.
Stage 1에서는 모바일 route spec 뿐 아니라 backend spec 생성도 함께 조율하며, backend child role 은 공통 backend role 을 재사용합니다.

## 운영 규칙

- 기본 입력 축은 `route/routes`이며, Stage 1에서 backend spec 생성이 필요할 때만 `domain`/`domains`를 추가로 받습니다.
- Stage 1에서는 `domain`/`domains`와 `route/routes`를 함께 받아 mobile route spec 과 backend spec 을 조율할 수 있습니다.
- backend spec planning 은 mobile 전용 backend clone role 을 만들지 않고 공통 backend `req-*` role 을 사용합니다.
- Stage 1은 `orch-mobile-screen-planner`를 통해 `_layout.spec.md`, `index.spec.md`, `app.spec.md`와 unit/E2E 테스트 계약을 정리하고, 공통 backend role chain 으로 backend spec 을 정리합니다.
- Stage 2는 `fe-mo-display-component-builder`, `fe-mo-control-component-builder`, `fe-mo-menu-builder` 중심으로 `packages/fe-mo-ui`를 구현합니다.
- Stage 3은 `fe-mo-route-layout-builder`, `fe-mo-page-builder`, 조건부 `fe-mo-api-integrator`, `fe-mo-store-builder`로 `apps/mobile/src/app/**`를 통합합니다.
- Stage 4는 `fe-mo-e2e-builder`, `req-mo-fe-test-planner`, `qa-mo-e2e-testing`과 검증 명령으로 모바일 테스트를 마감합니다.
- Stage 4 기본 검증 명령은 `pnpm --filter @cocrepo/mo-ui test`, `pnpm --filter @cocrepo/mo-ui type-check`, `pnpm --filter mobile-app test`, `pnpm --filter mobile-app type-check`, `pnpm --filter mobile-app test:e2e`, `pnpm --filter mobile-app doctor` 입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 Stage 1 test spec owner / Stage 4 E2E verification + `qa-mo-*` role 기준으로 운영 규칙을 갱신 | codex |
| 2026-04-13 | 모바일 frontend 전용 compact 4-stage orchestrator 신규 추가 | codex |
| 2026-04-13 | Stage 1에 common backend spec planning 책임 추가 | codex |
