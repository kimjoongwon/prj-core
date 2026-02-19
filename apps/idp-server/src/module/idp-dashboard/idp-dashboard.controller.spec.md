# IDP Dashboard Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: controller
> 위치: apps/idp-server/src/module/idp-dashboard/idp-dashboard.controller.ts

## 역할

IDP 관리 대시보드에 필요한 통계 데이터를 제공합니다. 활성 세션 현황, 로그인 성공/실패/잠금 통계, 잠금 계정 수 등의 종합 통계와 최근 7일간 일별 로그인 추이를 조회할 수 있습니다. 모든 엔드포인트는 `FULL_ACCESS` 권한이 필요합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /stats | IDP 대시보드 종합 통계 조회 | FULL_ACCESS, SkipSpaceCheck |
| GET | /login-trend | 최근 7일간 일별 로그인 추이 조회 | FULL_ACCESS, SkipSpaceCheck |

## 인증/인가

- 컨트롤러 레벨에서 `@Roles([SYSTEM_ROLES.FULL_ACCESS])`와 `@SkipSpaceCheck()` 적용
- 모든 엔드포인트는 `@ApiAuth()` 필요 (JWT Bearer Token)

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET /stats | - | `DashboardStatsDto` |
| GET /login-trend | - | `LoginTrendItemDto[]` |

## 비즈니스 규칙

- `DashboardStatsDto`: 활성 세션 수, 오늘의 로그인 성공/실패/잠금 건수, 잠금 계정 수를 포함
- `LoginTrendItemDto`: 날짜별 성공/실패 건수를 포함하며 최근 7일 데이터를 반환

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `IdpDashboardService` | 대시보드 통계 및 로그인 추이 집계 로직 |

## 구현 체크리스트

- [x] idp-dashboard.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("IDP_DASHBOARD")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
