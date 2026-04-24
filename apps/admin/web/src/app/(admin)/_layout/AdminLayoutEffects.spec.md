# AdminLayoutEffects ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: apps/admin/web/src/app/(admin)/_layout/AdminLayoutEffects.tsx

## 역할

admin 공통 layout에서 앱 소유 space bootstrap hook, space alert, 현재 tenant 기반 navigation scope checker를 연결합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AdminLayoutEffects | 공개 계약 요소 |

## 규칙

- `@/hooks`의 `useSpaceBootstrap()`으로 `my-spaces` / `current-space` / admin `PersistStore`를 앱 레이어에서 bootstrap합니다.
- `verify-token.hasFullAccess`와 `isScopeKindAccessible()`를 조합해 `navigationStore.setScopeChecker()`를 등록합니다.
- 현재 Space가 선택되지 않았으면 `SpaceAlert`를 렌더링합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | Space bootstrap API/Store 조립 책임을 admin hook으로 이관한 구조를 반영 | codex |
| 2026-04-16 | admin layout effect가 공용 space bootstrap과 current tenant scope checker를 연결하도록 갱신 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
