# req-surface-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/req-surface-planner.toml

## 역할

Surface planner agent를 route layout 중심 ownership 모델에 맞춰 재정의합니다.
이 planner는 `layout.spec.md`가 소유할 `PageSurface`, `SectionSurface`, `Surface`와 `page.spec.md`가 소비만 해야 하는 계약을 분리합니다.

## 운영 규칙

- route-level surface owner는 기본적으로 `layout.tsx`입니다.
- named slot을 쓰더라도 surface owner는 기본적으로 parent layout 쪽에서 먼저 결정합니다.
- `page.spec.md`는 surface owner가 아니라 소비 계약 문서입니다.
- owner 중복과 flat 예외 누락을 실패 조건으로 다룹니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | route layout 중심 surface ownership 모델로 planner 규칙을 재정의 | codex |
| 2026-03-21 | named slot과 fallback의 surface ownership 규칙을 추가 | codex |
