# req-mo-menu-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-menu-planner.toml

## 역할

`req-mo-menu-planner`를 모바일 navigation/menu contract planner로 정의합니다.
이 planner는 Expo Router navigation tree와 `packages/fe-mo-ui/src/layout/Menu|SubMenu/**`의 menu primitive 계약을 연결합니다.

## 운영 규칙

- 앱 레벨 navigation tree는 `apps/mobile/src/app/app.spec.md`에 기록합니다.
- Menu/SubMenu 재사용 계약이 필요한 경우에만 `packages/fe-mo-ui/src/layout/Menu/**`, `SubMenu/**` spec 을 추가합니다.
- 웹 `admin-menu.spec.md`나 Next.js sidebar 문맥은 사용하지 않습니다.
- Tabs, Drawer, overlay menu, context action menu 같은 모바일 navigation pattern을 우선 기록합니다.
- 메뉴 spec에는 route 이동 방식, icon/label 규칙, selection state, disabled/hidden 조건이 포함되어야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 navigation tree 와 Menu/SubMenu contract planner 신규 추가 | codex |
