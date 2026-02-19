# Space Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/space.entity.ts

## 역할

Multi-Tenancy 시스템의 핵심 공간(Space) 엔티티입니다. 테넌트(사용자-공간 접근)를 격리하는 논리적 공간을 나타냅니다. 공간 분류(SpaceClassification), 공간 그룹 연결(SpaceAssociation), 물리적 시설(Ground)과 연결됩니다. System Space는 PLATFORM 카테고리로 분류된 특수 공간입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| tenants | Tenant[] | OneToMany | 이 공간에 속한 테넌트 목록 |
| spaceClassifications | SpaceClassification[] | OneToMany | 공간 카테고리 분류 목록 |
| spaceAssociations | SpaceAssociation[] | OneToMany | 공간 그룹 연결 목록 |
| ground | Ground | OneToOne | 연결된 물리적 시설 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 모든 API 요청은 `X-Space-ID` 헤더를 통해 공간을 지정해야 합니다.
- System Space는 `isRootSpaceCategory(tenant)` 함수로 식별됩니다 (PLATFORM 카테고리 연결).
- FULL_ACCESS 역할을 가진 사용자도 반드시 X-Space-ID 헤더가 필요합니다.
- Space 단위로 데이터가 격리되어 다른 공간의 데이터에 접근 불가합니다.
- SpaceContext를 통해 CLS 컨텍스트에서 현재 요청의 공간 정보를 관리합니다.
- `SpaceAccessGuard`가 요청의 공간 접근 권한을 검사합니다.

## 구현 체크리스트

- [x] space.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma SpaceEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
