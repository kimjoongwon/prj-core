# IDP Dashboard Facade 기획서

> 생성일: 2026-03-13
> 타입: facade
> 위치: packages/be-facade/src/idp-dashboard.facade.ts

## 역할

IDP 대시보드 controller가 필요한 통계/추이 조회 진입점을 단일 facade로 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| IdpDashboardFacade | IDP 대시보드 boundary 조합 진입점 |
| IdpDashboardService | 대시보드 통계 및 로그인 추이 도메인 서비스 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | IdpDashboardApplicationService를 facade로 이관 | codex |
