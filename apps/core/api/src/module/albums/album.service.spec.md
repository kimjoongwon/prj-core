# Album Service 기획서

> 생성일: 2026-02-22
> 타입: service
> 위치: apps/server/src/module/albums/album.service.ts

## 역할

앨범(Album) CRUD 및 엔트리(AlbumEntry) 관리 비즈니스 로직을 담당합니다. 에셋 추가/제거, 순서 변경, 캡션 편집 등을 수행합니다.

## 담당 도메인

Album, AlbumEntry

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Repository | AlbumRepository | 앨범 데이터 접근 |
| Repository | AlbumEntryRepository | 앨범 엔트리 데이터 접근 |
| Repository | AssetRepository | 에셋 존재 확인 |
| Service | AssetService | 커버 이미지 에셋 정보 조회 |

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| findById | id: string | Album | 단일 앨범 조회 |
| findBySpace | query: QueryDto | PaginatedResult<Album> | Space별 앨범 목록 |
| search | keyword: string, query: QueryDto | PaginatedResult<Album> | 앨범 검색 |
| create | createDto: CreateAlbumDto | Album | 앨범 생성 |
| update | id: string, updateDto: UpdateAlbumDto | Album | 앨범 수정 |
| setCover | id: string, assetId: string | Album | 커버 이미지 설정 |
| clearCover | id: string | Album | 커버 이미지 제거 |
| softDelete | id: string | void | 소프트 삭제 |
| getEntries | albumId: string, query: QueryDto | PaginatedResult<AlbumEntry> | 앨범 엔트리 목록 |
| addAssets | albumId: string, assetIds: string[] | AlbumEntry[] | 에셋 추가 |
| removeEntry | albumId: string, entryId: string | void | 엔트리 제거 |
| reorderEntries | albumId: string, entryIds: string[] | void | 순서 변경 |
| updateCaption | albumId: string, entryId: string, caption: string | AlbumEntry | 캡션 수정 |

## 비즈니스 규칙

### 앨범 생성

- 이름은 Space 내에서 유니크
- 커버 이미지는 선택사항

### 에셋 추가

- 동일한 앨범에 동일한 에셋 중복 추가 불가
- position은 자동으로 마지막 + 1

### 순서 변경

- 모든 entryId가 해당 앨범에 속해야 함
- 중복된 entryId 불가

### 삭제

- 앨범 삭제 시 연결된 AlbumEntry도 함께 삭제 (Cascade)

## 에러 처리

| 상황 | 에러 코드 | 메시지 |
|------|----------|--------|
| 앨범 없음 | 404 | "앨범을 찾을 수 없습니다" |
| 에셋 없음 | 404 | "에셋을 찾을 수 없습니다" |
| 엔트리 없음 | 404 | "엔트리를 찾을 수 없습니다" |
| 중복 앨범명 | 409 | "이미 존재하는 앨범명입니다" |
| 중복 에셋 추가 | 409 | "이미 앨범에 포함된 에셋입니다" |

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
| findById | VIEW | Space 멤버십 확인 |
| findBySpace | VIEW | Space 멤버십 확인 |
| create | MANAGE | Space 관리 권한 확인 |
| update | MANAGE | Space 관리 권한 확인 |
| softDelete | MANAGE | Space 관리 권한 확인 |
| addAssets | MANAGE | Space 관리 권한 확인 |
| removeEntry | MANAGE | Space 관리 권한 확인 |

## 구현 체크리스트

- [ ] album.service.ts
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| findById | 1 | 1 | 0 | 2 |
| create | 1 | 1 | 0 | 2 |
| update | 1 | 1 | 0 | 2 |
| addAssets | 1 | 2 | 0 | 3 |
| removeEntry | 1 | 1 | 0 | 2 |
| reorderEntries | 1 | 1 | 1 | 3 |

### [TC-001] addAssets - 정상 추가

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범 존재, 에셋들 존재 |
| **When** | addAssets 호출 |
| **Then** | AlbumEntry들이 생성됨 |

### [TC-002] addAssets - 중복 에셋

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범에 이미 포함된 에셋 |
| **When** | addAssets 호출 |
| **Then** | ConflictException 발생 |

### [TC-003] reorderEntries - 정상 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범에 3개 엔트리 존재 |
| **When** | reorderEntries([id3, id1, id2]) 호출 |
| **Then** | position이 0, 1, 2로 재설정됨 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/album.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
