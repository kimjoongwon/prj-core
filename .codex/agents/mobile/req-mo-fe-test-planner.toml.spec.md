# req-mo-fe-test-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-fe-test-planner.toml

## 역할

`req-mo-fe-test-planner`를 모바일 검증 체크리스트 planner로 정의합니다.
이 planner는 전용 `qa-mo-*` role이 없는 v1 상황에서 app/route spec에 command 기반 검증 계약을 남깁니다.

## 운영 규칙

- 출력 대상은 `apps/mobile/src/app/app.spec.md`, `apps/mobile/src/app/**/_layout.spec.md`, `apps/mobile/src/app/**/index.spec.md`의 테스트 섹션입니다.
- 기본 검증 명령은 `pnpm --filter @cocrepo/mo-ui type-check`, `pnpm --filter mobile-app type-check`, `pnpm --filter mobile-app doctor` 입니다.
- 테스트 섹션에는 성공 기준과 실패 시 후속 조치가 함께 기록되어야 합니다.
- 웹 Playwright/E2E 기준을 그대로 복제하지 않습니다.
- 실제 모바일 QA role 도입 전까지는 command-based verification 이 source of truth 입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 command 기반 verification planner 신규 추가 | codex |
