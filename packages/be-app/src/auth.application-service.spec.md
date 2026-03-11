# auth.application-service 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-app/src/auth.application-service.ts

## 역할

인증 유즈케이스를 조합하는 application service를 정의합니다. 외부 OIDC 프로토콜 호출은 `OidcFacade`로 분리합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AuthApplicationService | 인증 유즈케이스 공개 계약 |
| OidcFacade | 외부 OIDC 연동 dependency |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | 기존 인증 조합 레이어를 AuthApplicationService와 OidcFacade로 분리 | codex |
