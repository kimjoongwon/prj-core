# main util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/core/api/src/main.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 동작 메모

- `build`는 애플리케이션을 실행하지 않고 TypeScript 산출물만 생성해야 합니다.
- HMR/webpack 기반 실행은 개발 명령(`start:dev`, `start:debug`)에서만 사용합니다.
- `ENABLE_NEST_DEVTOOLS=true` 이고 `NODE_ENV !== "production"` 인 경우에만 Nest Devtools snapshot을 활성화합니다.
- Core API Devtools HTTP 포트 기본값은 `CORE_API_NEST_DEVTOOLS_PORT=8000` 입니다.
- Swagger OAuth2 초기화는 first-party OIDC `clientId` 명명 규칙에 맞춰 `swagger-web`을 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Swagger OAuth2 clientId를 `swagger-web`으로 정리하고 관련 bootstrap 메모를 추가 | codex |
| 2026-03-14 | Core API bootstrap에 dev 전용 Nest Devtools snapshot/로그 출력을 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-08 | build 시 webpack 런타임 실행이 섞이지 않도록 빌드/개발 실행 책임을 분리 | codex |
