---
name: "orch-delivery-creator"
description: "이 skill은 `orch-delivery` 역할로 일할 때 사용합니다. 서비스 기획, spec 작성, 하위 에이전트 실행 순서를 잡는 방법을 쉽게 안내합니다."
---

# orch-delivery-creator

`orch-delivery`로 서비스 기획과 작업 계획을 할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/01-orch-delivery.toml`에서 사용자 요청, 승인된 스펙, 맡은 범위를 확인합니다.
2. 변경 전에 `references/agent-instructions.md`를 읽습니다. 서비스 스펙, route/page 스펙, 인계 규칙이 그 파일에 있습니다.
3. 이번 작업에 필요한 조율 규칙만 적용합니다. 실제 구현 규칙은 배정된 하위 에이전트 skill이 맡습니다.
4. 하위 에이전트 실행 전 spec의 `산출물 시뮬레이션 / 인계 계약`에 예상 결과, 파일 경로, 다음 단계, 검증 기준이 있는지 확인합니다.
5. 공통 보고와 차단 규칙은 루트 `AGENTS.md`를 따릅니다. 이 skill은 단계 id, spec 행 id, 재실행 필요 여부를 추가로 확인합니다.
6. 가능한 검증을 실행하고 결과와 남은 위험을 짧게 정리합니다.

## 참고 문서

- `references/agent-instructions.md`: 서비스 스펙, route/page 스펙, 승인, 인계, 실행 조율 규칙입니다.
