# fe-mo-store-builder.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/fe-mo-store-builder.toml

## 역할

`fe-mo-store-builder`를 모바일 MobX store builder로 정의합니다.
이 role은 shared store 승격 조건을 지키면서 `packages/fe-store`와 route-local state 경계를 실제 코드로 정리합니다.

## 운영 규칙

- 교차 route 재사용 상태만 `packages/fe-store`에 생성합니다.
- 단일 route 전용 상태는 `apps/mobile/src/app/**` 로컬 state 또는 route-local observable 로 유지합니다.
- persistence 가 필요해도 웹 `localStorage` 기본 가정은 두지 않습니다.
- store 구현은 observable state, action, async flow, hydration 경계를 모바일 런타임 제약에 맞게 정의합니다.
- 구현 전 planner 가 남긴 `shared store required` 판단을 우선 확인합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 store builder 를 active 로 승격하고 shared/local state 경계 규칙을 추가 | codex |
