# AssetGrid Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/AssetGrid/

## 역할

에셋 목록을 그리드 형태로 표시하는 컴포넌트입니다. 썸네일 카드 형태로 에셋을 보여주며, 선택 모드와 페이지네이션/무한 스크롤을 지원합니다.

## 디자인 목업

```
[일반 모드]
┌──────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ [이미지] │ │ [이미지] │ │ [비디오] │ │ [문서]  │ │ [이미지] │ │ [이미지] │    │
│ │         │ │         │ │   ▶     │ │  📄    │ │         │ │         │    │
│ │ banner  │ │ photo   │ │ video   │ │ doc     │ │ logo    │ │ hero    │    │
│ │ 2.4 MB  │ │ 1.2 MB  │ │ 15.3 MB │ │ 500 KB  │ │ 45 KB   │ │ 3.1 MB  │    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ [이미지] │ │ [비디오] │ │ [이미지] │ │ [문서]  │ │ [이미지] │ │ [이미지] │    │
│ │         │ │   ▶     │ │         │ │  📄    │ │         │ │         │    │
│ │ icon    │ │ promo   │ │ banner2 │ │ guide   │ │ avatar  │ │ bg      │    │
│ │ 128 KB  │ │ 45.2 MB │ │ 890 KB  │ │ 2.1 MB  │ │ 67 KB   │ │ 1.5 MB  │    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                                              │
│                         < 1  2  [3]  4  5  >    총 48건                      │
└──────────────────────────────────────────────────────────────────────────────┘

[선택 모드]
┌──────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │✓[이미지] │ │ [이미지] │ │✓[비디오] │ │ [문서]  │ │ [이미지] │ │✓[이미지] │    │
│ │ ●       │ │         │ │ ●       │ │         │ │         │ │ ●       │    │
│ │ banner  │ │ photo   │ │ video   │ │ doc     │ │ logo    │ │ hero    │    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                                              │
│ 선택됨: 3개                                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

[빈 상태]
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                              📁                                              │
│                     업로드된 에셋이 없습니다                                  │
│                   파일을 드래그하거나 업로드하세요                            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 데이터 로딩 중 | Skeleton 그리드 표시 |
| `empty` | 에셋 없음 | EmptyState 아이콘 + 문구 |
| `hasData` | 에셋 존재 | AssetCard 그리드 표시 |
| `selectable` | 선택 모드 | 체크박스 표시, 선택 시 테두리 강조 |
| `dragOver` | 드래그 중 | 전체 영역 하이라이트 |

## Props

```typescript
interface AssetGridProps {
  assets: Asset[];                              // 에셋 목록
  selectedIds?: Set<string>;                    // 선택된 에셋 ID (선택 모드)
  onSelect?: (assetId: string) => void;         // 단일 선택 핸들러
  onMultipleSelect?: (assetIds: string[]) => void; // 다중 선택 핸들러
  onAssetClick?: (asset: Asset) => void;        // 에셋 클릭 핸들러
  onLoadMore?: () => void;                      // 더 보기 핸들러 (무한 스크롤)
  hasMore?: boolean;                            // 더 불러올 데이터 존재 여부
  isLoading?: boolean;                          // 로딩 상태
  selectable?: boolean;                         // 선택 모드 여부
  selectionMode?: "single" | "multiple";        // 선택 모드 타입
  allowedTypes?: AssetKind[];                   // 허용 타입 필터
  showSize?: boolean;                           // 파일 크기 표시 여부
  showType?: boolean;                           // 타입 뱃지 표시 여부
  emptyMessage?: string;                        // 빈 상태 메시지
  className?: string;                           // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| AssetCard | `widgets/AssetCard` | 개별 에셋 카드 |
| Skeleton | `ui/Skeleton` | 로딩 스켈레톤 |
| EmptyState | `ui/EmptyState` | 빈 상태 표시 |
| Pagination | `ui/Pagination` | 페이지네이션 (옵션) |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `emptyIcon` | 빈 상태 아이콘 커스터마이징 |
| `emptyAction` | 빈 상태 액션 버튼 |
| `cardOverlay` | 카드 오버레이 컨텐츠 |
| `footer` | 그리드 하단 영역 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 카드 너비 | 160px (기본), 반응형 |
| 카드 높이 | 180px (이미지 + 텍스트) |
| 간격 | gap-4 (16px) |
| 라운드 | rounded-lg |
| 선택 테두리 | ring-2 ring-primary |

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
| 렌더링 | 1 | 1 | 0 | 2 |
| 선택 모드 | 2 | 0 | 1 | 3 |
| 무한 스크롤 | 1 | 0 | 1 | 2 |
| 빈 상태 | 1 | 0 | 0 | 1 |

### [TC-001] 에셋 목록 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | assets 배열에 6개의 에셋 |
| **When** | AssetGrid 렌더링 |
| **Then** | 6개의 AssetCard가 표시됨 |

### [TC-002] 빈 상태 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | assets 배열이 비어있음 |
| **When** | AssetGrid 렌더링 |
| **Then** | EmptyState가 표시됨 |

### [TC-003] 선택 모드 - 단일 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectable=true, selectionMode="single" |
| **When** | 첫 번째 카드 클릭 |
| **Then** | onSelect("asset-1") 호출 |

### [TC-004] 선택 모드 - 다중 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectable=true, selectionMode="multiple" |
| **When** | 여러 카드 클릭 |
| **Then** | 선택된 모든 ID가 onMultipleSelect로 전달됨 |

### [TC-005] 타입 필터링 표시

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | allowedTypes=["IMAGE"] |
| **When** | IMAGE, VIDEO, DOCUMENT 타입 에셋 존재 |
| **Then** | IMAGE 타입만 카드가 표시됨 (필터링은 상위에서 처리, UI만) |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-22 | 초기 생성 | req-widget-planner |
| 2026-02-26 | Stage 5 정합화: assets 페이지-컴포넌트 스펙 경로/명칭 일치화 | orch-screen-planner |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
