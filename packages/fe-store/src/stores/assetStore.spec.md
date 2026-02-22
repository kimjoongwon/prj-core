# AssetStore 기획서

> 생성일: 2026-02-22
> 타입: store
> 위치: packages/fe-store/src/stores/assetStore.ts

## 역할

에셋 관리와 관련된 UI 상태를 관리합니다. 에셋 선택기(Picker) 모드, 현재 선택된 폴더, 검색/필터 상태 등을 관리합니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| currentFolderId | string \| null | null | 현재 선택된 폴더 ID |
| searchKeyword | string | "" | 검색어 |
| selectedKind | AssetKind \| null | null | 선택된 타입 필터 |
| viewMode | "grid" \| "list" | "grid" | 뷰 모드 |
| selectedAssetIds | Set<string> | new Set() | 선택된 에셋 ID 목록 |
| pickerMode | boolean | false | Picker 모드 여부 |
| selectionMode | "single" \| "multiple" | "single" | 선택 모드 |
| allowedTypes | AssetKind[] | [] | Picker에서 허용할 타입 |
| isUploading | boolean | false | 업로드 진행 중 여부 |
| uploadProgress | number | 0 | 업로드 진행률 (0-100) |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| hasSelection | boolean | selectedAssetIds.size > 0 |
| selectionCount | number | selectedAssetIds.size |
| isSingleSelection | boolean | pickerMode && selectionMode === "single" |
| isMultipleSelection | boolean | pickerMode && selectionMode === "multiple" |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| setCurrentFolder | folderId: string \| null | 현재 폴더 설정 |
| setSearchKeyword | keyword: string | 검색어 설정 |
| setSelectedKind | kind: AssetKind \| null | 타입 필터 설정 |
| toggleViewMode | - | 그리드/리스트 뷰 토글 |
| selectAsset | assetId: string | 에셋 선택 (Picker 모드) |
| deselectAsset | assetId: string | 에셋 선택 해제 |
| toggleAssetSelection | assetId: string | 에셋 선택 토글 |
| clearSelection | - | 선택 초기화 |
| enterPickerMode | config: PickerConfig | Picker 모드 진입 |
| exitPickerMode | - | Picker 모드 종료 |
| setUploading | isUploading: boolean, progress?: number | 업로드 상태 설정 |

## 비동기 액션 (Flow)

| 메서드 | 파라미터 | API 호출 | 성공 시 동작 |
|--------|----------|----------|--------------|
| deleteSelectedAssets | - | DELETE /api/v1/assets/{id} | 선택된 에셋 삭제, 캐시 무효화 |
| moveAsset | assetId, targetFolderId | PATCH /api/v1/assets/{id} | 에셋 폴더 이동 |

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | 앱 전체 상태 접근 |

## PickerConfig 타입

```typescript
interface PickerConfig {
  selectionMode: "single" | "multiple";
  allowedTypes?: AssetKind[];
  initialSelection?: string[];
  onSelect: (assets: Asset[]) => void;
  onClose: () => void;
}
```

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| assetStore | AssetStore |

## 구현 체크리스트

- [ ] assetStore.ts
- [ ] RootStore에 등록
- [ ] 타입 정의
- [ ] 단위 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest

### 테스트 커버리지

| Action / Computed | Happy Path | Error Path | Edge Case | 합계 |
|-------------------|:----------:|:----------:|:---------:|:----:|
| selectAsset | 2 | 0 | 1 | 3 |
| toggleAssetSelection | 2 | 0 | 0 | 2 |
| clearSelection | 1 | 0 | 0 | 1 |
| enterPickerMode | 1 | 0 | 0 | 1 |
| exitPickerMode | 1 | 0 | 0 | 1 |
| hasSelection | 2 | 0 | 0 | 2 |

### [TC-001] selectAsset - 단일 선택 모드

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectionMode="single", selectedAssetIds=Set() |
| **When** | selectAsset("asset-1") 호출 |
| **Then** | selectedAssetIds = Set(["asset-1"]) |

### [TC-002] selectAsset - 단일 선택 모드에서 다른 에셋 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectionMode="single", selectedAssetIds=Set(["asset-1"]) |
| **When** | selectAsset("asset-2") 호출 |
| **Then** | selectedAssetIds = Set(["asset-2"]) (이전 선택 해제) |

### [TC-003] selectAsset - 다중 선택 모드

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectionMode="multiple", selectedAssetIds=Set(["asset-1"]) |
| **When** | selectAsset("asset-2") 호출 |
| **Then** | selectedAssetIds = Set(["asset-1", "asset-2"]) |

### [TC-004] toggleAssetSelection

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectedAssetIds=Set(["asset-1"]) |
| **When** | toggleAssetSelection("asset-1") 호출 |
| **Then** | selectedAssetIds = Set() (선택 해제) |

### [TC-005] enterPickerMode

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | pickerMode=false |
| **When** | enterPickerMode({ selectionMode: "multiple" }) 호출 |
| **Then** | pickerMode=true, selectionMode="multiple" |

### [TC-006] hasSelection - 선택 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectedAssetIds=Set(["asset-1"]) |
| **When** | hasSelection 확인 |
| **Then** | true |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
