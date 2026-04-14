# space-scope.e2e-spec 기획서

> 생성일: 2026-04-14
> 타입: e2e
> 위치: apps/core/api/test/space-scope.e2e-spec.ts

## 역할

Space scope 계산이 `x-space-id` 헤더와 현재 Tenant 역할에 맞게 동작하는지 검증합니다.

## 시나리오

| ID | 설명 |
|----|------|
| E2E-001 | 비 FULL_ACCESS 사용자는 `x-space-id` 1개만 `EFFECTIVE_SPACE_IDS`로 사용해야 함 |
| E2E-002 | FULL_ACCESS 사용자는 전체 조회 scope를 열어야 함 |
| E2E-003 | Repository 호출이 현재 scope에 맞는 `spaceIds`로 전달되어야 함 |
| E2E-004 | 접근 불가한 `x-space-id`는 403으로 차단되어야 함 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | selectedSpace 쿠키 기반 시나리오를 `x-space-id` 헤더 기반 Space scope 검증으로 문서화하며 sidecar를 신규 생성 | codex |
