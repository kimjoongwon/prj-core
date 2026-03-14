# Password Reset Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: controller
> 위치: apps/idp/api/src/module/password-reset/password-reset.controller.ts

## 역할

비밀번호 찾기/재설정 흐름의 API를 제공합니다. 비밀번호 정책 조회, 재설정 이메일 발송, 토큰 유효성 검증, 실제 비밀번호 변경을 처리합니다. 모든 엔드포인트는 `@Public()`으로 인증 없이 접근 가능합니다. idp-client(Next.js) 비밀번호 재설정 페이지가 이 API를 호출합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/password-policy | 비밀번호 정책 조회 (최소 길이, 대소문자 필수 여부 등) | Public |
| POST | /api/forgot-password | 비밀번호 재설정 이메일 발송 요청 | Public |
| GET | /api/reset-password/:token | 재설정 토큰 유효성 검증 | Public |
| POST | /api/reset-password/:token | 토큰 검증 후 새 비밀번호 설정 | Public |

## 인증/인가

- 컨트롤러 레벨에서 `@Public()` 적용 — 모든 엔드포인트 인증 불필요
- 비밀번호 재설정 토큰은 이메일 링크에 포함된 일회용 토큰으로 인증 대체

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET /api/password-policy | - | `PasswordPolicyDto` (minLength, maxLength, requireUppercase 등) |
| POST /api/forgot-password | Body: `{ email: string }` | `ForgotPasswordResultDto` (항상 성공 응답) |
| GET /api/reset-password/:token | Path: `token` | `TokenValidationDto` (valid, email, reason) |
| POST /api/reset-password/:token | Path: `token`, Body: `{ password, confirmPassword }` | `ResetPasswordResultDto` 또는 `ResetPasswordErrorDto` (400) |

## 비즈니스 규칙

- 이메일 발송 요청 시 이메일 존재 여부와 관계없이 동일한 성공 응답 반환 (이메일 열거 공격 방지)
- 비밀번호 확인 불일치 시 즉시 400 `PASSWORD_MISMATCH` 반환
- 토큰 만료(TOKEN_EXPIRED), 비밀번호 정책 위반(PASSWORD_POLICY_VIOLATION), 비밀번호 재사용(PASSWORD_REUSE) 에러는 400으로 반환
- 기타 서버 오류는 500으로 처리

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `PasswordResetFacade` | 토큰 생성/검증, 이메일 발송, 비밀번호 변경 비즈니스 로직 |

## 구현 체크리스트

- [x] password-reset.controller.ts
- [x] `@Controller("api")` 데코레이터
- [x] `@ApiTags("Password Reset")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | PasswordResetController가 PasswordResetService 직접 주입에서 PasswordResetFacade로 전환 | codex |
