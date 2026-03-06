# Category Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/category.entity.ts

## 역할

계층 구조를 가진 범용 카테고리 엔티티입니다. 역할 분류(RoleClassification), 공간 분류(SpaceClassification), 사용자 분류(UserClassification), 에셋 분류(CategoryTypes.Asset) 등 다양한 분류 시스템에서 활용됩니다. 트리 구조의 부모-자식 관계를 지원하며, Space 단위로 격리됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 카테고리 이름 |
| type | CategoryTypes | required | - | 카테고리 유형 |
| tenantId | string | required | - | 테넌트 ID |
| parentId | string \| null | FK, nullable | null | 상위 카테고리 ID (루트이면 null) |
| spaceId | string | FK, required | - | 소속 공간 ID |
| creatorId | string \| null | FK, nullable | null | 생성자 사용자 ID |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| CategoryTypes | (Prisma 정의) | 카테고리 유형 (role, asset, space, user 등) |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| parent | Category | ManyToOne (self) | 상위 카테고리 (재귀 관계) |
| children | Category[] | OneToMany (self) | 하위 카테고리 목록 (재귀 관계) |
| space | Space | ManyToOne | 소속 공간 |
| creator | User | ManyToOne | 생성자 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getAllParentNames() | string[] | 현재부터 루트까지 모든 상위 카테고리 이름 배열 반환 |
| getAllChildrenNames() | string[] | 모든 하위 카테고리 이름을 재귀적으로 반환 |
| toOption() | { key, value, text } | 셀렉트 옵션 형태로 변환 |

## 비즈니스 규칙

- `parentId=null`인 카테고리가 루트 카테고리입니다.
- `CategoryTypes`에 따라 역할, 에셋, 공간, 사용자 분류에 각각 활용됩니다.
- `getAllParentNames()`는 `parent` 관계가 로드된 경우에만 완전한 결과를 반환합니다.
- `getAllChildrenNames()`는 `children` 관계가 재귀적으로 로드된 경우에만 완전한 결과를 반환합니다.
- Space 단위로 격리되어 같은 Space 내 카테고리만 참조 가능합니다.

## 구현 체크리스트

- [x] category.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma CategoryEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | FileClassification 제거 및 CategoryTypes.Asset 전환 반영 | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
