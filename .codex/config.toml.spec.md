# config.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/config.toml

## 역할

Codex role 레지스트리와 전역 개발 규칙의 단일 소스를 정의합니다.
신규 role 추가 시 description, config file 매핑, 오케스트레이터 연계 여부를 이 파일에서 관리합니다.

## 운영 규칙

- role 정의는 `.codex/agents/*.toml`을 원본으로 등록하고 `.claude`, `.opencode`는 sync 결과물로 취급합니다.
- planning/implementation/qa 흐름에서 실제로 호출될 role만 registry에 추가합니다.
- 오케스트레이터가 의존하는 신규 planner role은 registry와 오케스트레이터 문서를 함께 갱신해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `req-surface-planner` role 등록과 Surface planning registry 규칙을 추가 | codex |
