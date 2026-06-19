---
name: "fe-display-creator"
description: "이전 방식 display-area 기준을 확인할 때 사용합니다. 새 기본 UI 작업은 data-display, feedback, overlay skill을 우선 사용합니다."
---

# fe-display-creator

이 skill은 display 영역의 이전 공통 규칙을 확인할 때만 사용합니다. 새 작업은 data-display, feedback, overlay skill을 우선 사용합니다.

## 작업 흐름

1. 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 소스 변경 전에 `references/agent-instructions.md`를 읽습니다. 자세한 작업 규칙은 그 파일에 있습니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 참고 문서

- `references/agent-instructions.md`: 실제 작업 순서와 세부 규칙입니다.
