# AdminLayoutEffects.test 테스트 기획서

> 생성일: 2026-04-16
> 타입: test
> 위치: apps/admin/web/src/app/(admin)/_layout/AdminLayoutEffects.test.tsx

## 역할

`AdminLayoutEffects`가 space bootstrap과 navigation scope checker를 현재 tenant 기준으로 연결하는지 검증합니다.

## 핵심 시나리오

- `@/hooks`의 `useSpaceBootstrap()`이 layout effect 진입 시 호출됩니다.
- `verify-token.hasFullAccess` 값에 맞춰 `navigationStore.setScopeChecker()`가 등록됩니다.
- `useSpaceGuard()`가 alert를 요구하지 않으면 아무것도 렌더링하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | Space bootstrap mock 대상이 @cocrepo/hook에서 admin hook barrel로 이동한 구조를 반영 | codex |
| 2026-04-16 | current tenant scope checker wiring 회귀를 위해 테스트 sidecar를 신규 추가 | codex |
