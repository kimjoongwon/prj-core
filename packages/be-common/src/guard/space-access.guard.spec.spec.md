# space-access.guard.spec 테스트 기획서

> 생성일: 2026-04-14
> 타입: unit-test
> 위치: packages/be-common/src/guard/space-access.guard.spec.ts

## 역할

`SpaceAccessGuard`가 `x-space-id` 헤더 누락과 tenant 미매칭 상황을 올바르게 차단하는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | selectedSpace cookie 계약 제거 후 `x-space-id` 헤더 기반 guard 검증 테스트 sidecar를 신규 생성 | codex |
