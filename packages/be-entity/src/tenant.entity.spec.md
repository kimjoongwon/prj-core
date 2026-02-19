# Tenant Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/tenant.entity.ts

## 역할

사용자(User)와 공간(Space)을 연결하는 Multi-Tenancy 핵심 엔티티입니다. 특정 사용자가 특정 공간에 어떤 역할(Role)로 접근하는지를 정의합니다. `X-Space-ID` 헤더와 함께 인증 후 로드되어 스페이스 기반 접근 제어의 기준이 됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| main | boolean | required | - | 주 테넌트 여부 |
| spaceId | string | FK, required | - | 공간 ID |
| userId | string | FK, required | - | 사용자 ID |
| roleId | string | FK, required | - | 역할 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| space | Space | ManyToOne | 소속 공간 |
| user | User | ManyToOne | 사용자 |
| role | Role | ManyToOne | 부여된 역할 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 하나의 사용자가 여러 공간에 여러 역할로 접근할 수 있습니다 (다중 테넌트).
- `main=true`인 테넌트가 사용자의 기본 공간 접속 정보입니다.
- `X-Space-ID` 헤더로 지정된 공간과 사용자의 테넌트를 매칭하여 권한을 결정합니다.
- SpaceAccessGuard가 `user.tenants`에서 해당 spaceId의 테넌트를 탐색합니다.
- CLS 컨텍스트에 현재 요청의 테넌트 정보가 저장됩니다.
- Assignment 테이블은 테넌트에 추가 역할을 할당합니다.

## 구현 체크리스트

- [x] tenant.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma TenantEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
