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
| GET | /login | `clientId` 기준 OIDC Authorization 엔드포인트로 리다이렉트 | Public |
| GET | /callback | `clientId` 기준 OIDC 인증 완료 후 Authorization Code 수신 및 토큰 교환 | Public |
| POST | /token/refresh | 리프레시 토큰으로 새 토큰 재발급 | Public (쿠키 기반) |
| POST | /sign-up | 신규 사용자 계정 생성 | Public |
| GET | /verify-token | 액세스 토큰 유효성 검증 + `FULL_ACCESS` tenant role 보유 여부 반환 | JWT 인증 필요, SkipSpaceCheck |
| GET | /my-spaces | 현재 사용자가 접근 가능한 Space 목록 조회 | JWT 인증 필요, SkipSpaceCheck |
| GET | /current-space | 요청의 `x-space-id` 또는 기본 접근 가능 Space 조회 | JWT 인증 필요, SkipSpaceCheck |
| POST | /current-space | 현재 선택할 Space 검증 | JWT 인증 필요, SkipSpaceCheck |
| POST | /logout | 로그아웃 및 토큰 무효화 | JWT 인증 필요 |
| GET | /audit-logs | 인증 감사 로그 목록 조회 | JWT + 현재 tenant scope |
| GET | /audit-logs/stats | 감사 로그 통계 조회 (오늘/전체) | JWT + 현재 tenant scope |
| POST | /change-password | 현재 비밀번호 확인 후 비밀번호 변경 | JWT 인증 필요, SkipSpaceCheck |
| POST | /users/:userId/unlock | 잠긴 계정 해제 | FULL_ACCESS, SkipSpaceCheck |
| POST | /users/:userId/force-reset-password | 임시 비밀번호 생성 및 이메일 발송 | FULL_ACCESS, SkipSpaceCheck |
| POST | /users/:userId/invalidate-sessions | 사용자 전체 세션 강제 종료 | FULL_ACCESS, SkipSpaceCheck |
| GET | /my-sessions | 내 활성 세션 목록 조회 | JWT 인증 필요, SkipSpaceCheck |
| POST | /my-sessions/:sessionId/revoke | 특정 세션 종료 | JWT 인증 필요, SkipSpaceCheck |
| POST | /my-sessions/revoke-others | 현재 세션 외 모든 세션 종료 | JWT 인증 필요, SkipSpaceCheck |

## 인증/인가

- `@Public()`: 인증 없이 접근 가능한 엔드포인트에 적용 (login, callback, token/refresh, sign-up)
- `@SkipSpaceCheck()`: X-Space-ID 헤더 없이 접근 가능 (verify-token, my-spaces, change-password, 세션 관리, 관리자 기능)
- `@Roles([SYSTEM_ROLES.FULL_ACCESS])`: 최고 관리자만 접근 가능 (unlock, force-reset, invalidate-sessions)
- `@ApiAuth()`: Bearer Token 또는 Cookie 기반 인증 필요
- 쿠키: `accessToken`, `refreshToken`, `sessionId` 쿠키를 사용하여 세션 관리

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET /login | Query: `clientId`, `returnTo` | 302 리다이렉트 |
| GET /callback | Query: `clientId`, `code`, `state`, `error`, `error_description` | 302 리다이렉트 |
| POST /token/refresh | 쿠키: `refreshToken`, `sessionId` | `TokenRefreshResponseDto` |
| POST /sign-up | `SignUpPayloadDto` | - |
| GET /verify-token | - | `VerifyTokenResponseDto` (`valid`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `hasFullAccess`) |
| GET /my-spaces | - | `SpaceDto[]` |
| GET /current-space | Header: `x-space-id`(optional) | `SpaceDto \| null` |
| POST /current-space | `SetCurrentSpaceDto` | `SpaceDto` |
| POST /logout | 쿠키: `accessToken`, `sessionId` | `Boolean` |
| GET /audit-logs | `QueryAuthAuditLogDto` + Header `x-space-id` | `AuthAuditLogDto[]` + `PageMetaDto` |
| GET /audit-logs/stats | Header `x-space-id` | `AuditLogStatsDto` |
| POST /change-password | `ChangePasswordDto` | `Boolean` |
| POST /users/:userId/unlock | Path: `userId` (UUID) | `Boolean` |
| POST /users/:userId/force-reset-password | Path: `userId` (UUID) | `Boolean` |
| POST /users/:userId/invalidate-sessions | Path: `userId` (UUID) | `Boolean` |
| GET /my-sessions | 쿠키: `sessionId` | `AuthSessionInfoDto[]` |
| POST /my-sessions/:sessionId/revoke | Path: `sessionId` | `Boolean` |
| POST /my-sessions/revoke-others | 쿠키: `sessionId` | `Boolean` |

## 비즈니스 규칙

- 로그인 시작은 `clientId` 쿼리로 구분하며, 앱별 login shell URL은 `AuthApplicationService.getClientRedirects()`로 조회합니다.
- 콜백 에러 발생 시에도 `clientId`에 맞는 login shell URL로 `?error=...`를 붙여 리다이렉트합니다.
- 성공 시에는 `AuthApplicationService.handleOidcCallback()`이 돌려준 `returnTo`를 우선 사용하고, 없으면 `defaultReturnTo`를 사용합니다.
- Storybook login shell도 canonical `clientId=storybook-web`을 사용합니다.
- `GET /verify-token`의 `hasFullAccess`는 현재 `x-space-id`로 해석된 tenant role이 `FULL_ACCESS`인지 여부를 의미합니다.
- `GET /current-space`는 `x-space-id` 헤더가 유효하면 해당 Space를 반환하고, 없거나 접근 불가하면 접근 가능한 tenant 순서 기준 기본 Space를 반환합니다.
- `POST /current-space`는 더 이상 Space 쿠키를 설정하지 않고, body의 `spaceId`를 검증한 결과만 반환합니다.
- 비밀번호 변경 시 `newPassword !== confirmPassword` 이면 `PASSWORD_MISMATCH` 예외 발생
- 감사 로그 조회는 페이지네이션을 지원하며, 비 FULL_ACCESS tenant에서는 현재 `x-space-id` 범위의 사용자 로그만 조회합니다.
- 세션은 쿠키 기반으로 관리되며, 로그아웃 시 IDP 측 토큰도 무효화

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `AuthApplicationService` | 인증 유즈케이스 조율 (로그인, 토큰 교환, 세션 관리 등) |
| `AuthApplicationService` (`getAuthAuditLogs`, `getAuthAuditLogStats`) | 감사 로그 조회 및 통계 |

## 구현 체크리스트

- [x] auth.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("AUTH")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | `current-space` 기본 선택이 FULL_ACCESS tenant 우선이 아니라 접근 가능 tenant 순서를 따른다는 점을 명시 | codex |
| 2026-04-16 | 감사 로그 API를 FULL_ACCESS 전용 전역 조회에서 현재 tenant scope API로 정정 | codex |
| 2026-04-15 | `GET /verify-token`의 `hasFullAccess` 의미를 `manage all`이 아니라 tenant role `FULL_ACCESS` 기준으로 단순화 | codex |
| 2026-04-14 | `current-space`를 `x-space-id` 검증 API로 재정의하고 selectedSpace 쿠키 설명을 제거 | codex |
| 2026-04-14 | Storybook login/callback canonical clientId를 `storybook-web`으로 정리 | codex |
| 2026-04-06 | `GET /verify-token`의 `hasFullAccess` 의미를 tenant 역할명이 아닌 `manage all` 전역 권한으로 갱신 | codex |
| 2026-03-25 | login/callback을 clientId 기반 generic route로 정리 | codex |
| 2026-03-23 | `GET /verify-token` 응답 계약에 `hasFullAccess`를 추가하고 IDP 웹 메뉴 bootstrap 근거를 명시 | codex |
| 2026-03-16 | Storybook RP 식별 기준을 `clientId` 계약으로 단순화해 login/callback redirect 표현을 정리 | codex |
| 2026-03-16 | Storybook 세션 검증을 위해 `GET /verify-token`에도 `SkipSpaceCheck`를 적용하고 문서 반영 | codex |
| 2026-03-16 | storybook 전용 login/callback 엔드포인트와 RP별 에러/성공 redirect 규칙을 추가 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | AuthController 의존성을 AuthApplicationService로 전환 | codex |
| 2026-03-12 | 감사 로그 조회/통계를 `AuthApplicationService`로 위임 정리 | codex |
| 2026-03-12 | 감사 로그 목록 메타 조립을 `AuthApplicationService`로 이관 | codex |
