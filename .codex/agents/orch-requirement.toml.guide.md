# orch-requirement.toml 기획서

> 생성일: 2026-03-29
> 타입: agent-config
> 위치: .codex/agents/orch-requirement.toml

## 역할

도메인 기획 오케스트레이터가 새 도메인/기존 도메인 분기를 판단하고, Stage 2-3이 소비할 domain-level spec을 빠짐없이 생성하도록 기준을 정의합니다.
화면 상세 기획 L5-L12는 직접 복제하지 않고 `orch-screen-planner`로 위임하는 경계를 문서화합니다.

## 운영 규칙

- `orch-requirement.toml`은 domain-level orchestration contract만 소유합니다.
- L3-L4 화면 구조 초안은 `req-screen-planner`로 만들되, page-level 상세 규칙은 소유하지 않습니다.
- `display/control/cell/columns/widget/layout/feature/master/detail/form/page/hooks` 상세 기획은 `orch-screen-planner`의 책임으로 위임합니다.
- Entity / API / ApplicationService / Service / Repository / Controller / Module / Store(조건부) spec 생성 계약은 이 문서가 소유합니다.
- Stage 2-3 자동 병렬 실행을 위해 domain-level spec에 `## 구현 대상` 정보를 기록해야 합니다.
- `.codex/config.toml` 항목은 `role`, 실행 주체는 `agent`로 구분합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | `orch-requirement.toml`의 중복된 page-level builder 복제를 제거하고 domain-level 계약 중심으로 재구성 | codex |
