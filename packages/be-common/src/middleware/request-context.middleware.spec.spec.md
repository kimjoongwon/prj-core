# request-context.middleware.spec 테스트 기획서

> 생성일: 2026-04-14
> 타입: unit-test
> 위치: packages/be-common/src/middleware/request-context.middleware.spec.ts

## 역할

`RequestContextMiddleware`가 `x-space-id` 헤더와 사용자 tenant 정보를 CLS 컨텍스트에 올바르게 적재하는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | selectedSpace cookie 대신 `x-space-id` 헤더를 기준으로 CLS SPACE_ID/TENANT를 세팅하는 단위 테스트 sidecar를 신규 생성 | codex |
