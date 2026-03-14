# Auth Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: controller
> 위치: apps/idp/api/src/module/auth/auth.controller.ts

## 역할

OIDC/OAuth2 기반 인증 흐름의 진입점을 담당합니다. 로그인 리다이렉트, 콜백 처리, 토큰 재발급, 회원가입, 로그아웃을 포함하며, 세션 관리 및 관리자용 감사 로그 조회 기능을 제공합니다. 모든 비즈니스 로직을 `AuthApplicationService`로 위임합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /login | OIDC Authorization 엔드포인트로 리다이렉트 | Public |
| GET | /callback | OIDC 인증 완료 후 Authorization Code 수신 및 토큰 교환 | Public |
| POST | /token/refresh | 리프레시 토큰으로 새 토큰 재발급 | Public (쿠키 기반) |
| POST | /sign-up | 신규 사용자 계정 생성 | Public |
| GET | /verify-token | 액세스 토큰 유효성 검증 | JWT 인증 필요 |
| GET | /my-spaces | 현재 사용자가 접근 가능한 Space 목록 조회 | JWT 인증 필요, SkipSpaceCheck |
| POST | /logout | 로그아웃 및 토큰 무효화 | JWT 인증 필요 |
| GET | /audit-logs | 인증 감사 로그 목록 조회 | FULL_ACCESS, SkipSpaceCheck |
| GET | /audit-logs/stats | 감사 로그 통계 조회 (오늘/전체) | FULL_ACCESS, SkipSpaceCheck |
| POST | /change-password | 현재 비밀번호 확인 후 비밀번호 변경 | JWT 인증 필요, SkipSpaceCheck |
| POST | /users/:userId/unlock | 잠긴 계정 해제 | FULL_ACCESS, SkipSpaceCheck |
| POST | /users/:userId/force-reset-password | 임시 비밀번호 생성 및 이메일 발송 | FULL_ACCESS, SkipSpaceCheck |
| POST | /users/:userId/invalidate-sessions | 사용자 전체 세션 강제 종료 | FULL_ACCESS, SkipSpaceCheck |
| GET | /my-sessions | 내 활성 세션 목록 조회 | JWT 인증 필요, SkipSpaceCheck |
| POST | /my-sessions/:sessionId/revoke | 특정 세션 종료 | JWT 인증 필요, SkipSpaceCheck |
| POST | /my-sessions/revoke-others | 현재 세션 외 모든 세션 종료 | JWT 인증 필요, SkipSpaceCheck |

## 인증/인가

- `@Public()`: 인증 없이 접근 가능한 엔드포인트에 적용 (login, callback, token/refresh, sign-up)
- `@SkipSpaceCheck()`: X-Space-ID 헤더 없이 접근 가능 (my-spaces, change-password, 세션 관리, 관리자 기능)
- `@Roles([SYSTEM_ROLES.FULL_ACCESS])`: 최고 관리자만 접근 가능 (audit-logs, unlock, force-reset, invalidate-sessions)
- `@ApiAuth()`: Bearer Token 또는 Cookie 기반 인증 필요
- 쿠키: `accessToken`, `refreshToken`, `sessionId` 쿠키를 사용하여 세션 관리

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET /login | Query: `returnTo` (string) | 302 리다이렉트 |
| GET /callback | Query: `code`, `state`, `error`, `error_description` | 302 리다이렉트 |
| POST /token/refresh | 쿠키: `refreshToken`, `sessionId` | `TokenRefreshResponseDto` |
| POST /sign-up | `SignUpPayloadDto` | - |
| GET /verify-token | - | `VerifyTokenResponseDto` |
| GET /my-spaces | - | `SpaceDto[]` |
| POST /logout | 쿠키: `accessToken`, `sessionId` | `Boolean` |
| GET /audit-logs | `QueryAuthAuditLogDto` | `AuthAuditLogDto[]` + `PageMetaDto` |
| GET /audit-logs/stats | - | `AuditLogStatsDto` |
| POST /change-password | `ChangePasswordDto` | `Boolean` |
| POST /users/:userId/unlock | Path: `userId` (UUID) | `Boolean` |
| POST /users/:userId/force-reset-password | Path: `userId` (UUID) | `Boolean` |
| POST /users/:userId/invalidate-sessions | Path: `userId` (UUID) | `Boolean` |
| GET /my-sessions | 쿠키: `sessionId` | `AuthSessionInfoDto[]` |
| POST /my-sessions/:sessionId/revoke | Path: `sessionId` | `Boolean` |
| POST /my-sessions/revoke-others | 쿠키: `sessionId` | `Boolean` |

## 비즈니스 규칙

- 콜백 에러 발생 시 `/admin/auth/login?error=...`으로 리다이렉트
- 비밀번호 변경 시 `newPassword !== confirmPassword` 이면 `PASSWORD_MISMATCH` 예외 발생
- 감사 로그 조회는 페이지네이션 지원 (기본 skip=0, take=20)
- 세션은 쿠키 기반으로 관리되며, 로그아웃 시 IDP 측 토큰도 무효화

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `AuthApplicationService` | 인증 유즈케이스 조율 (로그인, 토큰 교환, 세션 관리 등) |
| `AuthApplicationService` (`getAuthAuditLogs`, `getAuthAuditLogStats`) | 감사 로그 조회 및 통계 |
| `ConfigService` | 프론트엔드 도메인 URL 등 환경 설정 |

## 구현 체크리스트

- [x] auth.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("AUTH")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | AuthController 의존성을 AuthApplicationService로 전환 | codex |
| 2026-03-12 | 감사 로그 조회/통계를 `AuthApplicationService`로 위임 정리 | codex |
| 2026-03-12 | 감사 로그 목록 메타 조립을 `AuthApplicationService`로 이관 | codex |
