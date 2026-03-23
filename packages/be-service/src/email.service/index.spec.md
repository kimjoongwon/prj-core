# Email Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-23
> 타입: service
> 위치: packages/be-service/src/email.service/index.ts

## 역할

인증 관련 이메일 유즈케이스와 실제 전송 구현을 분리합니다.
`EmailService`는 비밀번호 재설정/임시 비밀번호 발급 같은 메일 내용을 템플릿 코드 기준으로 렌더링하고,
실제 전송은 `EmailProvider` 추상 token을 통해 위임합니다.
기본 구현체는 `SmtpEmailProvider`이며 `ConfigService`에서 smtp 설정을 읽어 Nodemailer 트랜스포터를 생성합니다.
SMTP 설정이 없는 개발 환경에서는 실제 발송 대신 로그만 출력합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `EmailProvider` | 메일 전송 구현 위임 |
| `TemplateService` | 저장된 템플릿 코드 렌더링 |
| `ConfigService` | (`SmtpEmailProvider`) SMTP 설정값 조회 |
| `nodemailer` | 이메일 발송 라이브러리 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `sendEmail` | `EmailSendInput` | `Promise<void>` | 공통 메일 발송 위임 |
| `sendPasswordResetEmail` | `email: string, resetUrl: string, expiresInMinutes?: number` | `Promise<void>` | 비밀번호 재설정 이메일 발송 |
| `sendTemporaryPasswordEmail` | `email: string, tempPassword: string` | `Promise<void>` | 임시 비밀번호 발급 이메일 발송 |

## 비즈니스 규칙

- `EmailService`는 provider 종류를 모른 채 `EmailProvider` 추상 계약만 사용합니다.
- `EmailService`는 `AUTH_PASSWORD_RESET`, `AUTH_TEMPORARY_PASSWORD` 템플릿 코드를 조회해 메일 제목/본문을 렌더링합니다.
- 렌더링 결과가 `EMAIL` 유형이 아니거나 제목이 비어 있으면 예외를 발생시킵니다.
- `SmtpEmailProvider`가 SMTP 세부 구현(transport 생성, sender 주입, 로그)을 담당합니다.
- 트랜스포터는 지연 생성 (최초 발송 시점에 생성)
- SMTP host가 없거나 "localhost"이면 개발 모드로 동작 (로그만 출력)
- transport의 TLS 모드는 `smtp.secure` 설정을 기준으로 결정합니다.
- legacy/OpenBao 환경에서 `SMTP_SECURE`가 없거나 공백일 때만 포트 `465`를 fallback 규칙으로 사용합니다.
- 비밀번호 재설정 링크 유효 시간: 30분, 1회 사용 (메일 내용 기준)

## SMTP 설정 환경변수

| 환경변수 | 기본값 | 설명 |
|---------|--------|------|
| `SMTP_HOST` | localhost | SMTP 서버 호스트 |
| `SMTP_PORT` | 587 | SMTP 서버 포트 |
| `SMTP_SECURE` | false | implicit TLS 사용 여부 |
| `SMTP_USERNAME` | - | SMTP 인증 사용자명 |
| `SMTP_PASSWORD` | - | SMTP 인증 비밀번호 |
| `SMTP_SENDER` | noreply@example.com | 발신자 이메일 |

## 에러 처리

| 에러 상황 | 에러 타입 | 처리 방식 |
|----------|-----------|-----------|
| 이메일 발송 실패 | `Error` | 에러 로그 후 상위로 throw |
| 템플릿 유형 오류 | `BadRequestException` | EMAIL 유형이 아니면 발송 중단 |
| 템플릿 제목 누락 | `BadRequestException` | 제목 없는 EMAIL 템플릿 발송 차단 |

## 권한 요구사항

- 내부 서비스 전용

## 구현 체크리스트

- [x] `EmailProvider` 추상 token
- [x] `SmtpEmailProvider` 구현체
- [x] `EmailService` 유즈케이스 래퍼
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `SMTP_SECURE` 공백값도 legacy 누락과 동일하게 취급해 SMTP 설정 validator와 provider fallback 규칙이 어긋나지 않도록 정리 | codex |
| 2026-03-23 | `EmailService -> EmailProvider -> SmtpEmailProvider` 구조로 분리해 상위 유즈케이스가 SMTP 구현 세부사항에 직접 결합되지 않도록 정리 | codex |
| 2026-03-23 | `SMTP_SECURE` 설정을 추가해 Resend SMTP 연동과 향후 SMTP provider 교체 시 env 계약만으로 transport를 전환하도록 정리 | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `email.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
