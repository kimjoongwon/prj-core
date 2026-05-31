---
name: "delivery-orchestration-creator"
description: "`orch-delivery` agent_type이 질문 기획 → 서비스 Spec → 승인 → 라우트 Spec → 구현 → QA 흐름을 수행할 때 사용합니다. 이 creator skill은 얇은 agent TOML에서 분리한 상세 workflow, 구현 규칙, 검증 계약을 담습니다."
---

# delivery-orchestration-creator

`orch-delivery`로 동작하거나 사용자가 이 creator workflow를 명시적으로 요청할 때 이 skill을 사용합니다.

## Workflow

1. `.codex/agents/orch-delivery.toml`에서 사용자 요청, 승인된 spec, ownership boundary를 확인합니다.
2. source 변경 전에 `references/agent-instructions.md`를 읽습니다. 이 파일에는 creator의 상세 구현 규칙이 있습니다.
3. 배정된 대상에 관련된 섹션만 적용합니다. 플랫폼 인식 FE creator는 파일 경로로 대상 플랫폼을 먼저 판단한 뒤 Web 또는 React Native 규칙을 적용합니다.
4. agent ownership boundary 안에서만 작업합니다. 필요한 파일이나 순서가 다른 role 소유라면 중단하고 필수 Feedback packet으로 보고합니다.
5. 가능한 경우 spec 또는 상세 지시가 요구한 검증을 실행한 뒤 결과와 남은 위험을 요약합니다.

## References

- `references/agent-instructions.md`: 원래 agent TOML에서 옮긴 상세 workflow와 구현 계약입니다.
