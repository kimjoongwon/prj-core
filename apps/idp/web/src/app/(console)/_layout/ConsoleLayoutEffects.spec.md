# ConsoleLayoutEffects ui 기획서

> 생성일: 2026-04-16
> 타입: ui
> 위치: apps/idp/web/src/app/(console)/_layout/ConsoleLayoutEffects.tsx

## 역할

IDP 콘솔 layout에서 앱 소유 current-space bootstrap 조립과 space alert를 연결합니다.

## 규칙

- `useConsoleSpaceBootstrap()`에서 `my-spaces`, `current-space`, console PersistStore를 조립한 뒤 공용 bootstrap hook에 주입합니다.
- 현재 Space가 비어 있으면 console 전용 `useSpaceGuard()` 결과에 따라 `SpaceAlert`를 렌더링합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | Space API/Store 조립 책임을 IDP console layout 내부 hook으로 이관한 구조를 반영 | codex |
| 2026-04-16 | IDP console용 current-space bootstrap effect sidecar를 신규 추가 | codex |
