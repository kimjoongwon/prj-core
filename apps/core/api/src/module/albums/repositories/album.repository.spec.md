# Album Repository 기획서

> 생성일: 2026-02-22
> 타입: repository
> 위치: apps/server/src/module/albums/repositories/album.repository.ts

## 역할

앨범(Album) 데이터의 영속성을 관리합니다. Prisma를 사용하여 데이터베이스 조작을 수행합니다.

## 담당 엔티티

Album

## Prisma 모델

```prisma
model Album {
  id           String    @id @default(uuid())
  spaceId      String    @map("space_id")
  name         String
  description  String?
  coverAssetId String?   @map("cover_asset_id")
  sortOrder    Int       @default(0)
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt    DateTime? @map("removed_at") @db.Timestamptz(6)

  coverAsset   Asset?       @relation("AlbumCoverAsset", fields: [spaceId, coverAssetId], references: [spaceId, id])
  entries      AlbumEntry[]

  @@unique([spaceId, id])
  @@unique([spaceId, name])
  @@index([spaceId, sortOrder])
  @@map("albums")
}
```

## 공개 메서드

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| findById | findUnique | Album \| null | ID로 단일 조회 |
| findByIdOrThrow | findUniqueOrThrow | Album | ID로 조회 (없으면 에러) |
| findBySpaceId | findMany | Album[] | Space별 목록 |
| search | findMany | Album[] | 검색 (name LIKE) |
| findByName | findFirst | Album \| null | 이름으로 조회 |
| create | create | Album | 앨범 생성 |
| update | update | Album | 앨범 수정 |
| softDelete | update | Album | 소프트 삭제 |
| count | count | number | 개수 조회 |
| findWithEntries | findUnique | Album (with entries) | 엔트리 포함 조회 |

## 쿼리 최적화

| 메서드 | 최적화 방식 |
|--------|------------|
| findBySpaceId | spaceId 인덱스 사용 |
| findWithEntries | include 옵션으로 entries 한 번에 조회 |

## 트랜잭션

트랜잭션 필요 없음

## 구현 체크리스트

- [ ] album.repository.ts
- [ ] 인터페이스 정의
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest (Prisma Mock)

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| findById | 1 | 1 | 0 | 2 |
| findBySpaceId | 1 | 0 | 1 | 2 |
| create | 1 | 1 | 0 | 2 |
| update | 1 | 1 | 0 | 2 |
| softDelete | 1 | 0 | 0 | 1 |

### [TC-001] findById - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Mock Prisma 클라이언트, 존재하는 ID |
| **When** | findById 호출 |
| **Then** | Album 객체 반환 |

### [TC-002] findBySpaceId - 삭제된 앨범 제외

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | Space에 삭제된/삭제되지 않은 앨범 혼재 |
| **When** | findBySpaceId 호출 |
| **Then** | removedAt이 null인 앨범만 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/album.entity.spec.md`
- `apps/server/src/module/albums/album.service.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
