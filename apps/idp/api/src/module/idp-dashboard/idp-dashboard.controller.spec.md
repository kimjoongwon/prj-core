# IDP Dashboard Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: controller
> 위치: apps/idp/api/src/module/idp-dashboard/idp-dashboard.controller.ts

## 역할

IDP 관리 대시보드 통계 API를 제공하며, 컨트롤러 경계의 응답 조립은 `IdpDashboardFacade`에 위임합니다. 모든 엔드포인트는 `FULL_ACCESS` 권한이 필요합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | `/stats` | IDP 대시보드 종합 통계 조회 | FULL_ACCESS, SkipSpaceCheck |
| GET | `/login-trend` | 최근 7일간 일별 로그인 추이 조회 | FULL_ACCESS, SkipSpaceCheck |

## 인증/인가

- 컨트롤러 레벨에서 `@Roles([SYSTEM_ROLES.FULL_ACCESS])`와 `@SkipSpaceCheck()`를 적용합니다.
- 모든 엔드포인트는 `@ApiAuth()`가 필요합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| idpDashboardFacade | IdpDashboardFacade | 대시보드 통계 및 로그인 추이 boundary 유즈케이스 |

## 비즈니스 메모

- 응답 조립은 Facade가 담당하고 실제 집계 로직은 내부 `IdpDashboardService`가 담당합니다.
- `DashboardStatsDto`와 최근 7일 로그인 추이 응답 계약을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-12 | 컨트롤러 진입점을 `IdpDashboardService`로 정렬 | codex |
| 2026-03-12 | 순수성 기준으로 단일 전달형은 `@cocrepo/service` 직접 주입으로 정리 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `IdpDashboardFacade` 기준으로 갱신 | codex |
