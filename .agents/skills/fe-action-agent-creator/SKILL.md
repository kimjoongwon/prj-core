---
name: "fe-action-agent-creator"
description: "이 skill은 `fe-action-agent` 역할로 일할 때 사용합니다. 버튼과 액션 UI를 만드는 방법을 쉽게 안내합니다."
---

# fe-action-agent-creator

`fe-action-agent`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/29-fe-action-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 소스 변경 전에 `references/agent-instructions.md`를 읽습니다.
3. 배정된 플랫폼과 경로에 맞는 action 규칙만 적용합니다.
4. action 소스, 같은 위치의 단위 테스트, 가까운 barrel export, 필요한 최소 import 안에서만 작업합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 참고 문서

- `references/agent-instructions.md`: action 기본 UI 규칙입니다.

