# IDP Dashboard Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/idp/api/src/module/idp-dashboard/idp-dashboard.module.ts

## 역할

`IdpDashboardController`가 `IdpDashboardFacade`를 주입받도록 facade/service provider를 조합합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| IdpDashboardFacade | Controller boundary 유즈케이스 및 응답 조립 |
| IdpDashboardService | 대시보드 통계 집계 로직 |

## exports

| export | 설명 |
|--------|------|
| IdpDashboardFacade | 다른 모듈이 참조할 수 있는 IDP dashboard boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | `IdpDashboardFacade`가 사용하는 `IdpDashboardService` provider를 module wiring에 복구 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-12 | 컨트롤러를 `IdpDashboardService` 기반으로 변경 | codex |
| 2026-03-12 | `module` 체크리스트를 `@cocrepo/service` 직접 주입 정합성 기준으로 갱신 | codex |
| 2026-03-13 | IdpDashboardModule boundary provider/export를 `IdpDashboardFacade` 기준으로 갱신 | codex |
