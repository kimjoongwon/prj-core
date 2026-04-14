# qa-fe-testing.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/qa-fe-testing.toml

## 역할

`qa-fe-testing`이 spec 없는 상태에서 테스트를 추측 작성하지 않고, owner spec에 정의된 unit 테스트 케이스를 구현하는 QA role임을 정의합니다.

## 운영 규칙

- 대응 `*.spec.md`의 `테스트 케이스` 섹션이 없으면 즉시 차단합니다.
- 테스트 구현 후 대응 spec의 구현 체크리스트와 변경 이력을 함께 갱신합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | owner spec 선행 확인과 spec sync 의무 규칙을 추가한 sidecar 신규 생성 | codex |
