# users.repository.spec 테스트 기획서

> 생성일: 2026-04-16
> 타입: test
> 위치: packages/be-repository/__tests__/users.repository.spec.ts

## 역할

`UsersRepository`가 사용자 목록/상세 조회 시 Prisma include와 count 쿼리를 올바르게 구성하는지 검증합니다.

## 핵심 시나리오

- `findByIdWithTenantsAndProfiles`는 tenant/profile 관계를 포함해 사용자를 조회합니다.
- `findByEmailWithTenantsAndProfiles`는 이메일 기준으로 중첩 role/space 관계를 포함해 사용자를 조회합니다.
- `findManyBySpaceIds`는 scoped 회원 목록에서 `spaceIds`를 `tenants` include 필터로 전달해 현재 스코프만 조회합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | scoped 회원 목록의 include tenant가 FULL_ACCESS 제외 규칙을 따르는 회귀 시나리오를 추가 | codex |
| 2026-04-16 | FULL_ACCESS 제외 규칙을 제거하고 `spaceIds` 단일 규칙 회귀로 정리 | codex |
