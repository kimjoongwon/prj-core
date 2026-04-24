# providers ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: apps/idp/web/src/app/providers.tsx

## 역할

IDP 앱의 Query/AppStore/DesignSystem provider를 조립하고, 현재 tenant 기준 ability/nav scope bootstrap을 수행합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| Providers | 공개 계약 요소 |

## 규칙

- 인증 플로우 경로에서는 tenant verify bootstrap을 건너뛰고 ability/navigation scope를 비웁니다.
- console 경로에서는 `verify-token.hasFullAccess`를 읽어 `navigationStore.setScopeChecker()`로 메뉴 노출 정책을 연결합니다.
- `IDP_NAV_ITEMS`를 `scopeKind` 기준으로 필터링한 뒤 `convertApiToAbilityRules()`로 menu access rule을 구성합니다.

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/client | 기능 구현 의존성 |
| @cocrepo/api/idp/client | 기능 구현 의존성 |
| @cocrepo/api/idp/auth | `verify-token` 기반 인증 세션 확인 및 메뉴 bootstrap |
| @cocrepo/store | ConsoleAppStoreProvider 사용 |
| @cocrepo/ui | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | nuqs Adapter를 app provider에서 직접 import하도록 정리 | codex |
| 2026-04-16 | 현재 tenant FULL_ACCESS 기준 menu ability/bootstrap과 navigation scope checker를 공용 provider에 추가 | codex |
| 2026-03-23 | IDP 콘솔 메뉴 bootstrap 기준을 `my-spaces` 추론에서 `verify-token` 인증 세션 확인으로 정리 | codex |
| 2026-03-23 | nuqs Adapter 의존성을 direct import 기준으로 정리 | codex |
| 2026-03-23 | `/interaction`, `/forgot-password`, `/reset-password`, `/error`를 인증 플로우 경로로 간주해 전역 권한 bootstrap의 401 리다이렉트 루프를 차단 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | 앱 로컬 stores 대신 @cocrepo/store의 ConsoleAppStoreProvider 직접 사용으로 전환 | codex |
| 2026-03-13 | @cocrepo/api root import를 split subpath import로 전환 | codex |
