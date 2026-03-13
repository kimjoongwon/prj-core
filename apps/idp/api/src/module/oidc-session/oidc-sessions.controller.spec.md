# OIDC Sessions Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: controller
> 위치: apps/idp/api/src/module/oidc-session/oidc-sessions.controller.ts

## 역할

Redis에 저장된 OIDC 세션 및 토큰을 관리하는 관리자용 API를 제공합니다. 세션/토큰 목록 조회, 통계 확인, 개별 폐기, 전체 일괄 폐기, Grant 단위 일괄 폐기 기능을 지원합니다. 모든 엔드포인트는 `FULL_ACCESS` 권한이 필요합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | / | OIDC 세션/토큰 목록 조회 (모델 타입 및 계정 ID 필터) | FULL_ACCESS, SkipSpaceCheck |
| GET | /stats | 모델 타입별 세션/토큰 건수 통계 | FULL_ACCESS, SkipSpaceCheck |
| POST | /:key/revoke | 특정 세션 또는 토큰 폐기 | FULL_ACCESS, SkipSpaceCheck |
| POST | /revoke-all | 전체 세션/토큰 일괄 폐기 | FULL_ACCESS, SkipSpaceCheck |
| POST | /revoke-by-grant/:grantId | 특정 Grant에 연결된 세션/토큰 일괄 폐기 | FULL_ACCESS, SkipSpaceCheck |

## 인증/인가

- 컨트롤러 레벨에서 `@Roles([SYSTEM_ROLES.FULL_ACCESS])`와 `@SkipSpaceCheck()` 적용
- 모든 엔드포인트는 `@ApiAuth()` 필요

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET / | `QueryOidcSessionDto` (Query) | `OidcSessionDto[]` + `PageMetaDto` |
| GET /stats | - | `OidcSessionStatsDto` |
| POST /:key/revoke | Path: `key` (jti 또는 uid) | 204 No Content |
| POST /revoke-all | - | 204 No Content |
| POST /revoke-by-grant/:grantId | Path: `grantId` | 204 No Content |

## 비즈니스 규칙

- Redis에서 직접 세션/토큰 데이터를 조회하고 폐기
- `key` 파라미터는 jti(JWT ID) 또는 uid(인터랙션 ID)
- `revoke-all`은 모든 OIDC 세션/토큰을 삭제하므로 전체 로그아웃 효과
- Grant 폐기 시 해당 Grant에 연결된 모든 Access Token, Refresh Token도 함께 폐기
- 목록 조회는 모델 타입(Session, AccessToken, RefreshToken 등) 및 계정 ID 필터링 지원

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `OidcSessionFacade` | 목록 메타 조립 및 OIDC 세션 관리 controller boundary |

## 구현 체크리스트

- [x] oidc-sessions.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("OIDC_SESSIONS")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-12 | 컨트롤러 진입점을 `OidcSessionService`로 정렬 | codex |
| 2026-03-12 | 순수성 기준으로 단일 전달형은 `@cocrepo/service` 직접 주입으로 정리 | codex |
| 2026-03-12 | 목록 응답의 페이지 메타 조립을 ApplicationService로 이관 | codex |
| 2026-03-13 | controller boundary 조합을 `OidcSessionFacade`로 이관 | codex |
