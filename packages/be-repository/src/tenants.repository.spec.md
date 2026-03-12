# Tenants Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/tenants.repository.ts

## 역할

Tenant 모델의 데이터 접근을 담당합니다. 사용자/공간 조인 조회 및 테넌트 CRUD를 제공합니다.

## 엔티티

- **대상 Entity**: Tenant (`@cocrepo/entity`)
- **Prisma 모델**: `tenant`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Tenant \| null>` | ID로 단건 조회 |
| `findByIdWithRelations(id)` | string | `Promise<Tenant \| null>` | user/space/role/assignments 포함 조회 |
| `findByUserId(userId)` | string | `Promise<Tenant[]>` | 사용자별 테넌트 목록 조회 |
| `findBySpaceId(spaceId)` | string | `Promise<Tenant[]>` | Space별 테넌트 목록 조회 |
| `findByUserIdAndSpaceId(userId, spaceId)` | string, string | `Promise<Tenant \| null>` | 사용자+Space 결합 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ tenants: Tenant[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.TenantUncheckedCreateInput | `Promise<Tenant>` | 테넌트 생성 |
| `updateById(id, data)` | string, Prisma.TenantUncheckedUpdateInput | `Promise<Tenant>` | ID 기반 수정 |
| `deleteById(id)` | string | `Promise<Tenant>` | ID 기반 삭제 |

## 구현 체크리스트

- [x] tenants.repository.ts
- [x] user/space/role 관계 조회 지원
- [x] 복합키 조건(`userId`,`spaceId`) 조회 지원

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(Tenant) 신규 생성 | codex |

