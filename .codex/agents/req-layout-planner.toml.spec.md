# req-layout-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/req-layout-planner.toml

## 역할

`req-layout-planner`를 재사용 Layout primitive spec 전용 planner로 정의합니다.
route `layout.tsx` 설계는 별도 `req-route-layout-planner`가 담당합니다.

## 운영 규칙

- `packages/fe-ui/src/primitive/layout/**`의 flat Layout primitive만 기획합니다.
- `primitive/layout` 아래에 임의 하위 디렉터리를 다시 만들지 않습니다.
- `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 widget 계층으로 분리합니다.
- `App > Layout > Page > Section` 계층과 슬롯 계약을 문서화합니다.
- surface와 route shell 배치는 `req-route-layout-planner`, `req-surface-planner`와 분리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `primitive/layout` flat 구조와 layout shell widget 분리를 반영 | codex |
| 2026-03-21 | route `layout.tsx` 책임을 분리하고 재사용 Layout primitive 전용 planner로 역할을 축소 | codex |
