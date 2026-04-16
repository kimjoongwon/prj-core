# ConsoleLayoutEffects ui 기획서

> 생성일: 2026-04-16
> 타입: ui
> 위치: apps/idp/web/src/app/(console)/_layout/ConsoleLayoutEffects.tsx

## 역할

IDP 콘솔 layout에서 공용 current-space bootstrap과 space alert를 연결합니다.

## 규칙

- `useSpaceBootstrap()`으로 `my-spaces`, `current-space`, `PersistStore`를 동기화합니다.
- 현재 Space가 비어 있으면 console 전용 `useSpaceGuard()` 결과에 따라 `SpaceAlert`를 렌더링합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | IDP console용 current-space bootstrap effect sidecar를 신규 추가 | codex |
