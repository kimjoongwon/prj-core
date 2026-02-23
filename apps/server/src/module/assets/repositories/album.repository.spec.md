# Album Repository 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: repository
> 위치: apps/server/src/module/assets/repositories/album.repository.ts

## 역할

앨범(Album) 및 앨범 엔트리(AlbumEntry)의 데이터 접근을 담당하는 Repository입니다. 앨범의 CRUD와 함께 앨범에 포함된 에셋의 관리(추가/제거/순서변경)를 처리합니다.

## 담당 엔티티

- **Album**: 사용자 정의 에셋 컬렉션
- **AlbumEntry**: Album-Asset 조인 엔티티 (N:M 관계)

## Prisma 모델

```prisma
model Album {
  id           String       @id @default(uuid())
  createdAt    DateTime     @default(now())
  updatedAt    DateTime?    @updatedAt
  removedAt    DateTime?
  spaceId      String
  name         String
  description  String?
  coverAssetId String?
  sortOrder    Int          @default(0)
  creatorId    String?
  // Relations
  space        Space        @relation(...)
  coverAsset   Asset?       @relation(...)
  creator      User?        @relation(...)
  entries      AlbumEntry[]

  @@map("albums")
}

model AlbumEntry {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @updatedAt
  removedAt DateTime?
  spaceId   String
  albumId   String
  assetId   String
  position  Int
  caption   String?
  // Relations
  space     Space     @relation(...)
  album     Album     @relation(...)
  asset     Asset     @relation(...)

  @@unique([albumId, assetId])
  @@map("album_entries")
}
```

## 공개 메서드

### Album 조회

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `findById` | findUnique | Album \| null | ID로 앨범 단일 조회 |
| `findByIdWithEntries` | findUnique | Album \| null | 엔트리 포함 조회 |
| `findByIdWithCoverAsset` | findUnique | Album \| null | 커버 에셋 포함 조회 |
| `findManyBySpaceId` | findMany + count | { items, count } | Space 내 앨범 목록 |
| `findByIds` | findMany | Album[] | 여러 ID로 조회 |
| `countBySpaceId` | count | number | Space 내 앨범 수 |

### Album 생성/수정/삭제

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `create` | create | Album | 앨범 생성 |
| `updateById` | update | Album | 앨범 수정 |
| `removeById` | update | Album | 소프트 삭제 |
| `restoreById` | update | Album | 복원 |

### AlbumEntry 관리

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `addEntry` | create | AlbumEntry | 엔트리 추가 |
| `removeEntry` | update | AlbumEntry | 엔트리 소프트 삭제 |
| `reorderEntries` | update (bulk) | number | 순서 변경 |
| `updateEntryCaption` | update | AlbumEntry | 캡션 수정 |
| `findNextPosition` | findFirst | number | 다음 position 조회 |
| `countEntriesByAlbumId` | count | number | 엔트리 수 조회 |

### AlbumEntry 조회

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `findEntryByAlbumIdAndAssetId` | findUnique | AlbumEntry \| null | 단일 엔트리 조회 |
| `findEntriesByAlbumId` | findMany | AlbumEntry[] | 앨범의 모든 엔트리 |
| `findAlbumIdsByAssetId` | findMany | string[] | 에셋이 포함된 앨범 ID 목록 |

## 쿼리 최적화

| 메서드 | 최적화 방식 |
|--------|------------|
| `findManyBySpaceId` | Promise.all로 count와 findMany 병렬 실행 |
| `reorderEntries` | Promise.all로 벌크 업데이트 병렬 처리 |
| `findByIdWithEntries` | 필요 시에만 entries include |

## 트랜잭션

| 메서드 | 트랜잭션 필요 | 이유 |
|--------|--------------|------|
| `reorderEntries` | 선택 | 여러 position 업데이트의 원자성 보장 (Service 레벨에서 결정) |
| 그 외 | 아니오 | 단일 Prisma 연산 |

## 구현 체크리스트

- [x] album.repository.ts
- [x] Album CRUD 메서드
- [x] AlbumEntry 관리 메서드
- [x] 관계 포함 조회 메서드
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest (Prisma Mock)

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| findById | 필요 | 필요 | - | 2 |
| findManyBySpaceId | 필요 | 필요 | 빈 목록 | 3 |
| create | 필요 | 필요 | - | 2 |
| updateById | 필요 | 없음 | - | 1 |
| removeById | 필요 | 필요 | - | 2 |
| addEntry | 필요 | 중복 | - | 2 |
| reorderEntries | 필요 | 필요 | 빈 배열 | 3 |

### [TC-001] ID로 앨범 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범이 존재하는 경우 |
| **When** | findById 호출 |
| **Then** | Album 인스턴스 반환, removedAt=null 확인 |

### [TC-002] Space 내 앨범 목록 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Space에 여러 앨범 존재 |
| **When** | findManyBySpaceId 호출 (skip, take 포함) |
| **Then** | items 배열과 count 반환, sortOrder 오름차순 확인 |

### [TC-003] 엔트리 추가

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범이 존재하고 에셋이 존재 |
| **When** | addEntry 호출 |
| **Then** | AlbumEntry 생성, position 설정 확인 |

### [TC-004] 엔트리 중복 추가

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 이미 추가된 에셋 |
| **When** | addEntry 호출 |
| **Then** | Prisma 유니크 제약 에러 발생 |

### [TC-005] 엔트리 순서 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범에 여러 엔트리 존재 |
| **When** | reorderEntries 호출 |
| **Then** | 모든 position이 업데이트됨 |

## 상위 기획서

- `apps/server/src/module/assets/assets.module.spec.md` (예정)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | be-repository-builder |
