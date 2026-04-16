# casl-ability.factory.spec 테스트 기획서

> 생성일: 2026-04-16
> 타입: unit-test
> 위치: packages/be-common/src/casl/__tests__/casl-ability.factory.spec.ts

## 역할

`CaslAbilityFactory`가 현재 `x-space-id`에 맞는 tenant를 올바르게 선택해 RoleGrant를 읽는지 검증합니다.

## 시나리오

- 현재 space 컨텍스트가 있으면 해당 tenant roleId로 RoleGrant를 조회합니다.
- 같은 `spaceId`에 tenant가 여러 개라도 `spaceId` 매칭 tenant를 그대로 사용해 roleId를 조회합니다.
- space 컨텍스트가 없으면 첫 tenant를 fallback으로 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | 신규 생성, mirrored `FULL_ACCESS`보다 일반 tenant role 우선 회귀 추가 | codex |
| 2026-04-16 | mirrored 예외 시나리오를 제거하고 중복 tenant 매칭 규칙 정렬로 전환 | codex |
