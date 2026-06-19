---
name: "fe-storybook-creator"
description: "이 skill은 `fe-storybook-agent` 역할로 일할 때 사용합니다. 웹/모바일 UI 컴포넌트의 Storybook 스토리를 만드는 방법을 쉽게 안내합니다."
---

# fe-storybook-creator

`fe-storybook-agent`로 Storybook 스토리를 만들거나 정리할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/42-fe-storybook-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 소스 변경 전에 `references/agent-instructions.md`를 읽습니다. Storybook 작성 규칙은 그 파일에 있습니다.
3. 변경된 UI 소스와 기존 story를 먼저 읽고, 스토리가 보여야 하는 상태를 spec에서 확인합니다.
4. `*.stories.tsx`, Storybook fixture/mock/helper, Storybook 런타임/config 안에서만 작업합니다.
5. UI 소스 계약 문제가 보이면 직접 고치지 말고 소스 담당자에게 넘길 내용을 최종 보고에 적습니다.
6. 가능한 경우 Storybook 관련 type-check 또는 생성 명령을 실행하고 결과와 남은 위험을 짧게 정리합니다.

## 참고 문서

- `references/agent-instructions.md`: 웹/모바일 Storybook 스토리 작성, fixture, 검증 규칙입니다.
