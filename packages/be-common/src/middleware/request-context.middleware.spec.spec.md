# request-context.middleware.spec 테스트 기획서

> 생성일: 2026-04-14
> 타입: unit-test
> 위치: packages/be-common/src/middleware/request-context.middleware.spec.ts

## 역할

`RequestContextMiddleware`가 `x-space-id` 헤더와 사용자 tenant 정보를 CLS 컨텍스트에 올바르게 적재하는지 검증합니다.

## 시나리오

- 기본 매칭: `x-space-id`와 일치하는 tenant를 CLS `TENANT`에 저장합니다.
- 중복 매칭: 같은 `spaceId`에 중복 tenant가 있어도 `x-space-id`에 매칭되는 tenant를 그대로 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | 동일 `spaceId`의 mirrored `FULL_ACCESS`보다 일반 tenant를 우선하는 회귀 시나리오를 추가 | codex |
| 2026-04-16 | `resolveCurrentTenantForSpace`의 mirrored 예외 규칙을 제거하고 단일 매칭 시나리오로 정리 | codex |
| 2026-04-14 | selectedSpace cookie 대신 `x-space-id` 헤더를 기준으로 CLS SPACE_ID/TENANT를 세팅하는 단위 테스트 sidecar를 신규 생성 | codex |
