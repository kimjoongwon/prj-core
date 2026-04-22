# fe-menu-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-menu-builder.toml

## 역할

메뉴 시스템 builder agent가 메뉴 contract와 route skeleton 책임을 혼동하지 않도록 기준을 정의합니다.
실제 `layout.tsx` 파일 작성은 `fe-route-layout-builder`가 담당하고, `fe-menu-builder`는 탭/사이드바/FAB contract와 재사용 메뉴 UI를 제공합니다.

## 운영 규칙

- `fe-menu-builder`는 `layout.tsx` 파일 자체를 작성하지 않고, route layout이 소비할 탭/메뉴 contract를 제공합니다.
- 3depth 탭은 route `layout.tsx` skeleton 안에서 한 번만 렌더링된다고 설명합니다.
- title/description/actions의 실제 owner는 `req-route-layout-planner`와 `req-page-planner` 계약을 따르며, 메뉴 builder가 임의로 고정하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `layout.tsx` 작성 책임을 `fe-route-layout-builder`로 분리하고 메뉴 contract 소비 모델로 정리 | codex |
