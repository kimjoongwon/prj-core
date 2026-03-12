# Assets Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/assets.repository.ts

## 역할

Asset(에셋) 모델의 데이터 접근을 담당합니다. 폴더/Space/유형별 조회, 관계 포함 조회를 제공합니다.

## 엔티티

- **대상 Entity**: Asset (`@cocrepo/entity`)
- **Prisma 모델**: `asset`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Asset \| null>` | ID로 단건 조회 |
| `findByIdWithRelations(id)` | string | `Promise<Asset \| null>` | relation 포함 단건 조회 |
| `findByStorageKey(storageKey)` | string | `Promise<Asset \| null>` | storageKey 기준 조회 |
| `findByFolderId(folderId)` | string | `Promise<Asset[]>` | 폴더별 목록 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ assets: Asset[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.AssetUncheckedCreateInput | `Promise<Asset>` | 에셋 생성 |
| `updateById(id, data)` | string, Prisma.AssetUncheckedUpdateInput | `Promise<Asset>` | ID 기반 수정 |
| `deleteById(id)` | string | `Promise<Asset>` | ID 기반 삭제 |

## 구현 체크리스트

- [x] assets.repository.ts
- [x] relation include 포함 조회
- [x] create/update/delete 매핑

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(Asset) 신규 생성 | codex |

