---
name: "fe-data-display-creator"
description: "이 skill은 `fe-data-display-agent` 역할로 일할 때 사용합니다. 데이터 표시 기본 UI를 만드는 방법을 쉽게 안내합니다."
---

# fe-data-display-creator

`fe-data-display-agent`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/26-fe-data-display-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 소스 변경 전에 `../fe-display-creator/references/agent-instructions.md`를 읽습니다. 공통 기본 UI 규칙은 그 파일에 있습니다.
3. 배정된 플랫폼과 경로에 맞는 data-display 규칙만 적용합니다.
4. data-display 소스, 같은 위치의 단위 테스트, 가까운 barrel export, 필요한 최소 import 안에서만 작업합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 참고 문서

- `../fe-display-creator/references/agent-instructions.md`: 웹/모바일 공통 기본 UI 규칙입니다.
