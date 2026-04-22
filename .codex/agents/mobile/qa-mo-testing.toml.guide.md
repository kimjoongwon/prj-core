# qa-mo-testing.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/mobile/qa-mo-testing.toml

## 역할

`qa-mo-testing`이 mobile route/package spec 에 정의된 unit 테스트 케이스를 Jest + React Native Testing Library 코드로 구현하는 QA role 임을 정의합니다.

## 운영 규칙

- owner spec 의 `테스트 케이스` 섹션이 없으면 즉시 차단합니다.
- 테스트 구현 후 대응 spec 의 구현 체크리스트와 변경 이력을 함께 갱신합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 모바일 unit QA role 신규 추가 | codex |
