# orch-mobile-stage.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/orch-mobile-stage.toml

## 역할

`orch-mobile-stage`를 Expo/RN 전용 stage 오케스트레이터로 정의합니다.
이 role은 모바일 화면 기획부터 `packages/fe-mo-ui` 구현, `apps/mobile` route 통합, command 기반 검증까지 compact 4-stage flow를 조율합니다.

## 운영 규칙

- 입력 기준은 `domain/page`가 아니라 `route/routes` 입니다.
- v1 범위는 frontend-only 이며, 모바일 전용 `qa-mo-*` role 없이 Stage 4 command verification 으로 마감합니다.
- Stage 1은 `orch-mobile-screen-planner`를 통해 `_layout.spec.md`, `index.spec.md`, `app.spec.md` 계약을 정리합니다.
- Stage 2는 `fe-mo-display-component-builder`, `fe-mo-control-component-builder`, `fe-mo-menu-builder` 중심으로 `packages/fe-mo-ui`를 구현합니다.
- Stage 3은 `fe-mo-route-layout-builder`, `fe-mo-page-builder`, 조건부 `fe-mo-api-integrator`, `fe-mo-store-builder`로 `apps/mobile/src/app/**`를 통합합니다.
- Stage 4 기본 검증 명령은 `pnpm --filter @cocrepo/mo-ui type-check`, `pnpm --filter mobile-app type-check`, `pnpm --filter mobile-app doctor` 입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 frontend 전용 compact 4-stage orchestrator 신규 추가 | codex |
