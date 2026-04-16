# ConsolePageAccessGate ui 기획서

> 생성일: 2026-04-16
> 타입: ui
> 위치: apps/idp/web/src/app/(console)/_layout/ConsolePageAccessGate.tsx

## 역할

IDP 콘솔에서 현재 pathname이 요구하는 화면 scope를 확인하고, 현재 tenant로 열 수 없는 화면이면 안내 화면으로 대체합니다.

## 규칙

- `matchIdpScreenScopeItem()`으로 현재 pathname의 `scopeKind`와 subject를 찾습니다.
- `persistStore.isSpaceSelectionResolved` 또는 ability 로딩이 끝나지 않았으면 placeholder를 렌더링합니다.
- 현재 ability가 해당 menu subject를 `view`할 수 없으면 접근 거부 화면을 보여줍니다.
- 안내 문구는 `global-full-access-only`와 space-scoped 화면이 current tenant 기준으로 제한된다는 점을 명시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | IDP console screen scope gate sidecar를 신규 추가 | codex |
