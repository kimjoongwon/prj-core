# user.service.spec 테스트 기획서

> 생성일: 2026-04-15
> 타입: test
> 위치: packages/be-service/__tests__/user.service.spec.ts

## 역할

`UserService`의 핵심 회귀를 단위 테스트로 검증합니다.
특히 회원 목록 조회가 현재 Tenant 역할과 Space 스코프를 올바르게 반영하는지 확인합니다.

## 핵심 시나리오

- 비 `FULL_ACCESS` 또는 branch에 미러된 `FULL_ACCESS` 선택에서는 현재 `x-space-id` Tenant의 `spaceId` 1개만 사용해 회원 목록과 통계를 조회합니다.
- branch 범위 기본 목록은 미러된 `FULL_ACCESS` tenant를 제외합니다.
- `ROOT(System) + FULL_ACCESS` 사용자는 `SpaceContext.spaceIds = undefined`일 때 전체 회원 목록과 통계를 조회합니다.
- 사용자 상세/삭제/비밀번호 관련 기존 서비스 계약은 별도 테스트로 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | ROOT FULL_ACCESS 전역 조회와 branch 미러 FULL_ACCESS 제외 회귀 시나리오를 추가 반영 | codex |
| 2026-04-15 | 회원 목록 스코프 회귀 검증용 테스트 sidecar 신규 추가 | codex |
