# fe-e2e-builder.toml 기획서

> 생성일: 2026-04-14
> 타입: agent-config
> 위치: .codex/agents/fe-e2e-builder.toml

## 역할

`fe-e2e-builder`가 Stage 4에서 기록한 `page.spec.md` / `page.e2e.spec.md`의 테스트 케이스를 Stage 7 구현 핸드오프로 정렬하도록 정의합니다.

## 운영 규칙

- E2E 전략은 기존 spec의 시나리오 ID와 owner 파일 경로를 source of truth로 사용합니다.
- Stage 7에서 신규 화면 여정을 임의로 추가하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | frontend page spec 시나리오 ID와 Stage 7 handoff 정렬 규칙을 문서화 | codex |
