# orch-mobile-screen-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/orch-mobile-screen-planner.toml

## 역할

`orch-mobile-screen-planner`를 단일 Expo route 화면 기획 오케스트레이터로 정의합니다.
이 role은 route kind, UI owner, shared UI target, downstream builder 매핑을 한 번에 정렬해 모바일 spec 산출물의 source of truth를 만듭니다.

## 운영 규칙

- 입력 예시는 `apps/mobile/src/app/**` 기준으로 해석합니다.
- route kind는 `layout`, `screen`, `modal` 중 하나로 결정합니다.
- UI owner는 기본적으로 `apps/mobile/src/app/**`이며, 공유 primitive가 필요할 때만 `packages/fe-mo-ui/**`로 승격합니다.
- 선행 순차 단계 뒤에 planner fan-out을 실행하고, 검증 체크리스트는 `req-mo-fe-test-planner`가 join 단계에서 정리합니다.
- `page role/master-detail-form` 같은 웹 분류 대신 Expo Router route 구조와 navigation 흐름을 우선 기록합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 단일 Expo route 기획 orchestration 과 downstream builder 매핑 규칙을 신규 정의 | codex |
