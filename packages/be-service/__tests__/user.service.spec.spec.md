# user.service.spec 테스트 기획서

> 생성일: 2026-04-15
> 타입: test
> 위치: packages/be-service/__tests__/user.service.spec.ts

## 역할

`UserService`의 핵심 회귀를 단위 테스트로 검증합니다.
특히 회원 목록 조회가 현재 Tenant 역할과 Space 스코프를 올바르게 반영하는지 확인합니다.

## 핵심 시나리오

- 비 `FULL_ACCESS` 선택에서는 현재 `x-space-id` Tenant의 `spaceId` 1개만 사용해 회원 목록과 통계를 조회합니다.
- branch/공간 범위 기본 목록은 `spaceIds` 기반 단일 스코프로 동작합니다.
- branch 범위 기본 목록 응답은 `findManyBySpaceIds`에 `spaceIds` 기반 단일 스코프를 전달해 역할 렌더링이 현재 space 기준과 맞아야 합니다.
- 현재 tenant role이 `FULL_ACCESS`면 Space category와 무관하게 `SpaceContext.spaceIds = undefined`일 때 전체 회원 목록과 통계를 조회합니다.
- 사용자 상세/삭제/비밀번호 관련 기존 서비스 계약은 별도 테스트로 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | scoped 회원 목록이 repository 응답 tenant include에도 FULL_ACCESS 제외 규칙을 전달하는 회귀 설명을 추가 | codex |
| 2026-04-16 | FULL_ACCESS 제외 규칙을 제거하고 `spaceIds` 단일 규칙으로 `UserService` 회귀를 정리 | codex |
| 2026-04-16 | branch FULL_ACCESS도 전체 조회를 여는 현재 tenant 기준 시나리오로 회귀 설명을 정정 | codex |
| 2026-04-15 | ROOT FULL_ACCESS 전역 조회와 branch 미러 FULL_ACCESS 제외 회귀 시나리오를 추가 반영 | codex |
| 2026-04-15 | 회원 목록 스코프 회귀 검증용 테스트 sidecar 신규 추가 | codex |
