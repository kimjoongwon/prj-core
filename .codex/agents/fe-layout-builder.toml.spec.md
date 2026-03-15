# fe-layout-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-layout-builder.toml

## 역할

레이아웃 빌더 agent의 최신 프론트엔드 레이아웃 규칙을 정의합니다.
`App > Layout > Page > Section` 계층을 유지하면서 `PageSurface`, `SectionSurface`를 표현 레이어로만 쓰는 규칙을 이 파일에서 고정합니다.

## 운영 규칙

- Layout은 공유 배치와 네비게이션만 담당하고 페이지 고유 title/description/actions는 `page.tsx` 또는 `_client.tsx`에서 처리합니다.
- 실제 구현 경로는 `packages/fe-ui/src/layout/Page`, `packages/fe-ui/src/layout/Section`, `packages/fe-ui/src/widget/PageTitleBar`, `packages/fe-ui/src/surface/*` 기준으로 안내해야 합니다.
- `PageSurface`, `SectionSurface`, `Surface`는 표현 레이어로 제안할 수 있지만 `Page`/`Section`을 대체하는 구조 컴포넌트처럼 설명하면 안 됩니다.
- `layout.tsx` 예시는 `children`을 직접 전달하고, `Page`는 페이지 컴포넌트에서만 사용하는 방향으로 설명합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Surface를 폐기 개념이 아닌 표현 레이어로 재정의하고 `Page` 대체 금지 규칙을 명시 | codex |
| 2026-03-15 | `PageSurface/SectionSurface` 기반 규칙과 예시를 `Page + PageTitleBar + Section` 기준으로 최신화 | codex |
