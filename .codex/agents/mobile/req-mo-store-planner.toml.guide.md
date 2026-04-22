# req-mo-store-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-store-planner.toml

## 역할

`req-mo-store-planner`를 모바일 공용/로컬 상태 경계 planner로 정의합니다.
이 planner는 MobX store 승격 조건과 route-local state 유지 조건을 모바일 화면 spec에 반영합니다.

## 운영 규칙

- 교차 route 또는 교차 도메인 재사용이 있을 때만 `packages/fe-store` 산출물을 계획합니다.
- 단일 route 전용 상태는 `apps/mobile/src/app/**` 로컬 상태로 유지합니다.
- store spec에는 observable state, action, async flow, hydration 제약을 RN 기준으로 기록합니다.
- 웹 `localStorage` 기본 가정은 두지 않고, persistence 필요 시 모바일 저장소 전략을 별도로 명시합니다.
- planner 출력에는 `shared store required` 여부와 이유가 포함되어야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 공용/로컬 상태 경계 planner 신규 추가 | codex |
