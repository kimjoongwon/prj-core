# Password Reset ApplicationService 기획서

> 생성일: 2026-03-12
> 수정일: 2026-03-12
> 타입: application-service
> 위치: apps/idp/api/src/module/password-reset/password-reset.application-service.ts

## 역할

PasswordResetController의 공개 API 흐름을 오케스트레이션합니다.
비밀번호 정책 조회, 재설정 요청, 토큰 검증, 비밀번호 변경 수행을 기존 서비스로 위임합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `PasswordResetService` | 토큰 발급/검증 및 비밀번호 변경 핵심 로직 수행 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| `getPasswordPolicy` | 비밀번호 정책 조회 |
| `requestReset` | 비밀번호 재설정 요청 처리 |
| `validateToken` | 재설정 토큰 유효성 검증 |
| `executeReset` | 토큰 기반 비밀번호 변경 실행 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | PasswordResetController 직접 주입 정리를 위한 PasswordResetApplicationService 신규 생성 | codex |
