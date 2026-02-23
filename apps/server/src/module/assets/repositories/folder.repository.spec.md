# Folder Repository 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: repository
> 위치: apps/server/src/module/assets/repositories/folder.repository.ts

## 역할

에셋의 계층적 저장 구조를 관리하는 Folder 엔티티의 데이터 접근 레이어입니다. 폴더의 CRUD, 트리 구조 조회, 경로 기반 조회를 담당합니다.

## 담당 엔티티

`Folder` (`@cocrepo/entity`)

## Prisma 모델

```prisma
model Folder {
  id             String    @id @default(uuid())
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime? @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt      DateTime? @map("removed_at") @db.Timestamptz(6)
  spaceId        String    @map("space_id")
  parentFolderId String?   @map("parent_folder_id")
  name           String
  path           String    @unique
  sortOrder      Int       @default(0) @map("sort_order")
  creatorId      String?   @map("creator_id")
  // Relations
  space          Space     @relation(fields: [spaceId], references: [id])
  parent         Folder?   @relation("FolderParent", fields: [parentFolderId], references: [id])
  children       Folder[]  @relation("FolderParent")
  creator        User?     @relation(fields: [creatorId], references: [id])
  assets         Asset[]

  @@index([spaceId])
  @@index([parentFolderId])
  @@index([path])
  @@map("folders")
}
```

## 공개 메서드

### 단일 조회

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `findById(id)` | `findUnique` | `Folder \| null` | ID로 폴더 조회 |
| `findByIdWithChildren(id)` | `findUnique` + `include` | `Folder \| null` | ID로 폴더 조회 (하위 폴더 포함) |
| `findByIdWithParent(id)` | `findUnique` + `include` | `Folder \| null` | ID로 폴더 조회 (상위 폴더 포함) |
| `findByPath(path)` | `findUnique` | `Folder \| null` | 경로로 폴더 조회 |
| `findByIds(ids)` | `findMany` | `Folder[]` | 여러 ID로 폴더 목록 조회 |

### 목록 조회

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `findManyBySpaceId(params)` | `findMany` + `count` | `{ items, count }` | Space 내 폴더 목록 (페이지네이션) |
| `findChildren(folderId)` | `findMany` | `Folder[]` | 하위 폴더 목록 조회 |
| `findRootFolders(spaceId)` | `findMany` | `Folder[]` | 루트 폴더 목록 조회 |
| `findManyByPathPrefix(pathPrefix)` | `findMany` | `Folder[]` | 경로 접두사로 폴더 목록 조회 |

### 생성/수정/삭제

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `create(data)` | `create` | `Folder` | 폴더 생성 |
| `updateById(id, data)` | `update` | `Folder` | 폴더 수정 |
| `removeById(id)` | `update` | `Folder` | 폴더 소프트 삭제 |
| `restoreById(id)` | `update` | `Folder` | 폴더 복원 |

### 트리 조회

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `findTreeBySpaceId(spaceId)` | `findMany` + `include` | `Folder[]` | 폴더 트리 조회 (1단계만) |

### 집계

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| `countBySpaceId(spaceId)` | `count` | `number` | Space 내 폴더 수 |
| `countChildren(folderId)` | `count` | `number` | 하위 폴더 수 |
| `existsById(id)` | `count` | `boolean` | 폴더 존재 여부 |
| `existsByPath(path)` | `count` | `boolean` | 경로 존재 여부 |
| `existsByNameInParent(...)` | `count` | `boolean` | 동일 이름의 형제 폴더 존재 여부 |

## 쿼리 최적화

| 메서드 | 최적화 방식 |
|--------|------------|
| `findManyBySpaceId` | `Promise.all`로 count와 findMany 병렬 실행 |
| `findTreeBySpaceId` | 1단계 children만 include (깊은 재귀 방지) |
| `findByIds` | `in` 연산자로 일괄 조회 |
| `exists*` 메서드 | `count` 사용 후 boolean 변환 |

## 트랜잭션

| 메서드 | 트랜잭션 필요 | 이유 |
|--------|--------------|------|
| `create` | Service 레벨 | 경로 생성 시 부모 폴더 경로 확인 필요 |
| `updateById` | Service 레벨 | 경로 변경 시 하위 폴더 경로도 함께 업데이트 필요 |
| `removeById` | Service 레벨 | 하위 폴더/에셋 처리 정책에 따라 다름 |

## 구현 체크리스트

- [x] folder.repository.ts
- [x] 단일 조회 메서드 (findById, findByPath)
- [x] 목록 조회 메서드 (findManyBySpaceId, findChildren, findRootFolders)
- [x] 트리 조회 메서드 (findTreeBySpaceId)
- [x] CRUD 메서드 (create, updateById, removeById, restoreById)
- [x] 집계 메서드 (countBySpaceId, countChildren, exists*)
- [ ] 인터페이스 정의
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest (Prisma Mock)

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| findById | 1 | 0 | 1 | 2 |
| findByPath | 1 | 0 | 1 | 2 |
| findManyBySpaceId | 1 | 0 | 1 | 2 |
| findChildren | 1 | 0 | 1 | 2 |
| findRootFolders | 1 | 0 | 0 | 1 |
| create | 1 | 0 | 0 | 1 |
| updateById | 1 | 0 | 0 | 1 |
| removeById | 1 | 0 | 0 | 1 |
| restoreById | 1 | 0 | 0 | 1 |
| countBySpaceId | 1 | 0 | 0 | 1 |
| countChildren | 1 | 0 | 0 | 1 |
| existsById | 1 | 0 | 0 | 1 |
| existsByPath | 1 | 0 | 0 | 1 |
| existsByNameInParent | 2 | 0 | 0 | 2 |

### [TC-001] ID로 폴더 조회 - 존재하는 경우

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Mock 폴더 데이터 (id="folder-1", name="이미지") |
| **When** | `findById("folder-1")` 호출 |
| **Then** | Folder 인스턴스 반환, id와 name 일치 |

### [TC-002] ID로 폴더 조회 - 존재하지 않는 경우

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | 존재하지 않는 ID |
| **When** | `findById("non-existent")` 호출 |
| **Then** | `null` 반환 |

### [TC-003] 경로로 폴더 조회 - 존재하는 경우

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Mock 폴더 데이터 (path="/이미지/배너") |
| **When** | `findByPath("/이미지/배너")` 호출 |
| **Then** | Folder 인스턴스 반환, path 일치 |

### [TC-004] 하위 폴더 목록 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 부모 폴더와 3개의 하위 폴더 |
| **When** | `findChildren("parent-id")` 호출 |
| **Then** | 3개의 Folder 인스턴스 반환, sortOrder 오름차순 정렬 |

### [TC-005] 루트 폴더 목록 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Space에 2개의 루트 폴더와 1개의 하위 폴더 |
| **When** | `findRootFolders("space-id")` 호출 |
| **Then** | 2개의 Folder 인스턴스 반환 (parentFolderId === null) |

### [TC-006] 폴더 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Prisma.UncheckedCreateInput 데이터 |
| **When** | `create(data)` 호출 |
| **Then** | Folder 인스턴스 반환, 모든 필드 일치 |

### [TC-007] 폴더 소프트 삭제

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 삭제할 폴더 ID |
| **When** | `removeById("folder-id")` 호출 |
| **Then** | Folder 인스턴스 반환, removedAt 설정됨 |

### [TC-008] 동일 이름 형제 폴더 존재 확인 - 존재함

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 동일 이름의 형제 폴더가 존재 |
| **When** | `existsByNameInParent(spaceId, "이미지", "parent-id")` 호출 |
| **Then** | `true` 반환 |

### [TC-009] 동일 이름 형제 폴더 존재 확인 - 제외 ID

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 동일 이름의 형제 폴더가 존재하나 excludeId로 제외 |
| **When** | `existsByNameInParent(spaceId, "이미지", "parent-id", "folder-id")` 호출 |
| **Then** | `false` 반환 |

## 상위 기획서

- `apps/server/src/module/assets/assets.module.spec.md` (예정)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | be-repository-builder |
