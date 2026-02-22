# AlbumEntryCard Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AlbumEntryCard/

## 역할

앨범 내 개별 에셋 엔트리를 카드 형태로 표시하는 컴포넌트입니다. 드래그 핸들, 썸네일, 캡션, 제거 버튼을 제공합니다.

## 디자인 목업

```
[일반 상태]
┌─────────────────────────────┐
│ ⋮⋮  │ [썸네일]  │           │
│     │           │ 캡션...   │
│     │           │ [🗑️]      │
└─────────────────────────────┘

[편집 모드 - 캡션 편집]
┌─────────────────────────────┐
│ ⋮⋮  │ [썸네일]  │           │
│     │           │ ┌────────┐ │
│     │           │ │캡션... │ │
│     │           │ └────────┘ │
│     │           │ [완료]    │
└─────────────────────────────┘

[드래그 중]
┌─────────────────────────────┐
│ ⋮⋮  │ [썸네일]  │           │
│ grip│           │ 캡션...   │
│     │           │ [🗑️]      │
└─────────────────────────────┘
  ↑ shadow-lg + opacity-80

[드래그 핸들 강조]
┌─────────────────────────────┐
│ ███ │ [썸네일]  │           │
│ ⋮⋮  │           │ 캡션...   │
│     │           │ [🗑️]      │
└─────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `default` | 기본 상태 | 썸네일 + 캡션 표시 |
| `dragging` | 드래그 중 | shadow-lg + opacity-80 |
| `editing` | 캡션 편집 중 | 인풋 필드 표시 |
| `hover` | 마우스 호버 | 삭제 버튼 표시 |

## Props

```typescript
interface AlbumEntryCardProps {
  entry: AlbumEntry;                           // 앨범 엔트리 데이터
  asset: Asset;                                // 연결된 에셋 데이터
  thumbnailUrl?: string;                       // 썸네일 URL
  isDragging?: boolean;                        // 드래그 상태
  isEditable?: boolean;                        // 편집 가능 여부
  showCaption?: boolean;                       // 캡션 표시 여부
  showRemoveButton?: boolean;                  // 제거 버튼 표시
  onCaptionChange?: (entryId: string, caption: string) => void; // 캡션 변경 핸들러
  onRemove?: (entry: AlbumEntry) => void;      // 제거 핸들러
  onDragStart?: (entryId: string) => void;     // 드래그 시작 핸들러
  onDragEnd?: (entryId: string) => void;       // 드래그 종료 핸들러
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Card | `ui/Card` | 카드 컨테이너 |
| AssetThumbnail | `widget/AssetThumbnail` | 썸네일 |
| Input | `inputs/Input` | 캡션 입력 |
| IconButton | `ui/IconButton` | 삭제/드래그 핸들 버튼 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `dragHandle` | 드래그 핸들 커스터마이징 |
| `thumbnail` | 썸네일 영역 커스터마이징 |
| `actions` | 액션 버튼 영역 |
| `caption` | 캡션 영역 커스터마이징 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 높이 | 80px |
| 썸네일 크기 | 60x60px |
| 드래그 핸들 너비 | 24px |
| 라운드 | rounded-lg |
| 드래그 시 효과 | shadow-lg + opacity-80 |

## 레이아웃 구조

```
┌────────────────────────────────────────┐
│ [Drag Handle] │ [Thumbnail] │ Content  │
│    24px      │    60px    │  auto     │
└────────────────────────────────────────┘
```

## 구현 체크리스트

- [ ] index.tsx
- [ ] CaptionEditor 인라인 컴포넌트
- [ ] dnd-kit 연동 (드래그 앤 드롭)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 렌더링 | 1 | 0 | 0 | 1 |
| 캡션 표시/편집 | 2 | 0 | 0 | 2 |
| 제거 버튼 | 1 | 0 | 0 | 1 |
| 드래그 | 1 | 0 | 0 | 1 |

### [TC-001] 엔트리 카드 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | entry, asset 데이터 |
| **When** | AlbumEntryCard 렌더링 |
| **Then** | 드래그 핸들 + 썸네일 + 캡션 표시 |

### [TC-002] 캡션 편집

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isEditable=true |
| **When** | 캡션 영역 클릭 |
| **Then** | 인풋 필드로 전환 |

### [TC-003] 제거 버튼 클릭

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | showRemoveButton=true, onRemove 전달 |
| **When** | 삭제 버튼 클릭 |
| **Then** | onRemove(entry) 호출 |

### [TC-004] 드래그 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isDragging=true |
| **When** | AlbumEntryCard 렌더링 |
| **Then** | shadow-lg + opacity-80 스타일 적용 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/albums/[albumId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | req-widget-planner |
