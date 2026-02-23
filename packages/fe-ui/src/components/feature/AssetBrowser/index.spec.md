# AssetBrowser Feature 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/AssetBrowser/

## 역할

에셋 목록을 그리드 또는 리스트 형태로 표시하는 Feature 컴포넌트입니다. AssetStore와 연결하여 뷰 모드, 선택 상태를 관리하며 무한 스크롤을 지원합니다.

## 디자인 목업

```
[그리드 뷰]
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │
│ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │ │ [IMG] │               │
│ │ image │ │ photo │ │ video │ │ doc   │ │ logo  │ │ banner│               │
│ │ .jpg  │ │ .png  │ │ .mp4  │ │ .pdf  │ │ .svg  │ │ .webp │               │
│ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘               │
│                                                                             │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │
│ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │ │ [IMG] │               │
│ │ icon  │ │ hero  │ │ promo │ │ guide │ │ thumb │ │ avatar│               │
│ │ .png  │ │ .jpg  │ │ .mov  │ │ .xlsx │ │ .gif  │ │ .jpeg │               │
│ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘               │
└─────────────────────────────────────────────────────────────────────────────┘

[리스트 뷰]
┌─────────────────────────────────────────────────────────────────────────────┐
│ ☐ │ 미리보기 │ 파일명        │ 타입  │ 크기     │ 날짜                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ☐ │ [IMG]    │ banner.jpg    │ IMG   │ 2.4 MB   │ 2026.02.22               │
│ ☐ │ [IMG]    │ photo.png     │ IMG   │ 1.2 MB   │ 2026.02.21               │
│ ☐ │ [VID]    │ promo.mp4     │ VID   │ 45 MB    │ 2026.02.20               │
│ ✓ │ [DOC]    │ guide.pdf     │ DOC   │ 3.5 MB   │ 2026.02.19               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 초기 로딩 | Spinner + "로딩 중..." |
| `empty` | 폴더에 에셋 없음 | EmptyState (아이콘 + 메시지) |
| `hasData` | 에셋 존재 | AssetGrid/AssetList |
| `grid` | 그리드 뷰 | 6열 그리드 |
| `list` | 리스트 뷰 | 테이블 형태 |
| `selected` | 선택됨 | primary border + check 표시 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | AssetStore | 뷰 모드, 선택 상태 |
| UI | VStack, HStack | 레이아웃 |
| UI | Spinner | 로딩 표시 |
| Icon | lucide-react | 파일 타입 아이콘 |

## Props

```typescript
interface AssetBrowserProps {
  initialFolderId?: string | null;             // 초기 폴더 ID
  assets?: Asset[];                            // 에셋 목록 데이터 (외부 주입)
  isLoading?: boolean;                         // 로딩 상태
  pickerMode?: boolean;                        // Picker 모드 여부
  className?: string;                          // 추가 클래스
  onAssetClick?: (asset: Asset) => void;       // 에셋 클릭 핸들러
  onAssetSelect?: (assets: Asset[]) => void;   // 에셋 선택 핸들러 (Picker)
  onLoadMore?: () => void;                     // 더 많은 데이터 로드
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AssetStore | currentFolderId | 현재 폴더 |
| AssetStore | viewMode | 뷰 모드 |
| AssetStore | selectedAssetIds | 선택된 에셋 |
| AssetStore | setCurrentFolder() | 폴더 설정 |
| AssetStore | toggleAssetSelection() | 선택 토글 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onAssetClick` | 에셋 카드/행 클릭 | O (asset) |
| `onAssetSelect` | Picker 모드에서 선택 변경 | O (assets) |
| `onLoadMore` | 스크롤 끝 도달 | O |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| Spinner | ui | HeroUI |
| VStack, HStack | ui | `ui/surfaces` |

## 기능

### 무한 스크롤

- 페이지당 20개 에셋 표시
- 스크롤 끝에서 100px 남았을 때 다음 페이지 로드
- `onLoadMore` 콜백 호출

### 파일 타입별 아이콘

| Kind | 아이콘 | 색상 |
|------|--------|------|
| IMAGE | Image | blue-500 |
| VIDEO | FileVideo | purple-500 |
| DOCUMENT | FileText | orange-500 |
| OTHER | File | gray-500 |

### 썸네일 표시

- metadata.thumbnailUrl 있으면 사용
- IMAGE 타입이면 `/api/assets/{id}/file` 사용
- 없으면 타입별 아이콘 표시

## 레이아웃 구조

```
┌─────────────────────────────────────────────┐
│ [Grid/List View]                           │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │     │ │     │ │     │ │     │ │     │   │
│ │ ... │ │ ... │ │ ... │ │ ... │ │ ... │   │
│ │     │ │     │ │     │ │     │ │     │   │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   │
│                                            │
│ [Loading Spinner] (조건부)                 │
└─────────────────────────────────────────────┘
```

## 구현 체크리스트

- [x] AssetBrowser.tsx
- [x] observer 적용
- [x] AssetStore 연결
- [x] Props 타입 정의
- [x] index.ts export
- [x] 그리드 뷰 구현
- [x] 리스트 뷰 구현
- [x] 무한 스크롤 구현
- [x] 파일 크기 포맷팅
- [x] 날짜 포맷팅
- [x] 썸네일 표시

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 초기 렌더링 | 1 | 0 | 0 | 1 |
| 그리드 뷰 | 1 | 0 | 0 | 1 |
| 리스트 뷰 | 1 | 0 | 0 | 1 |
| 에셋 선택 | 1 | 0 | 0 | 1 |
| 무한 스크롤 | 1 | 0 | 1 | 2 |
| 빈 상태 | 1 | 0 | 0 | 1 |

### [TC-001] 초기 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | assets 목록 제공 |
| **When** | AssetBrowser 렌더링 |
| **Then** | 그리드 형태로 에셋 목록 표시 |

### [TC-002] 뷰 모드 전환

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | viewMode="grid" |
| **When** | Store에서 viewMode="list"로 변경 |
| **Then** | 리스트 형태로 전환 |

### [TC-003] 에셋 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | pickerMode=true |
| **When** | 에셋 클릭 |
| **Then** | toggleAssetSelection() 호출 |

### [TC-004] 무한 스크롤

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 100개 이상의 에셋 |
| **When** | 스크롤 끝 도달 |
| **Then** | onLoadMore 콜백 호출 |

### [TC-005] 빈 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | assets=[] |
| **When** | 렌더링 |
| **Then** | EmptyState 표시 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/page.spec.md`
- `feature/AssetManager`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | req-feature-planner |
| 2026-02-23 | 구현 완료, 체크리스트 업데이트 | fe-feature-builder |
