# Asset Repository 기획서

> 생성일: 2026-02-22
> 타입: repository
> 위치: apps/server/src/module/assets/repositories/asset.repository.ts

## 역할

에셋(Asset) 데이터의 영속성을 관리합니다. Prisma를 사용하여 데이터베이스 조작을 수행합니다.

## 담당 엔티티

Asset

## Prisma 모델

```prisma
model Asset {
  id           String      @id @default(uuid())
  spaceId      String      @map("space_id")
  folderId     String      @map("folder_id")
  kind         AssetKind
  status       AssetStatus @default(UPLOADING)
  originalName String      @map("original_name")
  storageKey   String      @map("storage_key")
  mimeType     String      @map("mime_type")
  extension    String?
  sizeBytes    BigInt      @map("size_bytes")
  checksum     String?
  metadata     Json?
  createdAt    DateTime    @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime    @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt    DateTime?   @map("removed_at") @db.Timestamptz(6)

  folder       Folder       @relation(fields: [spaceId, folderId], references: [spaceId, id])
  image        Image?
  video        Video?
  document     Document?
  derivatives  Derivative[]
  albumEntries AlbumEntry[]
  coverFor     Album[]      @relation("AlbumCoverAsset")

  @@unique([spaceId, id])
  @@unique([spaceId, storageKey])
  @@index([spaceId, folderId, createdAt])
  @@index([spaceId, kind, status])
  @@map("assets")
}
```

## 공개 메서드

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| findById | findUnique | Asset \| null | ID로 단일 조회 |
| findByIdOrThrow | findUniqueOrThrow | Asset | ID로 조회 (없으면 에러) |
| findBySpaceId | findMany | Asset[] | Space별 목록 |
| findByFolderId | findMany | Asset[] | 폴더별 목록 |
| search | findMany | Asset[] | 검색 (originalName LIKE) |
| findByKind | findMany | Asset[] | 타입별 필터링 |
| create | create | Asset | 에셋 생성 |
| update | update | Asset | 에셋 수정 |
| softDelete | update | Asset | 소프트 삭제 (removedAt 설정) |
| batchSoftDelete | updateMany | BatchPayload | 일괄 소프트 삭제 |
| count | count | number | 개수 조회 |
| findWithDetail | findUnique | Asset (with Image/Video/Document) | 상세 정보 포함 조회 |

## 쿼리 최적화

| 메서드 | 최적화 방식 |
|--------|------------|
| findByFolderId | spaceId + folderId 복합 인덱스 사용 |
| search | originalName 인덱스 활용 (PostgreSQL ILIKE) |
| findWithDetail | include 옵션으로 관계 한 번에 조회 |

## 트랜잭션

| 메서드 | 트랜잭션 필요 | 이유 |
|--------|--------------|------|
| create (with detail) | 필요 | Asset + Image/Video/Document 동시 생성 시 |
| batchSoftDelete | 선택 | 대량 삭제 시 일관성 보장 |

## 구현 체크리스트

- [ ] asset.repository.ts
- [ ] 인터페이스 정의
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest (Prisma Mock)

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| findById | 1 | 1 | 0 | 2 |
| findByFolderId | 1 | 0 | 1 | 2 |
| create | 1 | 1 | 0 | 2 |
| update | 1 | 1 | 0 | 2 |
| softDelete | 1 | 0 | 0 | 1 |

### [TC-001] findById - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Mock Prisma 클라이언트, 존재하는 ID |
| **When** | findById 호출 |
| **Then** | Asset 객체 반환 |

### [TC-002] findByFolderId - 삭제된 에셋 제외

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | 폴더에 삭제된/삭제되지 않은 에셋 혼재 |
| **When** | findByFolderId 호출 |
| **Then** | removedAt이 null인 에셋만 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/asset.entity.spec.md`
- `apps/server/src/module/assets/asset.service.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
