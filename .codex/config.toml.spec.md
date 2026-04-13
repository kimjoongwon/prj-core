# config.toml 기획서

> 생성일: 2026-04-13
> 타입: codex-config
> 위치: .codex/config.toml

## 역할

`.codex/config.toml`은 Codex role registry의 단일 source of truth 입니다.
웹과 모바일 role 이름, 설명, 실제 `agents/**/*.toml` 연결 경로를 한 곳에서 관리합니다.

## 운영 규칙

- `.codex/config.toml`에 등록된 이름을 `role`로 부릅니다.
- 모바일 role은 `.codex/agents/mobile/*.toml` 아래에 두고, config에서는 `agents/mobile/*.toml` 경로로 연결합니다.
- 모바일 orchestration role은 `orch-mobile-*`, 모바일 planner role은 `req-mo-*`, 모바일 builder role은 `fe-mo-*` 접두어를 사용합니다.
- 새 role을 추가하거나 역할이 바뀌면 `.codex/config.toml`, 해당 `*.toml`, 관련 `*.spec.md`, 인덱스 README를 함께 갱신합니다.
- 모바일 orchestration v1은 mobile route flow 와 common backend spec planning 을 함께 다루는 compact 4-stage flow 를 기준으로 등록합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 `fe-mo-*`, `orch-mobile-*`, `req-mo-*` role registry와 연결 규칙을 문서화 | codex |
| 2026-04-13 | `orch-mobile-stage` 설명을 mobile route + common backend spec planning 기준으로 갱신 | codex |
