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
- 입력/출력 예시는 `apps/[app]/web/src/app/**` 기준으로 해석합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | Stage 4가 page folder-based sidecar 경로와 `web/src/app` 구조를 기준으로 동작하도록 보강 | codex |
| 2026-03-15 | Stage 4 join 단계에 `req-surface-planner`를 추가하고 Surface 기록을 완료 조건으로 반영 | codex |
