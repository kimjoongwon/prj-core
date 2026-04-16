# navigationStore.test 테스트 기획서

> 생성일: 2026-04-16
> 타입: test
> 위치: packages/fe-store/src/stores/__tests__/navigationStore.test.ts

## 역할

`NavItem`과 `NavigationStore`의 경로 선택, 권한 필터링, scope 필터링 회귀를 검증합니다.

## 핵심 시나리오

- NavItem이 child/path/active 상태를 올바르게 관리합니다.
- NavigationStore가 ability checker로 menu tree를 필터링합니다.
- `scopeChecker`가 `global-full-access-only` child를 숨기면 visible tree와 subNavItems가 함께 정리됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | 현재 tenant scope 기반 menu filtering 회귀를 위해 테스트 sidecar를 신규 추가 | codex |
