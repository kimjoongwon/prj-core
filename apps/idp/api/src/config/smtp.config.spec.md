# smtp.config util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/config/smtp.config.ts

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
| `SMTP_SECURE` | implicit TLS 사용 여부 (`true`/`false`) |
| `SMTP_USERNAME` | SMTP 인증 사용자명 |
| `SMTP_PASSWORD` | SMTP 인증 비밀번호 |
| `SMTP_SENDER` | 기본 발신자 주소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `SMTP_SECURE` 검증과 공통 SMTP env 계약을 추가해 Resend SMTP 및 추후 provider 교체 구성을 지원 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
