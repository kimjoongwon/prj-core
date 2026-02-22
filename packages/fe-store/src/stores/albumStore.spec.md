# AlbumStore 기획서

> 생성일: 2026-02-22
> 타입: store
> 위치: packages/fe-store/src/stores/albumStore.ts

## 역할

앨범 관리와 관련된 UI 상태를 관리합니다. 앨범 편집 모드, 에셋 추가/제거, 순서 변경 등의 상태를 관리합니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| currentAlbumId | string \| null | null | 현재 조회 중인 앨범 ID |
| isReorderMode | boolean | false | 순서 편집 모드 여부 |
| selectedEntryIds | Set<string> | new Set() | 선택된 엔트리 ID 목록 |
| isAddAssetModalOpen | boolean | false | 에셋 추가 모달 열림 여부 |
| isEditAlbumModalOpen | boolean | false | 앨범 편집 모달 열림 여부 |
| editingEntryId | string \| null | null | 캡션 편집 중인 엔트리 ID |
| searchKeyword | string | "" | 앨범 내 에셋 검색어 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| hasSelection | boolean | selectedEntryIds.size > 0 |
| selectionCount | number | selectedEntryIds.size |
| isViewingAlbum | boolean | currentAlbumId !== null |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| setCurrentAlbum | albumId: string \| null | 현재 앨범 설정 |
| toggleReorderMode | - | 순서 편집 모드 토글 |
| selectEntry | entryId: string | 엔트리 선택 |
| deselectEntry | entryId: string | 엔트리 선택 해제 |
| toggleEntrySelection | entryId: string | 엔트리 선택 토글 |
| clearSelection | - | 선택 초기화 |
| openAddAssetModal | - | 에셋 추가 모달 열기 |
| closeAddAssetModal | - | 에셋 추가 모달 닫기 |
| openEditAlbumModal | - | 앨범 편집 모달 열기 |
| closeEditAlbumModal | - | 앨범 편집 모달 닫기 |
| startEditCaption | entryId: string | 캡션 편집 시작 |
| finishEditCaption | - | 캡션 편집 종료 |
| setSearchKeyword | keyword: string | 검색어 설정 |

## 비동기 액션 (Flow)

| 메서드 | 파라미터 | API 호출 | 성공 시 동작 |
|--------|----------|----------|--------------|
| addAssetsToAlbum | assetIds: string[] | POST /api/v1/albums/{id}/entries | 엔트리 추가, 캐시 무효화 |
| removeEntry | entryId: string | DELETE /api/v1/albums/{id}/entries/{entryId} | 엔트리 제거, 캐시 무효화 |
| reorderEntries | entryIds: string[] | PATCH /api/v1/albums/{id}/entries/reorder | 순서 변경, 캐시 무효화 |
| updateCaption | entryId, caption | PATCH /api/v1/albums/{id}/entries/{entryId} | 캡션 업데이트 |

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | 앱 전체 상태 접근 |
| assetStore | 에셋 선택 시 참조 |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| albumStore | AlbumStore |

## 구현 체크리스트

- [ ] albumStore.ts
- [ ] RootStore에 등록
- [ ] 타입 정의
- [ ] 단위 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest

### 테스트 커버리지

| Action / Computed | Happy Path | Error Path | Edge Case | 합계 |
|-------------------|:----------:|:----------:|:---------:|:----:|
| toggleReorderMode | 2 | 0 | 0 | 2 |
| selectEntry | 1 | 0 | 0 | 1 |
| toggleEntrySelection | 2 | 0 | 0 | 2 |
| openAddAssetModal | 1 | 0 | 0 | 1 |
| closeAddAssetModal | 1 | 0 | 0 | 1 |
| hasSelection | 2 | 0 | 0 | 2 |

### [TC-001] toggleReorderMode - 켜기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isReorderMode=false |
| **When** | toggleReorderMode() 호출 |
| **Then** | isReorderMode=true |

### [TC-002] toggleReorderMode - 끄기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isReorderMode=true |
| **When** | toggleReorderMode() 호출 |
| **Then** | isReorderMode=false |

### [TC-003] toggleEntrySelection - 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectedEntryIds=Set() |
| **When** | toggleEntrySelection("entry-1") 호출 |
| **Then** | selectedEntryIds=Set(["entry-1"]) |

### [TC-004] toggleEntrySelection - 선택 해제

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectedEntryIds=Set(["entry-1"]) |
| **When** | toggleEntrySelection("entry-1") 호출 |
| **Then** | selectedEntryIds=Set() |

### [TC-005] openAddAssetModal

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isAddAssetModalOpen=false |
| **When** | openAddAssetModal() 호출 |
| **Then** | isAddAssetModalOpen=true |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
