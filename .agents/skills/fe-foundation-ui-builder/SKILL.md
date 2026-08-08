---
name: "fe-foundation-ui-builder"
description: "이 skill은 `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent` 역할로 웹/모바일 기본 UI를 만들거나 고칠 때 사용합니다. 공통 UI 원칙과 역할별 구현·검증 규칙을 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# fe-foundation-ui-builder

기본 UI를 만들거나 수정하기 전에 [공통 규칙](references/foundation.md)을 읽습니다.
배정된 subagent와 산출물에 따라 아래 역할 규칙 하나를 추가로 읽습니다.

- 데이터 표시 UI: [data-display 규칙](references/data-display.md)
- 알림, 에러, 빈 상태 UI: [feedback 규칙](references/feedback.md)
- 모달, 팝오버, 툴팁 UI: [overlay 규칙](references/overlay.md)

플랫폼과 소유 경로는 각 subagent TOML을 기준으로 확정하고, 소스와 같은 위치의 단위 테스트 및 가까운 barrel export까지 함께 관리합니다.

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
