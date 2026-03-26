# AssetBrowser Feature 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: feature
> 위치: packages/fe-ui/src/feature/AssetBrowser/

## 역할

에셋 브라우저 메인 컴포넌트입니다. 폴더 트리와 에셋 그리드/리스트를 조합하고 AssetStore와 연결합니다.

## 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 에셋                                    [📤 업로드] [📁 폴더 생성]           │
│ 미디어 리소스를 관리합니다.                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────────────────────────────────────────┐│
│ │ 📁 폴더          │ │ 🔍 검색...                    [전체▼] [그리드|리스트] ││
│ │                  │ ├─────────────────────────────────────────────────────┤│
│ │ 📂 루트          │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  ││
│ │   📂 이미지      │ │ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │  ││
│ │   📂 비디오      │ │ │ image │ │ photo │ │ video │ │ doc   │ │ logo  │  ││
│ │   📂 문서        │ │ │ .jpg  │ │ .png  │ │ .mp4  │ │ .pdf  │ │ .svg  │  ││
│ │   📂 보관함      │ │ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘  ││
│ │                  │ │                                                     ││
│ │                  │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  ││
│ │                  │ │ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │  ││
│ │                  │ │ │ banner│ │ icon  │ │ promo │ │ guide │ │ hero  │  ││
│ │                  │ │ │ .webp │ │ .png  │ │ .mov  │ │ .xlsx │ │ .jpg  │  ││
│ │                  │ │ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘  ││
│ │                  │ │                                                     ││
│ │                  │ │                    < 1  2  3  >                     ││
│ └──────────────────┘ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘

[리스트 뷰]
┌─────────────────────────────────────────────────────────────────────────────┐
│ ...                                                                          │
│ ┌──────────────────┐ ┌─────────────────────────────────────────────────────┐│
│ │ 📁 폴더          │ │ ☐ │ 미리보기 │ 파일명      │ 타입 │ 크기   │ 날짜   ││
│ │    ...           │ ├─────────────────────────────────────────────────────┤│
│ │                  │ │ ☐ │ [IMG]    │ banner.jpg  │ IMG  │ 2.4 MB │ 02.22 ││
│ │                  │ │ ☐ │ [IMG]    │ photo.png   │ IMG  │ 1.2 MB │ 02.21 ││
│ │                  │ │ ☐ │ [VID]    │ promo.mp4   │ VID  │ 45 MB  │ 02.20 ││
│ └──────────────────┘ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 초기 로딩 | Skeleton |
| `empty` | 폴더에 에셋 없음 | EmptyState |
| `hasData` | 에셋 존재 | AssetGrid/AssetList |
| `grid` | 그리드 뷰 | AssetGrid 사용 |
| `list` | 리스트 뷰 | AssetList 사용 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | AssetStore | 에셋 상태 관리 |
| Widget | FolderTree | 폴더 트리 |
| Widget | AssetGrid | 그리드 뷰 |
| Widget | AssetList | 리스트 뷰 |
| Feature | AssetUploader | 업로드 |
| UI | SearchInput | 검색 |
| UI | Button | 액션 버튼 |

## Props

```typescript
interface AssetBrowserProps {
  initialFolderId?: string | null;             // 초기 폴더 ID
  mode?: "manage" | "picker";                  // 모드 (관리/선택)
  selectionMode?: "single" | "multiple";       // 선택 모드 (picker 모드)
  allowedTypes?: AssetKind[];                  // 허용 타입 (picker 모드)
  showFolderTree?: boolean;                    // 폴더 트리 표시
  showSearch?: boolean;                        // 검색창 표시
  showTypeFilter?: boolean;                    // 타입 필터 표시
  showViewToggle?: boolean;                    // 뷰 토글 표시
  showUploadButton?: boolean;                  // 업로드 버튼 표시
  showFolderCreateButton?: boolean;            // 폴더 생성 버튼 표시
  onAssetSelect?: (assets: Asset[]) => void;   // 에셋 선택 핸들러 (picker)
  onAssetClick?: (asset: Asset) => void;       // 에셋 클릭 핸들러
  onFolderChange?: (folder: Folder) => void;   // 폴더 변경 핸들러
  className?: string;                          // 추가 클래스
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AssetStore | currentFolderId | 현재 폴더 |
| AssetStore | searchKeyword | 검색어 |
| AssetStore | selectedKind | 타입 필터 |
| AssetStore | viewMode | 뷰 모드 |
| AssetStore | selectedAssetIds | 선택된 에셋 |
| AssetStore | pickerMode | Picker 모드 |
| AssetStore | selectionMode | 선택 모드 |
| AssetStore | setCurrentFolder() | 폴더 변경 |
| AssetStore | setSearchKeyword() | 검색 |
| AssetStore | setSelectedKind() | 타입 필터 |
| AssetStore | toggleViewMode() | 뷰 토글 |
| AssetStore | toggleAssetSelection() | 선택 토글 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onAssetClick` | 에셋 카드/행 클릭 | O (asset) |
| `onAssetSelect` | Picker 모드에서 선택 완료 | O (assets) |
| `onFolderChange` | 폴더 선택 변경 | O (folder) |
| `search` | 검색어 입력 | X |
| `viewToggle` | 뷰 모드 변경 | X |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| FolderTree | widget | `widgets/FolderTree` |
| AssetGrid | widget | `widgets/AssetGrid` |
| AssetList | widget | `widgets/AssetList` |
| AssetUploader | feature | `features/AssetUploader` |
| SearchFilterBar | widget | `widgets/SearchFilterBar` |
| TypeFilter | input | `inputs/TypeFilter` |
| ViewToggle | ui | `ui/ViewToggle` |

## 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header: Title, Description, Actions]                           │
├───────────────────┬─────────────────────────────────────────────┤
│                   │ [Toolbar: Search, Filter, ViewToggle]       │
│ [FolderTree]      ├─────────────────────────────────────────────┤
│ 240px             │ [AssetGrid or AssetList]                    │
│                   │                                             │
│                   │ [Pagination]                                │
└───────────────────┴─────────────────────────────────────────────┘
```

## 구현 체크리스트

- [ ] index.tsx
- [ ] observer 적용
- [ ] AssetStore 주입
- [ ] Props 타입 정의
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 초기 렌더링 | 1 | 0 | 0 | 1 |
| 폴더 변경 | 1 | 0 | 0 | 1 |
| 뷰 토글 | 1 | 0 | 0 | 1 |
| 검색 | 1 | 0 | 0 | 1 |
| 타입 필터 | 1 | 0 | 0 | 1 |
| 에셋 클릭 | 1 | 0 | 0 | 1 |

### [TC-001] 초기 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetBrowser 진입 |
| **When** | 컴포넌트 렌더링 |
| **Then** | FolderTree + AssetGrid 표시 |

### [TC-002] 폴더 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetBrowser 렌더링됨 |
| **When** | FolderTree에서 폴더 선택 |
| **Then** | setCurrentFolder() 호출, 해당 폴더 에셋 표시 |

### [TC-003] 뷰 토글

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | viewMode="grid" |
| **When** | 뷰 토글 버튼 클릭 |
| **Then** | toggleViewMode() 호출, AssetList로 전환 |

### [TC-004] 검색

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetBrowser 렌더링됨 |
| **When** | 검색어 입력 |
| **Then** | setSearchKeyword() 호출, 검색 결과 표시 |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-22 | 초기 생성 | req-feature-planner |
| 2026-02-26 | Stage 5 정합화: assets 페이지-컴포넌트 스펙 경로/명칭 일치화 | orch-screen-planner |
| 2026-03-06 | widget 경로를 widgets로 통합 | codex |
