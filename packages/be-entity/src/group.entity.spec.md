# Group Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/group.entity.ts

## 역할

사용자 그룹을 나타내는 엔티티입니다. 다양한 용도(역할 그룹, 공간 그룹, 사용자 그룹, 에셋 그룹 등)에 맞게 `GroupTypes`로 유형을 구분합니다. Space 단위로 격리되며, UserAssociation/SpaceAssociation/RoleAssociation을 통해 연결됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 그룹 이름 |
| label | string \| null | nullable | null | 표시 라벨 |
| type | GroupTypes | required | - | 그룹 유형 |
| tenantId | string | required | - | 테넌트 ID |
| spaceId | string | FK, required | - | 소속 공간 ID |
| creatorId | string \| null | FK, nullable | null | 생성자 사용자 ID |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| GroupTypes | (Prisma 정의) | 그룹 유형 (role, space, user 등) |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| space | Space | ManyToOne | 소속 공간 |
| creator | User | ManyToOne | 생성자 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- `GroupTypes`에 따라 역할 그룹, 공간 그룹, 사용자 그룹, 에셋 그룹 등으로 활용됩니다.
- Space 단위로 격리되어 같은 Space 내 그룹만 참조 가능합니다.
- `creatorId`가 null인 경우 시스템 생성 그룹입니다.
- RoleAssociation, SpaceAssociation, UserAssociation 등에서 이 그룹을 참조합니다.

## 구현 체크리스트

- [x] group.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma GroupEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | FileAssociation 제거에 맞춰 Group 연관 설명 정리 | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
