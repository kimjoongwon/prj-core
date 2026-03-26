# AssetCard Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/AssetCard/

## 역할

개별 에셋을 카드 형태로 표시하는 컴포넌트입니다. 썸네일, 파일명, 메타 정보를 보여주며 선택 상태와 호버 액션을 지원합니다.

## 디자인 목업

```
[일반 상태]
┌─────────────────┐
│                 │
│    [썸네일]      │
│                 │
│                 │
├─────────────────┤
│ banner.jpg      │
│ 2.4 MB · IMAGE  │
└─────────────────┘

[비디오 타입]
┌─────────────────┐
│                 │
│    [프리뷰]      │
│       ▶         │
│     02:30       │
├─────────────────┤
│ promo.mp4       │
│ 45.2 MB · VIDEO │
└─────────────────┘

[문서 타입]
┌─────────────────┐
│                 │
│      📄         │
│     PDF         │
│                 │
├─────────────────┤
│ guide.pdf       │
│ 2.1 MB · DOC    │
└─────────────────┘

[선택 상태]
┌─────────────────┐
│ ●               │  ← 좌측 상단 체크 표시
│    [썸네일]      │
│   (테두리 강조)   │
│                 │
├─────────────────┤
│ banner.jpg      │
│ 2.4 MB · IMAGE  │
└─────────────────┘

[호버 상태]
┌─────────────────┐
│ [🔍]     [🗑️]   │  ← 우측 상단 액션 버튼
│    [썸네일]      │
│                 │
│                 │
├─────────────────┤
│ banner.jpg      │
│ 2.4 MB · IMAGE  │
└─────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| `default` | 썸네일 + 파일명 + 크기 |
| `compact` | 썸네일(작게) + 파일명만 |
| `detailed` | 썸네일 + 파일명 + 크기 + 타입 + 상태 |

## Props

```typescript
interface AssetCardProps {
  asset: Asset;                                // 에셋 데이터
  isSelected?: boolean;                        // 선택 상태
  isSelectable?: boolean;                      // 선택 가능 여부
  showSize?: boolean;                          // 파일 크기 표시
  showType?: boolean;                          // 타입 뱃지 표시
  showStatus?: boolean;                        // 상태 표시
  variant?: "default" | "compact" | "detailed"; // 변형
  onClick?: (asset: Asset) => void;            // 클릭 핸들러
  onSelect?: (assetId: string) => void;        // 선택 핸들러
  onPreview?: (asset: Asset) => void;          // 미리보기 핸들러
  onDelete?: (asset: Asset) => void;           // 삭제 핸들러
  thumbnailUrl?: string;                       // 썸네일 URL (Derivative)
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| AssetThumbnail | `widgets/AssetThumbnail` | 타입별 썸네일 렌더링 |
| AssetTypeIcon | `widgets/AssetTypeIcon` | 타입별 아이콘 |
| Badge | `ui/Badge` | 타입/상태 뱃지 |
| Checkbox | `ui/Checkbox` | 선택 체크박스 |
| IconButton | `ui/IconButton` | 호버 액션 버튼 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `overlay` | 썸네일 위 오버레이 컨텐츠 |
| `actions` | 호버 시 표시할 액션 버튼들 |
| `badge` | 커스텀 뱃지 |
| `footer` | 카드 하단 추가 정보 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 너비 | 160px (기본) |
| 높이 | 180px |
| 썸네일 비율 | 1:1 (정사각형) |
| 라운드 | rounded-lg |
| 호버 효과 | scale-[1.02] + shadow-md |
| 선택 테두리 | ring-2 ring-primary |

## 구현 체크리스트

- [ ] index.tsx
- [ ] types.ts
- [ ] Storybook 스토리 (타입별, 상태별)
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 렌더링 | 1 | 0 | 0 | 1 |
| 타입별 표시 | 3 | 0 | 0 | 3 |
| 선택 상태 | 2 | 0 | 0 | 2 |
| 호버 액션 | 1 | 0 | 0 | 1 |
| 이벤트 | 2 | 0 | 0 | 2 |

### [TC-001] 이미지 타입 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="IMAGE", thumbnailUrl 존재 |
| **When** | AssetCard 렌더링 |
| **Then** | 썸네일 이미지가 표시됨 |

### [TC-002] 비디오 타입 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="VIDEO" |
| **When** | AssetCard 렌더링 |
| **Then** | 재생 아이콘 + 재생 시간이 표시됨 |

### [TC-003] 문서 타입 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="DOCUMENT" |
| **When** | AssetCard 렌더링 |
| **Then** | 문서 아이콘 + 확장자가 표시됨 |

### [TC-004] 선택 상태 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isSelected=true, isSelectable=true |
| **When** | AssetCard 렌더링 |
| **Then** | 체크 아이콘 + 테두리 강조 |

### [TC-005] 클릭 이벤트

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | onClick 핸들러 전달됨 |
| **When** | 카드 클릭 |
| **Then** | onClick(asset) 호출됨 |

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
