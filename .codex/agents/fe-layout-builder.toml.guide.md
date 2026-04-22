# fe-layout-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-layout-builder.toml

## 역할

`fe-layout-builder`를 재사용 Layout primitive 전용 agent로 고정합니다.
대상은 `packages/fe-ui/src/display/layout/**`이며, Next.js `apps/**/layout.tsx`는 범위에서 제외합니다.

## 운영 규칙

- `Layout`은 `packages/fe-ui/src/display/layout/`에 flat하게 두고 `layout/Layout` 중첩 폴더를 만들지 않습니다.
- `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 widget이므로 이 agent 범위에서 제외합니다.
- `PageSurface`, `SectionSurface`, `Surface`는 별도 surface 계층으로 남기고, 이 문서는 구조 primitive와의 조합 가능성만 다룹니다.
- `fe-route-layout-builder`가 실제 route skeleton을 조립하므로, `fe-layout-builder` 문서에는 `layout.tsx` 작성 지시를 남기지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout` flat 구조와 layout shell widget 분리를 반영 | codex |
| 2026-03-21 | `apps/**/layout.tsx` 책임을 분리하고 재사용 Layout primitive 전용 agent로 역할을 축소 | codex |
