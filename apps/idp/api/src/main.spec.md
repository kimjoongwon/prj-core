# main util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/main.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 동작 메모

- `ENABLE_NEST_DEVTOOLS=true` 이고 `NODE_ENV !== "production"` 인 경우에만 Nest Devtools snapshot을 활성화합니다.
- IdP API Devtools HTTP 포트 기본값은 `IDP_API_NEST_DEVTOOLS_PORT=8001` 입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | IdP API bootstrap에 dev 전용 Nest Devtools snapshot/로그 출력을 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
