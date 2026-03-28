# orch-screen-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/orch-screen-planner.toml

## 역할

화면 기획 오케스트레이터가 구조 planner 결과를 Surface ownership 결정까지 연결하도록 기준을 정의합니다.
병렬 fan-out 이후 `req-surface-planner`를 join 단계에서 실행하는 흐름을 고정합니다.

## 운영 규칙

- `req-page-planner`, `req-api-planner`는 선행 순차 단계로 유지합니다.
- `req-surface-planner`는 구조/UI/feature/layout 결과를 모은 뒤 단일 writer로 실행합니다.
- 화면 기획 완료 조건에는 `page.spec.md`의 Surface/Elevation 기록 여부가 포함됩니다.
- 화면 기획 완료 조건에는 `Rendering Decision.page component path = packages/fe-ui/src/page/[PageName]/[PageName].tsx` 준수 여부도 포함됩니다.
- 화면 기획은 관련 Stage 5/6 구현 role 문서를 먼저 읽고 출력 경로, 필수 규칙, 금지 규칙, 검증 명령을 spec에 반영해야 합니다.
- Cell 관련 기획 산출물은 `packages/fe-ui/src/cell/**` 경로를 기준으로 기록합니다.
- `page.spec.md`의 `Rendering Decision`에는 `page role`, `reusable target`, `참조한 구현 role`이 함께 기록되어야 합니다.
- 입력/출력 예시는 `apps/[app]/web/src/app/**` 기준으로 해석합니다.
- 문서에서 `.codex/config.toml` 기준 항목은 `role`, 실행 단위는 `agent`로 구분합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | `web/src/app` 경로와 role 용어 기준으로 출력/참조 표기를 정정 | codex |
| 2026-03-28 | Stage 5/6 구현 role 참조 프로토콜과 `src/cell` 기준 경로, `page role/reusable target` 기록 규칙을 추가 | codex |
| 2026-03-26 | Stage 4가 page folder-based sidecar 경로와 `web/src/app` 구조를 기준으로 동작하도록 보강 | codex |
| 2026-03-15 | Stage 4 join 단계에 `req-surface-planner`를 추가하고 Surface 기록을 완료 조건으로 반영 | codex |
