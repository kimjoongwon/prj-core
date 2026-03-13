# Interaction Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: controller
> 위치: apps/idp/api/src/module/interaction/interaction.controller.ts

## 역할

OIDC Authorization Code Flow에서 사용자와의 상호작용(로그인, 동의, 취소)을 처리하는 JSON API 컨트롤러입니다. idp-client(Next.js)가 프론트엔드 UI를 렌더링하고, 이 컨트롤러는 인터랙션 데이터 제공 및 결과 처리만 담당합니다. 모든 엔드포인트는 `@Public()`으로 인증 없이 접근 가능합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/interaction/:uid | 인터랙션 데이터 조회 (type: login 또는 consent) | Public |
| POST | /api/interaction/:uid/login | 사용자 로그인 처리 | Public |
| POST | /api/interaction/:uid/confirm | 사용자 동의(Consent) 처리 | Public |
| POST | /api/interaction/:uid/abort | 인증 흐름 취소 처리 | Public |

## 인증/인가

- 컨트롤러 레벨에서 `@Public()` 적용 — 모든 엔드포인트 인증 불필요
- oidc-provider가 발급한 interaction `uid`로 세션 상태를 관리
- Express 요청을 KoaLike 인터페이스로 변환하여 oidc-provider에 전달

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET /api/interaction/:uid | Path: `uid` | `InteractionDataDto` (type, uid, client, prompt, params, session, isDev) |
| POST /api/interaction/:uid/login | `OidcLoginPayloadDto` (email, password, remember) | `LoginSuccessDto` (redirectTo, mustChangePassword) 또는 `LoginErrorDto` (error, remainingAttempts, lockedUntil 등) |
| POST /api/interaction/:uid/confirm | Path: `uid` | `ConsentResultDto` (redirectTo) |
| POST /api/interaction/:uid/abort | Path: `uid` | `AbortResultDto` (redirectTo) |

## 비즈니스 규칙

- `uid`는 oidc-provider가 생성한 인터랙션 세션 고유 ID
- 로그인 실패 시 HTTP 상태 코드로 구분:
  - 401: `INVALID_CREDENTIALS` (잘못된 이메일/비밀번호)
  - 403: `ACCOUNT_LOCKED_TEMPORARY` 또는 `ACCOUNT_LOCKED_PERMANENT`
- 상대 경로 리다이렉트 URL은 issuer URL을 기반으로 절대 경로로 변환
- 클라이언트 IP는 `X-Forwarded-For` 헤더 우선 추출
- 개발 환경(`isDev`) 여부를 인터랙션 데이터에 포함

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `InteractionFacade` | 사용자 인증, 인터랙션 조회, 로그인 완료, 동의 처리, 취소 처리 |
| `ConfigService` | OIDC issuer URL, IDP 클라이언트 URL 설정 |

## 구현 체크리스트

- [x] interaction.controller.ts
- [x] `@Controller("api/interaction")` 데코레이터
- [x] `@ApiTags("Interaction")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | InteractionController가 InteractionService 대신 InteractionFacade 주입으로 변경 | codex |
