# Album Service 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: service
> 위치: apps/server/src/module/assets/services/album.service.ts

## 역할

앨범 CRUD 및 엔트리 관리 비즈니스 로직을 담당합니다. Space 기반 접근 권한을 검증하고, 앨범 내 에셋 추가/제거/순서 변경을 처리합니다.

## 담당 도메인

- **Album**: 앨범 엔티티 (이름, 설명, 커버 이미지, 정렬 순서)
- **AlbumEntry**: 앨범-에셋 연결 엔티티 (position, caption)

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Repository | AlbumRepository | 앨범 및 엔트리 데이터 접근 |
| Service | ClsService | CLS 컨텍스트에서 Space ID 및 Tenant 정보 조회 |
| Util | canAccessAllSpaces | 전체 Space 접근 권한 확인 |

## 공개 메서드

### 앨범 조회

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| `getAlbumsBySpace` | AlbumQueryDto | GetAlbumsResult | Space 내 앨범 목록 조회 |
| `getAlbumDetailById` | albumId: string | Album | 앨범 상세 조회 (엔트리 포함) |
| `getAlbumById` | albumId: string | Album \| null | ID로 앨범 조회 |
| `getAlbumsByIds` | ids: string[] | Album[] | 여러 ID로 앨범 조회 |
| `countAlbumsBySpaceId` | spaceId: string | number | Space 내 앨범 수 조회 |

### 앨범 생성/수정/삭제

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| `createAlbum` | Prisma.AlbumUncheckedCreateInput | Album | 앨범 생성 |
| `updateAlbum` | albumId, Prisma.AlbumUncheckedUpdateInput | Album | 앨범 수정 |
| `deleteAlbum` | albumId: string | Album | 앨범 소프트 삭제 |
| `restoreAlbum` | albumId: string | Album | 앨범 복원 |

### 커버 이미지 관리

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| `setCoverImage` | albumId, coverAssetId | Album | 커버 이미지 설정 |
| `removeCoverImage` | albumId: string | Album | 커버 이미지 제거 |

### 엔트리 관리

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| `addAssetToAlbum` | albumId, assetId, caption? | AlbumEntry | 앨범에 에셋 추가 |
| `removeAssetFromAlbum` | albumId, assetId | AlbumEntry | 앨범에서 에셋 제거 |
| `reorderAlbumEntries` | albumId, entryPositions[] | number | 엔트리 순서 변경 |
| `updateEntryCaption` | albumId, assetId, caption | AlbumEntry | 엔트리 캡션 수정 |
| `getAlbumEntries` | albumId: string | AlbumEntry[] | 엔트리 목록 조회 |
| `countAlbumEntries` | albumId: string | number | 엔트리 수 조회 |
| `findAlbumIdsContainingAsset` | assetId: string | string[] | 에셋이 포함된 앨범 ID 목록 |

### 일괄 작업

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| `addAssetsToAlbum` | albumId, assetIds[] | AlbumEntry[] | 여러 에셋 일괄 추가 |
| `removeAssetsFromAlbum` | albumId, assetIds[] | number | 여러 에셋 일괄 제거 |

## 비즈니스 규칙

### Space 접근 권한 검증

모든 앨범 조회/수정/삭제 작업 전에 Space 접근 권한을 검증합니다.

**조건:**
- FULL_ACCESS 권한(Root Space Category)이 있으면 모든 Space의 앨범 접근 가능
- 일반 사용자는 자신이 속한 Space의 앨범만 접근 가능
- 권한이 없는 앨범 접근 시 "앨범을 찾을 수 없습니다" 응답 (보안상 존재 여부 숨김)

### 앨범 생성 시 sortOrder 자동 설정

sortOrder가 지정되지 않으면 현재 Space의 마지막 순서 + 1로 자동 설정합니다.

**조건:**
- sortOrder가 undefined인 경우에만 자동 설정
- 기존 앨범 수를 조회하여 순차적 할당

### 중복 에셋 추가 방지

이미 앨범에 추가된 에셋은 다시 추가할 수 없습니다.

**조건:**
- albumId + assetId 복합키로 중복 확인
- 중복 시 "이미 앨범에 추가된 에셋입니다" 예외 발생

### 엔트리 position 자동 할당

앨범에 에셋 추가 시 다음 position 값을 자동으로 할당합니다.

**조건:**
- 현재 앨범의 마지막 position + 1
- 빈 앨범이면 position = 0

### 삭제된 앨범 복원 권한

삭제된 앨범 복원은 전체 접근 권한이 필요합니다.

**조건:**
- canAccessAllSpaces()가 true여야 복원 가능
- 권한 없으면 "삭제된 앨범 복원은 전체 접근 권한이 필요합니다" 예외 발생

## 에러 처리

| 상황 | 에러 코드 | 메시지 |
|------|----------|--------|
| Space 미선택 | 400 | Space가 선택되지 않았습니다. |
| 앨범 없음 | 404 | 앨범을 찾을 수 없습니다. |
| 권한 없는 앨범 접근 | 404 | 앨범을 찾을 수 없습니다. |
| 중복 에셋 추가 | 400 | 이미 앨범에 추가된 에셋입니다. |
| 엔트리 없음 | 404 | 앨범에서 해당 에셋을 찾을 수 없습니다. |
| 복원 권한 없음 | 400 | 삭제된 앨범 복원은 전체 접근 권한이 필요합니다. |

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
| getAlbumsBySpace | Space 멤버 | CLS Space ID 확인 |
| getAlbumDetailById | Space 멤버 | 앨범의 spaceId와 CLS Space ID 비교 |
| createAlbum | Space 멤버 | CLS Space ID로 생성 |
| updateAlbum | Space 멤버 | 앨범의 spaceId와 CLS Space ID 비교 |
| deleteAlbum | Space 멤버 | 앨범의 spaceId와 CLS Space ID 비교 |
| restoreAlbum | FULL_ACCESS | canAccessAllSpaces() 확인 |
| addAssetToAlbum | Space 멤버 | 앨범의 spaceId와 CLS Space ID 비교 |
| removeAssetFromAlbum | Space 멤버 | 앨범의 spaceId와 CLS Space ID 비교 |
| reorderAlbumEntries | Space 멤버 | 앨범의 spaceId와 CLS Space ID 비교 |

## 구현 체크리스트

- [x] album.service.ts
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| getAlbumsBySpace | 1 | 1 | 1 | 3 |
| getAlbumDetailById | 1 | 2 | 0 | 3 |
| createAlbum | 2 | 0 | 0 | 2 |
| updateAlbum | 1 | 2 | 0 | 3 |
| deleteAlbum | 1 | 2 | 0 | 3 |
| addAssetToAlbum | 2 | 2 | 0 | 4 |
| removeAssetFromAlbum | 1 | 2 | 0 | 3 |

### [TC-001] Space 내 앨범 목록 조회 성공

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | CLS에 Space ID 설정, AlbumRepository가 목록 반환 |
| **When** | getAlbumsBySpace(query) 호출 |
| **Then** | GetAlbumsResult 반환, Repository.findManyBySpaceId 호출 확인 |

### [TC-002] FULL_ACCESS 권한으로 타 Space 앨범 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | CLS에 FULL_ACCESS Tenant 설정, query.spaceId에 다른 Space ID |
| **When** | getAlbumsBySpace(query) 호출 |
| **Then** | query.spaceId로 조회, Repository.findManyBySpaceId 호출 확인 |

### [TC-003] 권한 없는 앨범 상세 조회 실패

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | CLS에 Space A ID 설정, 앨범이 Space B 소속 |
| **When** | getAlbumDetailById(albumId) 호출 |
| **Then** | NotFoundException("앨범을 찾을 수 없습니다.") 발생 |

### [TC-004] 앨범 생성 시 sortOrder 자동 설정

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sortOrder 없는 입력, 기존 앨범 3개 |
| **When** | createAlbum(data) 호출 |
| **Then** | sortOrder=3으로 Repository.create 호출 |

### [TC-005] 중복 에셋 추가 실패

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범에 이미 assetId="abc"인 엔트리 존재 |
| **When** | addAssetToAlbum(albumId, "abc") 호출 |
| **Then** | BadRequestException("이미 앨범에 추가된 에셋입니다.") 발생 |

### [TC-006] 앨범 복원 권한 없음

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | CLS에 FULL_ACCESS 아닌 Tenant 설정 |
| **When** | restoreAlbum(albumId) 호출 |
| **Then** | BadRequestException("삭제된 앨범 복원은 전체 접근 권한이 필요합니다.") 발생 |

## 상위 기획서

- `packages/be-entity/src/album.entity.spec.md` - Album Entity 기획서
- `apps/server/src/module/assets/repositories/album.repository.spec.md` - Album Repository 기획서

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | be-service-builder |
