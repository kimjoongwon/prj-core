# qa-mo-e2e-testing.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/mobile/qa-mo-e2e-testing.toml

## 역할

`qa-mo-e2e-testing`이 mobile app/route spec 에 정의된 E2E 시나리오를 Detox 테스트로 구현하는 QA role 임을 정의합니다.

## 운영 규칙

- owner spec 의 E2E 시나리오가 없으면 즉시 차단합니다.
- Detox 설정과 테스트 구현 후 대응 spec 의 구현 체크리스트와 변경 이력을 함께 갱신합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 Detox QA role 신규 추가 | codex |
