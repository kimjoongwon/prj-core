# AssetManager Feature 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/AssetManager/

## 역할

에셋 관리를 위한 메인 레이아웃 컴포넌트입니다. AssetStore와 연결하여 좌측 폴더 트리와 우측 에셋 그리드/리스트를 조합하고 필터/검색/뷰모드 상태를 관리합니다.

## 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 검색...                              [전체▼] [그리드|리스트] [폴더생성] [업로드] │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ 🏠 모든 에셋      │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐      │
│ 📂 이미지 >       │ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │      │
│ 📂 비디오 >       │ │ image │ │ photo │ │ video │ │ doc   │ │ logo  │      │
│ 📂 문서 >         │ │ .jpg  │ │ .png  │ │ .mp4  │ │ .pdf  │ │ .svg  │      │
│                   │ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘      │
│                   │                                                         │
│                   │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐      │
│                   │ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │      │
│                   │ │ banner│ │ icon  │ │ promo │ │ guide │ │ hero  │      │
│                   │ │ .webp │ │ .png  │ │ .mov  │ │ .xlsx │ │ .jpg  │      │
│                   │ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘      │
├───────────────────┴─────────────────────────────────────────────────────────┤
│ 3개 선택됨                    [전체 선택]         [삭제] [이동]              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `default` | 기본 상태 | FolderNavigator + AssetBrowser |
| `loading` | 로딩 중 | Spinner 표시 |
| `hasSelection` | 선택됨 | SelectionActionBar 표시 |
| `filterOpen` | 필터 열림 | 필터 패널 표시 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | AssetStore | 에셋 상태 관리 |
| Feature | FolderNavigator | 폴더 탐색 |
| Feature | AssetBrowser | 에셋 브라우저 |
| Widget | SearchFilterBar | 검색/필터 |
| UI | Button | 액션 버튼 |
| UI | Tabs | 뷰 모드 토글 |
| UI | VStack, HStack | 레이아웃 |

## Props

```typescript
interface AssetManagerProps {
  initialFolderId?: string | null;             // 초기 폴더 ID
  showFolderTree?: boolean;                    // 폴더 트리 표시 (기본: true)
  showSearch?: boolean;                        // 검색창 표시 (기본: true)
  showTypeFilter?: boolean;                    // 타입 필터 표시 (기본: true)
  showViewToggle?: boolean;                    // 뷰 토글 표시 (기본: true)
  showUploadButton?: boolean;                  // 업로드 버튼 표시 (기본: true)
  showFolderCreateButton?: boolean;            // 폴더 생성 버튼 표시 (기본: true)
  folders?: FolderItem[];                      // 폴더 트리 데이터 (외부 주입)
  assets?: Asset[];                            // 에셋 목록 데이터 (외부 주입)
  isLoading?: boolean;                         // 에셋 로딩 상태
  className?: string;                          // 추가 클래스
  onFolderChange?: (folderId: string | null) => void;  // 폴더 변경 핸들러
  onUploadClick?: () => void;                  // 업로드 버튼 클릭 핸들러
  onFolderCreateClick?: () => void;            // 폴더 생성 핸들러
  onAssetClick?: (asset: Asset) => void;       // 에셋 클릭 핸들러
  onLoadMore?: () => void;                     // 더 많은 데이터 로드
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AssetStore | currentFolderId | 현재 폴더 |
| AssetStore | searchKeyword | 검색어 |
| AssetStore | selectedKind | 타입 필터 |
| AssetStore | viewMode | 뷰 모드 |
| AssetStore | hasSelection | 선택 여부 |
| AssetStore | selectionCount | 선택 개수 |
| AssetStore | setSearchKeyword() | 검색어 설정 |
| AssetStore | setSelectedKind() | 타입 필터 설정 |
| AssetStore | setViewMode() | 뷰 모드 설정 |
| AssetStore | setCurrentFolder() | 폴더 변경 |
| AssetStore | clearSelection() | 선택 초기화 |
| AssetStore | selectAllAssets() | 전체 선택 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onFolderChange` | 폴더 선택 변경 | O (folderId) |
| `onUploadClick` | 업로드 버튼 클릭 | O |
| `onFolderCreateClick` | 폴더 생성 버튼 클릭 | O |
| `onAssetClick` | 에셋 클릭 | O (asset) |
| `onLoadMore` | 스크롤 끝 도달 | O |
| `search` | 검색어 입력 | X |
| `viewToggle` | 뷰 모드 변경 | X |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| FolderNavigator | feature | `feature/FolderNavigator` |
| AssetBrowser | feature | `feature/AssetBrowser` |
| SearchFilterBar | widget | `widget/SearchFilterBar` |
| Button | ui | `ui/Button` |
| Tabs | ui | HeroUI |

## 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ [Toolbar: Search, Filter, ViewToggle, Actions]                  │
├───────────────────┬─────────────────────────────────────────────┤
│ [FolderNavigator] │ [AssetBrowser]                              │
│ 256px             │ flex-1                                      │
│                   │                                             │
├───────────────────┴─────────────────────────────────────────────┤
│ [SelectionActionBar] (조건부 표시)                               │
└─────────────────────────────────────────────────────────────────┘
```

## 구현 체크리스트

- [x] AssetManager.tsx
- [x] observer 적용
- [x] AssetStore 연결
- [x] Props 타입 정의
- [x] index.ts export
- [x] FolderNavigator Feature 조합
- [x] AssetBrowser Feature 조합
- [x] SelectionActionBar 구현

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 초기 렌더링 | 1 | 0 | 0 | 1 |
| 검색 | 1 | 0 | 0 | 1 |
| 뷰 토글 | 1 | 0 | 0 | 1 |
| 폴더 변경 | 1 | 0 | 0 | 1 |
| 선택 액션 바 | 1 | 0 | 0 | 1 |
| 무한 스크롤 | 1 | 0 | 0 | 1 |

### [TC-001] 초기 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetManager 진입 |
| **When** | 컴포넌트 렌더링 |
| **Then** | FolderNavigator + AssetBrowser + Toolbar 표시 |

### [TC-002] 검색

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetManager 렌더링됨 |
| **When** | 검색어 입력 |
| **Then** | setSearchKeyword() 호출 |

### [TC-003] 뷰 토글

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | viewMode="grid" |
| **When** | 리스트 탭 클릭 |
| **Then** | setViewMode("list") 호출 |

### [TC-004] 폴더 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetManager 렌더링됨 |
| **When** | FolderNavigator에서 폴더 클릭 |
| **Then** | setCurrentFolder() 호출, onFolderChange 콜백 실행 |

### [TC-005] 선택 액션 바

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 에셋 선택됨 |
| **When** | hasSelection = true |
| **Then** | SelectionActionBar 표시 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | fe-feature-builder |
| 2026-02-23 | FolderNavigator, AssetBrowser 조합 추가 | fe-feature-builder |
