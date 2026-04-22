# fe-mo-route-layout-builder.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/fe-mo-route-layout-builder.toml

## 역할

`fe-mo-route-layout-builder`를 Expo Router `_layout.tsx` 전용 builder로 정의합니다.
이 role은 모바일 route shell, navigation chrome, screen container ownership을 `apps/mobile/src/app/**/_layout.tsx`에서 구현합니다.

## 운영 규칙

- 기본 출력 대상은 `apps/mobile/src/app/**/_layout.tsx`와 같은 위치의 `_layout.spec.md` 입니다.
- `Stack`, `Tabs`, `Drawer`, `Slot`을 사용해 route shell 을 구현하고 Next.js slot 개념은 사용하지 않습니다.
- safe-area, header, tab bar, drawer, modal presentation ownership을 `_layout.tsx`에서 먼저 결정합니다.
- child screen 은 layout shell 을 재정의하지 않고 content contract 만 소비합니다.
- route layout 구현은 mobile screen planner 가 남긴 shell 계약을 source of truth 로 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | Expo Router `_layout.tsx` active builder 로 승격하고 모바일 shell ownership 규칙을 추가 | codex |
