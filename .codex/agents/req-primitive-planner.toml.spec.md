# req-primitive-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/req-primitive-planner.toml

## 역할

Primitive planner agent가 실제 재사용 가능한 UI 자산을 최신 경로와 명칭으로 제시하도록 기준을 정의합니다.
페이지 구조 관련 재사용 컴포넌트 목록을 `Page`, `Section`, `PageTitleBar` 구조와 `surface/*` 표현 레이어 기준으로 정리합니다.

## 운영 규칙

- 재사용 표에는 실제 존재하는 경로와 export 이름만 적습니다.
- 페이지 구조는 `layout/Page`, 섹션 구조는 `layout/Section`, 헤더는 `widget/PageTitleBar`를 사용합니다.
- 표현 레이어는 `surface/PageSurface`, `surface/SectionSurface` 실제 경로를 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `surface/PageSurface`, `surface/SectionSurface`를 실제 재사용 자산 목록에 반영 | codex |
| 2026-03-15 | primitive planner의 재사용 컴포넌트 표를 `Page`, `Section`, `PageTitleBar` 실제 경로 기준으로 교체 | codex |
