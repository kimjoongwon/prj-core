# Auth Controller 테스트 기획서

> 생성일: 2026-04-14
> 타입: unit-test
> 위치: apps/idp/api/src/module/auth/auth.controller.spec.ts

## 역할

`AuthController`가 OIDC auth flow, current-space helper, refresh/logout 위임을 올바른 인수 계약으로 `AuthApplicationService`에 전달하는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | `current-space`와 refresh 인수 계약을 selectedSpace cookie 없이 `x-space-id` / body 검증 흐름에 맞춰 정리하며 test sidecar를 신규 생성 | codex |
