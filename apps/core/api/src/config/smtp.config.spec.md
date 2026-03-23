# smtp.config util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/core/api/src/config/smtp.config.ts

## 역할

SMTP 환경변수를 검증하고 `smtp` 설정 객체로 등록합니다.
SMTP provider 교체 시에도 공통 env 계약(`host/port/secure/username/password/sender`)을 유지합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| default export | 공개 계약 요소 |

## 환경변수 계약

| 키 | 설명 |
|------|------|
| `SMTP_HOST` | SMTP 서버 호스트 |
| `SMTP_PORT` | SMTP 서버 포트 |
| `SMTP_SECURE` | implicit TLS 사용 여부 (`true`/`false`). legacy/OpenBao 환경에서 키가 없거나 공백이면 `SMTP_PORT=465`일 때만 `true`로 fallback |
| `SMTP_USERNAME` | SMTP 인증 사용자명 |
| `SMTP_PASSWORD` | SMTP 인증 비밀번호 |
| `SMTP_SENDER` | 기본 발신자 주소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `SMTP_SECURE`가 누락되거나 공백인 legacy/OpenBao 환경에서도 부팅이 막히지 않도록 포트 465 fallback 규칙을 validator와 런타임에 동일하게 적용 | codex |
| 2026-03-23 | `SMTP_SECURE` 검증과 공통 SMTP env 계약을 추가해 Resend SMTP 및 추후 provider 교체 구성을 지원 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
