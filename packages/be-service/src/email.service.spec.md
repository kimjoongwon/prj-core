# Email Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/email.service.ts

## 역할

SMTP를 통해 인증 관련 이메일(비밀번호 재설정, 임시 비밀번호 발급)을 발송합니다.
ConfigService에서 smtp 설정을 읽어 Nodemailer 트랜스포터를 생성합니다.
SMTP 설정이 없는 개발 환경에서는 실제 발송 대신 로그만 출력합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `ConfigService` | SMTP 설정값 조회 |
| `nodemailer` | 이메일 발송 라이브러리 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `sendPasswordResetEmail` | `email: string, resetUrl: string` | `Promise<void>` | 비밀번호 재설정 이메일 발송 |
| `sendTemporaryPasswordEmail` | `email: string, tempPassword: string` | `Promise<void>` | 임시 비밀번호 발급 이메일 발송 |

## 비즈니스 규칙

- 트랜스포터는 지연 생성 (최초 발송 시점에 생성)
- SMTP host가 없거나 "localhost"이면 개발 모드로 동작 (로그만 출력)
- 포트 465 사용 시 SSL(secure) 자동 활성화
- 비밀번호 재설정 링크 유효 시간: 30분, 1회 사용 (메일 내용 기준)

## SMTP 설정 환경변수

| 환경변수 | 기본값 | 설명 |
|---------|--------|------|
| `SMTP_HOST` | localhost | SMTP 서버 호스트 |
| `SMTP_PORT` | 587 | SMTP 서버 포트 |
| `SMTP_USERNAME` | - | SMTP 인증 사용자명 |
| `SMTP_PASSWORD` | - | SMTP 인증 비밀번호 |
| `SMTP_SENDER` | noreply@example.com | 발신자 이메일 |

## 에러 처리

| 에러 상황 | 에러 타입 | 처리 방식 |
|----------|-----------|-----------|
| 이메일 발송 실패 | `Error` | 에러 로그 후 상위로 throw |

## 권한 요구사항

- 내부 서비스 전용 (UsersService에서 호출)

## 구현 체크리스트

- [x] email.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
