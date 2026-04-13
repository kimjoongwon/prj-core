# req-mo-route-layout-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-route-layout-planner.toml

## 역할

`req-mo-route-layout-planner`를 Expo Router `_layout.spec.md` 전용 planner로 정의합니다.
이 planner는 Stack, Tabs, Drawer, Slot 기반의 route shell 계약과 child screen 소비 규칙을 명세합니다.

## 운영 규칙

- 출력 대상은 `apps/mobile/src/app/**/_layout.spec.md` 입니다.
- `Server Skeleton` 대신 모바일 shell composition, navigation container, modal presentation 계약을 기록합니다.
- Next.js named slot topology 문맥은 사용하지 않고 Expo Router `Stack`, `Tabs`, `Drawer`, `Slot`으로 서술합니다.
- child `index.spec.md`는 `_layout.spec.md`를 소비하는 문서로 정렬됩니다.
- 레이아웃 spec에는 route chrome, 헤더/탭/드로어 ownership, child content contract가 포함되어야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | Expo Router `_layout.spec.md` 전용 planner 신규 추가 | codex |
