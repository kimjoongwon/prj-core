# AlbumCard Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AlbumCard/

## 역할

앨범 정보를 카드 형태로 표시하는 컴포넌트입니다. 커버 이미지, 앨범명, 에셋 수를 보여주며 선택 및 액션을 지원합니다.

## 디자인 목업

```
[일반 상태 - 커버 있음]
┌─────────────────────────┐
│                         │
│    [커버 이미지]        │
│    (그리드 레이아웃)    │
│                         │
├─────────────────────────┤
│ 여행 사진               │
│ 24개의 에셋             │
└─────────────────────────┘

[일반 상태 - 커버 없음]
┌─────────────────────────┐
│                         │
│       🖼️                │
│                         │
├─────────────────────────┤
│ 제품 이미지             │
│ 15개의 에셋             │
└─────────────────────────┘

[호버 상태]
┌─────────────────────────┐
│ [🔍]           [⋯]      │  ← 액션 버튼
│    [커버 이미지]        │
│                         │
├─────────────────────────┤
│ 여행 사진               │
│ 24개의 에셋             │
└─────────────────────────┘

[선택 상태]
┌─────────────────────────┐
│ ●                       │  ← 선택 표시
│    [커버 이미지]        │
│  (테두리 강조)          │
├─────────────────────────┤
│ 여행 사진               │
│ 24개의 에셋             │
└─────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `default` | 기본 상태 | 커버 + 이름 + 에셋 수 |
| `hover` | 마우스 호버 | 액션 버튼 표시 |
| `selected` | 선택됨 | 체크 아이콘 + 테두리 강조 |
| `empty` | 에셋 없음 | 빈 커버 + "0개의 에셋" |

## Props

```typescript
interface AlbumCardProps {
  album: Album;                                // 앨범 데이터
  assetCount?: number;                         // 에셋 수 (album.albumEntries?.length)
  coverUrl?: string;                           // 커버 이미지 URL
  coverAssets?: Asset[];                       // 커버용 에셋 목록 (그리드 표시용)
  isSelected?: boolean;                        // 선택 상태
  isSelectable?: boolean;                      // 선택 가능 여부
  showAssetCount?: boolean;                    // 에셋 수 표시
  showDescription?: boolean;                   // 설명 표시
  onClick?: (album: Album) => void;            // 클릭 핸들러
  onSelect?: (albumId: string) => void;        // 선택 핸들러
  onEdit?: (album: Album) => void;             // 수정 핸들러
  onDelete?: (album: Album) => void;           // 삭제 핸들러
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Card | `ui/Card` | 카드 컨테이너 |
| Image | `ui/Image` | 커버 이미지 |
| Badge | `ui/Badge` | 에셋 수 뱃지 |
| Checkbox | `ui/Checkbox` | 선택 체크박스 |
| DropdownMenu | `ui/DropdownMenu` | 액션 메뉴 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `cover` | 커버 영역 커스터마이징 |
| `overlay` | 커버 위 오버레이 |
| `actions` | 액션 버튼 커스터마이징 |
| `footer` | 하단 영역 추가 정보 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 너비 | 200px |
| 높이 | 240px |
| 커버 비율 | 4:3 |
| 라운드 | rounded-xl |
| 호버 효과 | scale-[1.02] + shadow-md |
| 선택 테두리 | ring-2 ring-primary |

## 커버 표시 방식

| 상황 | 표시 방식 |
|------|-----------|
| coverAssets 4개 이상 | 2x2 그리드 |
| coverAssets 1-3개 | 첫 번째 이미지만 |
| coverAssets 없음 | 기본 아이콘 |

## 구현 체크리스트

- [ ] index.tsx
- [ ] AlbumCoverGrid 서브컴포넌트 (2x2 그리드)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 렌더링 | 1 | 0 | 0 | 1 |
| 커버 표시 | 2 | 0 | 1 | 3 |
| 선택 상태 | 1 | 0 | 0 | 1 |
| 액션 | 2 | 0 | 0 | 2 |

### [TC-001] 앨범 카드 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | album 데이터, coverUrl 존재 |
| **When** | AlbumCard 렌더링 |
| **Then** | 커버 이미지 + 이름 + 에셋 수 표시 |

### [TC-002] 그리드 커버 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | coverAssets 4개 존재 |
| **When** | AlbumCard 렌더링 |
| **Then** | 2x2 그리드로 커버 표시 |

### [TC-003] 커버 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | coverUrl, coverAssets 없음 |
| **When** | AlbumCard 렌더링 |
| **Then** | 기본 아이콘 표시 |

### [TC-004] 클릭 이벤트

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | onClick 핸들러 전달 |
| **When** | 카드 클릭 |
| **Then** | onClick(album) 호출 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/albums/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | req-widget-planner |
