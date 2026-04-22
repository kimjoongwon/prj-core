# fe-mo-unit-test-builder.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/mobile/fe-mo-unit-test-builder.toml

## 역할

`fe-mo-unit-test-builder`를 모바일 Jest unit test 전략 role로 정의합니다.
이 role은 `apps/mobile`, `@cocrepo/mo-ui` unit test 범위를 정하고 `qa-mo-testing`에 구현 handoff를 만듭니다.

## 운영 규칙

- Stage 2/3 체인에서 사용합니다.
- owner spec 에 기록된 unit test 케이스만 전략 대상으로 삼습니다.
- 출력에는 테스트 파일 경로와 spec sync 지시가 포함되어야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | reserved contract 를 모바일 unit test 전략 role 로 승격 | codex |
