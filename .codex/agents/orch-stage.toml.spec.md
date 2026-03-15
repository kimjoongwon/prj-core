# orch-stage.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/orch-stage.toml

## 역할

Stage 오케스트레이터가 화면 기획부터 페이지 통합까지 Surface 규칙을 빠뜨리지 않도록 흐름을 정의합니다.
Stage 4의 Surface 결정이 Stage 5/6 구현과 리뷰 기준으로 이어지게 하는 운영 규칙을 문서화합니다.

## 운영 규칙

- Stage 4 완료 조건에는 `page.spec.md`의 Surface/Elevation 결정이 포함됩니다.
- Stage 5는 Stage 4에서 확정한 Surface ownership/elevation 계획을 그대로 소비해야 합니다.
- Stage 6의 `/fe-review`는 Page-owned Surface, layout 비소유, flat 예외 문서화를 함께 검증해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Stage 4-6 흐름에 Surface 계획/검증 단계를 명시하고 완료 조건을 보강 | codex |
