# oidc.config util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/config/oidc.config.ts

## 역할

OIDC provider/client 설정 계약을 정의하며, `OidcFacade`가 소비하는 설정 소스입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| JwksKeys | 공개 계약 요소 |
| OidcConfig | 공개 계약 요소 |
| oidcConfig | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | OIDC 설정 소비자를 OidcFacade 기준으로 명시 | codex |
