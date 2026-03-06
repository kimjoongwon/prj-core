# AssetList Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/AssetList/

## 역할

에셋 목록을 테이블 형태로 표시하는 컴포넌트입니다. 상세 정보를 행으로 표시하며 정렬, 선택 기능을 지원합니다.

## 디자인 목업

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ☐ │ 미리보기      │ 파일명           │ 타입   │ 크기      │ 상태  │ 폴더    │ 등록일    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ☐ │ [IMG]         │ banner.jpg       │ IMAGE  │ 2.4 MB    │ READY │ /이미지  │ 2024.02.22│
│ ☐ │ [IMG]         │ photo.png        │ IMAGE  │ 1.2 MB    │ READY │ /이미지  │ 2024.02.21│
│ ☑ │ [VID] ▶       │ promo.mp4        │ VIDEO  │ 45.2 MB   │ READY │ /비디오  │ 2024.02.20│
│ ☐ │ [DOC] 📄      │ guide.pdf        │ DOC    │ 2.1 MB    │ READY │ /문서    │ 2024.02.19│
│ ☐ │ [IMG]         │ logo.svg         │ IMAGE  │ 45 KB     │ READY │ /이미지  │ 2024.02.18│
│ ☐ │ [VID] ▶       │ intro.mov        │ VIDEO  │ 120.5 MB  │ READY │ /비디오  │ 2024.02.17│
│ ☐ │ [DOC] 📄      │ manual.xlsx      │ DOC    │ 500 KB    │ READY │ /문서    │ 2024.02.16│
├──────────────────────────────────────────────────────────────────────────────────┤
│ 선택됨: 1개                                          < 1  2  [3]  4  5  >       │
└──────────────────────────────────────────────────────────────────────────────────┘

[정렬 가능 헤더]
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ☐ │ 미리보기      │ 파일명 ▲         │ 타입   │ 크기 ▼    │ 상태  │ 폴더    │ 등록일 ▼  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 데이터 로딩 중 | Skeleton 행 표시 |
| `empty` | 에셋 없음 | EmptyState 표시 |
| `hasData` | 에셋 존재 | 테이블 행 표시 |
| `sortable` | 정렬 가능 | 헤더에 정렬 아이콘 표시 |
| `selectable` | 선택 가능 | 체크박스 컬럼 표시 |

## Props

```typescript
interface AssetListProps {
  assets: Asset[];                              // 에셋 목록
  selectedIds?: Set<string>;                    // 선택된 ID 목록
  sortKey?: string;                             // 현재 정렬 키
  sortOrder?: "asc" | "desc";                   // 정렬 순서
  selectable?: boolean;                         // 선택 가능 여부
  columns?: AssetListColumn[];                  // 표시할 컬럼 구성
  onSelect?: (assetId: string) => void;         // 선택 핸들러
  onSelectAll?: (assetIds: string[]) => void;   // 전체 선택 핸들러
  onSort?: (key: string, order: "asc" | "desc") => void; // 정렬 핸들러
  onRowClick?: (asset: Asset) => void;          // 행 클릭 핸들러
  onLoadMore?: () => void;                      // 더 보기 핸들러
  hasMore?: boolean;                            // 더 불러올 데이터 존재 여부
  isLoading?: boolean;                          // 로딩 상태
  emptyMessage?: string;                        // 빈 상태 메시지
  className?: string;                           // 추가 클래스
}

interface AssetListColumn {
  key: string;                                  // 컬럼 키
  label: string;                                // 헤더 라벨
  width?: string | number;                      // 컬럼 너비
  sortable?: boolean;                           // 정렬 가능 여부
  render?: (asset: Asset) => React.ReactNode;   // 커스텀 렌더러
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Table | `ui/Table` | 기본 테이블 |
| Checkbox | `ui/Checkbox` | 선택 체크박스 |
| Badge | `ui/Badge` | 타입/상태 뱃지 |
| AssetThumbnail | `widgets/AssetThumbnail` | 미리보기 썸네일 |
| AssetTypeIcon | `widgets/AssetTypeIcon` | 타입 아이콘 |

## 상태 관리

**없음** (Store 사용 금禁 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `headerActions` | 테이블 헤더 우측 액션 |
| `rowActions` | 행 우측 액션 버튼들 |
| `empty` | 빈 상태 커스터마이징 |
| `footer` | 테이블 하단 영역 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 행 높이 | 56px |
| 미리보기 크기 | 40x40px |
| 라운드 | 행 rounded-lg |
| 호버 효과 | bg-content2 |
| 선택 효과 | bg-primary/10 |

## 기본 컬럼 구성

| 컬럼 | 키 | 너비 | 정렬 |
|------|-----|------|------|
| 선택 | select | 40px | X |
| 미리보기 | thumbnail | 60px | X |
| 파일명 | originalName | auto | O |
| 타입 | kind | 80px | O |
| 크기 | sizeBytes | 100px | O |
| 상태 | status | 80px | O |
| 폴더 | folder | 120px | X |
| 등록일 | createdAt | 120px | O |

## 구현 체크리스트

- [ ] index.tsx
- [ ] types.ts
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 렌더링 | 1 | 0 | 0 | 1 |
| 정렬 | 2 | 0 | 0 | 2 |
| 선택 | 2 | 0 | 0 | 2 |
| 커스텀 컬럼 | 1 | 0 | 0 | 1 |

### [TC-001] 테이블 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | assets 배열에 5개의 에셋 |
| **When** | AssetList 렌더링 |
| **Then** | 5개의 행이 표시됨 |

### [TC-002] 정렬 기능

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sortable=true인 컬럼 존재 |
| **When** | 파일명 헤더 클릭 |
| **Then** | onSort("originalName", "asc") 호출 |

### [TC-003] 단일 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectable=true |
| **When** | 첫 번째 행 체크박스 클릭 |
| **Then** | onSelect("asset-1") 호출 |

### [TC-004] 전체 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectable=true |
| **When** | 헤더 체크박스 클릭 |
| **Then** | onSelectAll(모든 assetIds) 호출 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-22 | 초기 생성 | req-widget-planner |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
