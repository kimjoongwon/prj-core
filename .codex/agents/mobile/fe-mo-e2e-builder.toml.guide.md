# fe-mo-e2e-builder.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/mobile/fe-mo-e2e-builder.toml

## 역할

`fe-mo-e2e-builder`를 모바일 Detox E2E 전략 role로 정의합니다.
이 role은 app/route spec 의 E2E 시나리오를 Stage 4 구현 handoff 로 정렬합니다.

## 운영 규칙

- Stage 4 체인에서 사용합니다.
- owner spec 에 기록된 E2E 시나리오와 test file 경로를 source of truth 로 사용합니다.
- Stage 4 에서 임의로 신규 모바일 여정을 추가하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | reserved contract 를 Detox E2E 전략 role 로 승격 | codex |
