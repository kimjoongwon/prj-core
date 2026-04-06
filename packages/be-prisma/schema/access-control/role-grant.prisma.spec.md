# role-grant.prisma 스키마 기획서

> 생성일: 2026-04-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/access-control/role-grant.prisma

## 역할

Role과 Ability를 명시적으로 연결하는 역할 권한 부여 모델을 정의합니다.
역할 기반 기본 권한을 관리하며 `roleId`를 통해 대상 Role을 직접 식별합니다.

## 운영 규칙

- `role-grant.prisma` 변경 시 `role-grant.prisma.spec.md`를 함께 갱신합니다.
- 역할 권한 연결 변경 시 `role.prisma`, `ability.prisma`와 FK/관계 무결성을 함께 점검합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | polymorphic Grant를 roleId 기반 `RoleGrant` 모델로 분리하는 스키마를 신규 추가 | codex |
