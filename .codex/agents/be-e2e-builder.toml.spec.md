# be-e2e-builder.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/be-e2e-builder.toml

## 역할

`be-e2e-builder`가 backend E2E 전략을 새로 발명하지 않고 기존 backend spec의 테스트 케이스와 시나리오 ID를 구현 가능한 핸드오프로 정렬하도록 정의합니다.

## 운영 규칙

- controller/module/application-service/service spec의 기존 테스트 케이스 섹션을 source of truth로 사용합니다.
- Stage 7에서는 spec 밖 범위를 임의 확장하지 않고 필요한 sync 정보만 보강합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | backend spec 시나리오 ID와 Stage 7 handoff 정렬 규칙을 문서화 | codex |
