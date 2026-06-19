---
name: "be-prisma-annotation-creator"
description: "이 skill은 `be-prisma-annotator` 역할로 일할 때 사용합니다. Prisma schema에 한글 표시 이름 주석을 붙이는 방법을 쉽게 안내합니다."
---

# be-prisma-annotation-creator

`be-prisma-annotator`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/04-be-prisma-annotator.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 소스 변경 전에 `references/agent-instructions.md`를 읽습니다. 자세한 작업 규칙은 그 파일에 있습니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 참고 문서

- `references/agent-instructions.md`: 실제 작업 순서와 세부 규칙입니다.
