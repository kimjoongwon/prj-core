# req-mo-primitive-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-primitive-planner.toml

## 역할

`req-mo-primitive-planner`를 모바일 primitive sidecar spec planner로 정의합니다.
이 planner는 `packages/fe-mo-ui/src/display`, `surface`, `design-system`, 비메뉴 `layout` thin wrapper의 재사용 계약을 정리합니다.

## 운영 규칙

- 출력 대상은 `packages/fe-mo-ui/src/display/**`, `surface/**`, `design-system/**`, 비메뉴 `layout/**`의 `index.spec.md` 입니다.
- 실제 존재하는 모바일 경로와 export 이름만 문서에 기록합니다.
- 웹 HeroUI/Next.js 문맥 대신 RN/Expo, `heroui-native`, safe-area, overlay, gesture 제약을 반영합니다.
- 메뉴 primitive는 별도 `req-mo-menu-planner`가 담당하므로 여기서 중복 정의하지 않습니다.
- surface/provider 경계는 모바일 display contract 일부로 기록합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 display/surface/provider primitive spec planner 신규 추가 | codex |
