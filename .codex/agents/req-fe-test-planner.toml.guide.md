# req-fe-test-planner.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/req-fe-test-planner.toml

## 역할

`req-fe-test-planner`를 웹 프론트엔드 L12 테스트 케이스 planner로 정의합니다.
이 planner는 Stage 4에서 unit/E2E 테스트 케이스를 spec에 기록하고, Stage 5-7에서 구현 결과에 맞춰 test spec을 동기화합니다.

## 운영 규칙

- 기본 owner stage는 Stage 4 화면 기획입니다.
- 출력 대상은 `page.spec.md`, `page.e2e.spec.md`, 관련 FE sidecar spec 입니다.
- Stage 5/6은 unit test 구현에 맞춰 spec을 sync하고, Stage 7은 E2E 시나리오 ID와 구현 상태를 sync합니다.
- 후속 QA role이 바로 구현할 수 있도록 테스트 파일 경로와 케이스 ID를 함께 기록해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Stage 4 owner / Stage 5-7 sync 기준의 FE test planner sidecar 신규 생성 | codex |
