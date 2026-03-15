# req-layout-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/req-layout-planner.toml

## 역할

Layout planner agent가 구현 단계와 같은 레이아웃 용어와 구조를 사용하도록 기획 기준을 정의합니다.
설계 단계부터 `Page + PageTitleBar` 구조와 선택적 `PageSurface/SectionSurface` 표현 레이어를 함께 계획하게 합니다.

## 운영 규칙

- Layout 설계는 `App > Layout > Page > Section` 계층을 유지해야 합니다.
- 페이지 헤딩은 `PageTitleBar`, 페이지 내부 구역은 `Section` 기준으로 계획합니다.
- `PageSurface`, `SectionSurface`는 구조를 대체하지 않는 표현 레이어로만 계획합니다.
- layout은 공유 탭/네비게이션/Provider만 담당하고 페이지 고유 `PageSurface`와 헤더는 소유하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `req-surface-planner` 협업 전제를 위해 layout의 PageSurface 비소유 원칙을 추가 | codex |
| 2026-03-15 | Surface를 폐기 규칙이 아닌 표현 레이어로 재정의하고 `Page` 대체 금지 관점을 반영 | codex |
| 2026-03-15 | layout planner의 구 Surface 중첩 규칙을 `Page + PageTitleBar + Section` 기준으로 교체 | codex |
