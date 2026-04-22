# qa-fe-e2e-testing.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/qa-fe-e2e-testing.toml

## 역할

`qa-fe-e2e-testing`이 `page.spec.md`와 `page.e2e.spec.md`에 기록된 시나리오를 Playwright sidecar로 구현하는 QA role임을 정의합니다.

## 운영 규칙

- `page.spec.md`, `page.e2e.spec.md`가 없거나 E2E 케이스가 비어 있으면 즉시 차단합니다.
- 테스트 구현 후 두 spec의 구현 체크리스트와 변경 이력을 함께 갱신합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | E2E owner spec 선행 확인과 spec sync 의무 규칙을 추가한 sidecar 신규 생성 | codex |
