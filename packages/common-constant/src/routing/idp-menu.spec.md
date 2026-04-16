# idp-menu util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-constant/src/routing/idp-menu.ts

## 역할

IDP 콘솔의 메뉴/화면 catalog를 정의하고, 각 화면이 현재 tenant 기준으로 어떤 scope 정책을 따르는지 함께 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| IDP_PATHS | 공개 계약 요소 |
| IDP_SUBJECTS | 공개 계약 요소 |
| IDP_NAV_ITEMS | 메뉴별 `scopeKind`를 포함한 1depth 네비게이션 계약 |
| IDP_SCREEN_SCOPE_ITEMS | pathname과 subject, scopeKind를 연결하는 화면 접근 카탈로그 |
| matchIdpScreenScopeItem | 현재 pathname에 대응하는 화면 scope 항목 탐색 유틸 |
| IDP_BOTTOM_TAB_IDS | 공개 계약 요소 |

## 규칙

- `dashboard`, `oidc-clients`, `oidc-sessions`, `security-policy`는 `global-full-access-only` 화면으로 분류합니다.
- `accounts`, `auth-audit-logs`는 현재 tenant의 사용자/tenant 관계 범위를 따르는 `tenant-user` 화면으로 분류합니다.
- matcher는 정적 경로를 동적 경로보다 먼저 평가해 `/oidc-clients/new`가 상세 route로 흡수되지 않도록 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | IDP 메뉴/화면에 `scopeKind`와 screen scope matcher를 추가해 공용 접근 정책 catalog로 확장 | codex |
| 2026-03-23 | 모바일/좁은 뷰포트에서 IDP 메뉴가 완전히 사라지지 않도록 `IDP_BOTTOM_TAB_IDS`를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
