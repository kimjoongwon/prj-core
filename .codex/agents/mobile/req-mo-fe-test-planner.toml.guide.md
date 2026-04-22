# req-mo-fe-test-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-fe-test-planner.toml

## 역할

`req-mo-fe-test-planner`를 모바일 test planner로 정의합니다.
이 planner는 app/route spec에 unit test, E2E 시나리오, 자동 검증 명령, test file 경로를 함께 기록합니다.

## 운영 규칙

- 출력 대상은 `apps/mobile/src/app//app.context.md`, `apps/mobile/src/app/**/_layout.spec.md`, `apps/mobile/src/app/**/index.spec.md`의 테스트 섹션입니다.
- 기본 검증 명령은 `pnpm --filter @cocrepo/mo-ui test`, `pnpm --filter @cocrepo/mo-ui type-check`, `pnpm --filter mobile-app test`, `pnpm --filter mobile-app type-check`, `pnpm --filter mobile-app test:e2e`, `pnpm --filter mobile-app doctor` 입니다.
- 테스트 섹션에는 unit test, E2E 시나리오, 자동 검증, 수동 확인 항목이 함께 기록되어야 합니다.
- 모바일 E2E는 Detox 기준으로 정리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | checklist-only planner를 모바일 unit/E2E test planner로 확장 | codex |
| 2026-04-13 | 모바일 command 기반 verification planner 신규 추가 | codex |
