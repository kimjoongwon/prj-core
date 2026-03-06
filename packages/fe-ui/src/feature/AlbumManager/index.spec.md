# AlbumManager Feature 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: feature
> 위치: packages/fe-ui/src/feature/AlbumManager/

## 역할

앨범 관리를 담당하는 컴포넌트입니다. 앨범 생성, 수정, 삭제, 에셋 추가/제거, 순서 변경을 AlbumStore와 연결하여 처리합니다.

## 디자인 목업

```
[앨범 목록 관리]
┌─────────────────────────────────────────────────────────────────────────────┐
│ 앨범                                        [+ 앨범 생성]                     │
│ 에셋 컬렉션을 관리합니다.                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ [커버]      │ │ [커버]      │ │ [커버]      │ │ [+]         │            │
│ │             │ │             │ │             │ │             │            │
│ │ 여행 사진   │ │ 제품 이미지 │ │ 프로모션    │ │ 새 앨범     │            │
│ │ 24개        │ │ 15개        │ │ 8개         │ │             │            │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘

[앨범 상세 - 에셋 관리]
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← 앨범 목록                        [+ 에셋 추가]  [순서 편집]  [앨범 수정]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 여행 사진                                                                   │
│ 24개의 에셋                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐            │
│ │ ⋮⋮ │ [IMG] │ 일몰          │ │ ⋮⋮ │ [IMG] │ 해변          │            │
│ │    │       │ [🗑️]          │ │    │       │ [🗑️]          │            │
│ └─────────────────────────────┘ └─────────────────────────────┘            │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐            │
│ │ ⋮⋮ │ [IMG] │ 산 정상       │ │ ⋮⋮ │ [IMG] │ 시장          │            │
│ │    │       │ [🗑️]          │ │    │       │ [🗑️]          │            │
│ └─────────────────────────────┘ └─────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘

[앨범 생성/수정 모달]
┌─────────────────────────────────────────────┐
│ 앨범 생성                              [X]  │
├─────────────────────────────────────────────┤
│                                             │
│ 앨범명 *                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ 여행 사진                               │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 설명                                        │
│ ┌─────────────────────────────────────────┐ │
│ │ 2024년 여름 여행지 사진 모음            │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 커버 이미지                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ [이미지 선택]                           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│                          [취소]  [생성]     │
└─────────────────────────────────────────────┘

[에셋 추가 모달 (AssetPicker)]
┌─────────────────────────────────────────────────────────────────────────────┐
│ 에셋 추가                                        [취소]  [추가 (3)]        │
├─────────────────────────────────────────────────────────────────────────────┤
│ [AssetPicker 컴포넌트]                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `list` | 앨범 목록 | AlbumCard 그리드 |
| `detail` | 앨범 상세 | AlbumEntryCard 목록 |
| `reorder` | 순서 편집 | 드래그 핸들 활성화 |
| `create` | 앨범 생성 | 생성 모달 |
| `edit` | 앨범 수정 | 수정 모달 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | AlbumStore | 앨범 상태 관리 |
| Store | AssetStore | 에셋 선택 (Picker) |
| Widget | AlbumCard | 앨범 카드 |
| Widget | AlbumEntryCard | 앨범 엔트리 카드 |
| Feature | AssetPicker | 에셋 선택기 |
| UI | Modal | 모달 |
| UI | Button | 액션 버튼 |

## Props

```typescript
interface AlbumManagerProps {
  mode?: "list" | "detail";                    // 모드
  albumId?: string | null;                     // 상세 모드일 때 앨범 ID
  showCreateButton?: boolean;                  // 생성 버튼 표시
  showEditButton?: boolean;                    // 수정 버튼 표시
  showDeleteButton?: boolean;                  // 삭제 버튼 표시
  showReorderButton?: boolean;                 // 순서 편집 버튼 표시
  onAlbumCreate?: (album: Album) => void;      // 앨범 생성 핸들러
  onAlbumUpdate?: (album: Album) => void;      // 앨범 수정 핸들러
  onAlbumDelete?: (album: Album) => void;      // 앨범 삭제 핸들러
  onAlbumSelect?: (album: Album) => void;      // 앨범 선택 핸들러
  onBack?: () => void;                         // 뒤로가기 핸들러
  className?: string;                          // 추가 클래스
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AlbumStore | currentAlbumId | 현재 앨범 |
| AlbumStore | isReorderMode | 순서 편집 모드 |
| AlbumStore | selectedEntryIds | 선택된 엔트리 |
| AlbumStore | isAddAssetModalOpen | 에셋 추가 모달 상태 |
| AlbumStore | isEditAlbumModalOpen | 앨범 편집 모달 상태 |
| AlbumStore | setCurrentAlbum() | 앨범 설정 |
| AlbumStore | toggleReorderMode() | 순서 편집 토글 |
| AlbumStore | openAddAssetModal() | 에셋 추가 모달 열기 |
| AlbumStore | closeAddAssetModal() | 에셋 추가 모달 닫기 |
| AlbumStore | addAssetsToAlbum() | 에셋 추가 |
| AlbumStore | removeEntry() | 엔트리 제거 |
| AlbumStore | reorderEntries() | 순서 변경 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onAlbumCreate` | 앨범 생성 완료 | O (album) |
| `onAlbumUpdate` | 앨범 수정 완료 | O (album) |
| `onAlbumDelete` | 앨범 삭제 완료 | O (album) |
| `onAlbumSelect` | 앨범 카드 클릭 | O (album) |
| `onBack` | 뒤로가기 클릭 | O |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| AlbumCard | widget | `widgets/AlbumCard` |
| AlbumEntryCard | widget | `widgets/AlbumEntryCard` |
| AssetPicker | feature | `features/AssetPicker` |
| AlbumFormModal | ui | 내부 모달 |
| Button | ui | `ui/Button` |
| Modal | ui | `ui/Modal` |

## 기능 시나리오

### 앨범 생성
1. [+ 앨범 생성] 버튼 클릭
2. AlbumFormModal 표시
3. 앨범명, 설명, 커버 이미지 입력
4. [생성] 버튼 클릭
5. API 호출 후 앨범 목록 갱신

### 에셋 추가
1. 앨범 상세에서 [+ 에셋 추가] 버튼 클릭
2. openAddAssetModal() 호출
3. AssetPicker 모달 표시
4. 에셋 선택 후 [추가] 버튼 클릭
5. addAssetsToAlbum() 호출

### 순서 변경
1. [순서 편집] 버튼 클릭
2. toggleReorderMode() 호출
3. 드래그 핸들 활성화
4. 드래그 앤 드롭으로 순서 변경
5. reorderEntries() 호출

## 구현 체크리스트

- [ ] index.tsx
- [ ] observer 적용
- [ ] AlbumStore 주입
- [ ] AlbumFormModal 서브컴포넌트
- [ ] Props 타입 정의
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 앨범 목록 렌더링 | 1 | 0 | 0 | 1 |
| 앨범 생성 | 1 | 1 | 0 | 2 |
| 앨범 수정 | 1 | 0 | 0 | 1 |
| 앨범 삭제 | 1 | 1 | 0 | 2 |
| 에셋 추가 | 1 | 0 | 0 | 1 |
| 에셋 제거 | 1 | 0 | 0 | 1 |
| 순서 변경 | 1 | 0 | 0 | 1 |

### [TC-001] 앨범 목록 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AlbumManager 진입 |
| **When** | 컴포넌트 렌더링 |
| **Then** | AlbumCard 그리드 표시 |

### [TC-002] 앨범 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AlbumManager 렌더링됨 |
| **When** | 앨범 생성 버튼 → 폼 입력 → 생성 |
| **Then** | onAlbumCreate 호출 |

### [TC-003] 앨범 생성 - 유효성 실패

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | AlbumManager 렌더링됨 |
| **When** | 앨범명 없이 생성 시도 |
| **Then** | 유효성 에러 메시지 표시 |

### [TC-004] 에셋 추가

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범 상세 모드 |
| **When** | 에셋 추가 버튼 → AssetPicker에서 선택 → 추가 |
| **Then** | addAssetsToAlbum() 호출 |

### [TC-005] 순서 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범 상세 모드 |
| **When** | 순서 편집 → 드래그 앤 드롭 |
| **Then** | reorderEntries() 호출 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/albums/page.spec.md`
- `apps/admin/src/app/(admin)/assets/albums/[albumId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-22 | 초기 생성 | req-feature-planner |
| 2026-03-06 | widget 경로를 widgets로 통합 | codex |
