# req-be-test-planner.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/req-be-test-planner.toml

## 역할

`req-be-test-planner`를 백엔드 L12 테스트 케이스 planner로 정의합니다.
이 planner는 Stage 2/3에서 unit/API E2E 케이스를 backend spec에 기록하고, Stage 7에서 E2E 구현 상태를 최종 동기화합니다.

## 운영 규칙

- 기본 owner stage는 Stage 2/3입니다.
- controller/module/application-service/service spec에 API E2E 시나리오 ID와 테스트 파일 경로를 기록합니다.
- Stage 7에서는 Stage 2/3에서 기록한 케이스를 덮어쓰지 않고 구현 상태만 보강합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Stage 2/3 owner / Stage 7 sync 기준의 BE test planner sidecar 신규 생성 | codex |
