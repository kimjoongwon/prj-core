# AssetPicker Feature 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/AssetPicker/

## 역할

에셋 선택을 위한 모달 컴포넌트입니다. 단일/다중 선택 모드, 타입 필터링, 폴더 탐색을 지원하며 다른 도메인에서 재사용 가능합니다.

## 디자인 목업

```
[단일 선택 모드]
┌─────────────────────────────────────────────────────────────────────────────┐
│ 에셋 선택                                              [취소]  [선택 완료]    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────────────────────────────────────────┐│
│ │ 📁 폴더          │ │ 🔍 검색...                              [이미지만] ││
│ │                  │ ├─────────────────────────────────────────────────────┤│
│ │ 📂 루트          │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            ││
│ │   📂 이미지      │ │ │ ✓     │ │       │ │       │ │       │            ││
│ │   📂 비디오      │ │ │ [IMG] │ │ [IMG] │ │ [IMG] │ │ [IMG] │            ││
│ │   📂 문서        │ │ │ photo │ │ icon  │ │ banner│ │ logo  │            ││
│ │                  │ │ └───────┘ └───────┘ └───────┘ └───────┘            ││
│ │                  │ │                                                     ││
│ │                  │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            ││
│ │                  │ │ │       │ │       │ │       │ │       │            ││
│ │                  │ │ │ [IMG] │ │ [IMG] │ │ [IMG] │ │ [IMG] │            ││
│ │                  │ │ │ hero  │ │ bg    │ │ thumb │ │ avatar│            ││
│ └──────────────────┘ │ └───────┘ └───────┘ └───────┘ └───────┘            ││
│                      └─────────────────────────────────────────────────────┘│
│ 선택됨: photo.png                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

[다중 선택 모드]
┌─────────────────────────────────────────────────────────────────────────────┐
│ 에셋 선택 (여러 개 선택 가능)                  [취소]  [선택 완료 (3)]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ...                                                                          │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                                    │
│ │ ✓     │ │       │ │ ✓     │ │       │                                    │
│ │ [IMG] │ │ [IMG] │ │ [IMG] │ │ [IMG] │                                    │
│ │ photo │ │ icon  │ │ banner│ │ logo  │                                    │
│ └───────┘ └───────┘ └───────┘ └───────┘                                    │
│                                                                              │
│ 선택됨: 3개                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘

[로딩 상태]
┌─────────────────────────────────────────────────────────────────────────────┐
│ 에셋 선택...                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────────────────────────────────────────┐│
│ │ ░░░░░░░░░░░░░░░░ │ │ ░░░░░░░ ░░░░░░░ ░░░░░░░ ░░░░░░░                    ││
│ │ ░░░░░░░░░░░░░░░░ │ │ ░░░░░░░ ░░░░░░░ ░░░░░░░ ░░░░░░░                    ││
│ └──────────────────┘ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 로딩 중 | Skeleton 표시 |
| `empty` | 에셋 없음 | EmptyState |
| `hasData` | 데이터 있음 | AssetGrid 표시 |
| `single` | 단일 선택 | 1개만 선택 가능 |
| `multiple` | 다중 선택 | 여러 개 선택 가능 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | AssetStore | 선택 상태 관리 |
| Widget | AssetGrid | 에셋 그리드 |
| Widget | FolderTree | 폴더 트리 |
| UI | Modal | 모달 컨테이너 |
| UI | Button | 액션 버튼 |
| Input | SearchInput | 검색 입력 |

## Props

```typescript
interface AssetPickerProps {
  isOpen: boolean;                             // 모달 열림 상태
  onClose: () => void;                         // 닫기 핸들러
  onSelect: (assets: Asset[]) => void;         // 선택 완료 핸들러
  selectionMode?: "single" | "multiple";       // 선택 모드 (기본: single)
  allowedTypes?: AssetKind[];                  // 허용 타입 (예: ["IMAGE"])
  initialFolderId?: string | null;             // 초기 폴더 ID
  initialSelectedIds?: string[];               // 초기 선택 ID
  title?: string;                              // 모달 제목
  showFolderTree?: boolean;                    // 폴더 트리 표시 여부
  showSearch?: boolean;                        // 검색창 표시 여부
  showTypeFilter?: boolean;                    // 타입 필터 표시 여부
  maxSelection?: number;                       // 최대 선택 수 (다중 모드)
  className?: string;                          // 추가 클래스
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AssetStore | currentFolderId | 현재 폴더 ID |
| AssetStore | searchKeyword | 검색어 |
| AssetStore | selectedAssetIds | 선택된 에셋 ID |
| AssetStore | pickerMode | Picker 모드 여부 |
| AssetStore | selectionMode | 선택 모드 |
| AssetStore | allowedTypes | 허용 타입 |
| AssetStore | enterPickerMode() | Picker 모드 진입 |
| AssetStore | exitPickerMode() | Picker 모드 종료 |
| AssetStore | toggleAssetSelection() | 에셋 선택 토글 |
| AssetStore | clearSelection() | 선택 초기화 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onSelect` | 선택 완료 버튼 클릭 | O (assets 배열) |
| `onClose` | 취소/X 버튼 클릭 | O |
| `folderChange` | 폴더 선택 변경 | X |
| `search` | 검색어 입력 | X |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| Modal | ui | `ui/Modal` |
| FolderTree | widget | `widget/FolderTree` |
| AssetGrid | widget | `widget/AssetGrid` |
| SearchInput | input | `inputs/SearchInput` |
| Button | ui | `ui/Button` |
| TypeFilter | input | `inputs/TypeFilter` |

## 재사용 시나리오

| 사용처 | selectionMode | allowedTypes | 목적 |
|--------|---------------|--------------|------|
| 프로필 이미지 선택 | single | ["IMAGE"] | 사용자 프로필 이미지 |
| 콘텐츠 이미지 선택 | multiple | ["IMAGE"] | 에디터 이미지 삽입 |
| 비디오 선택 | single | ["VIDEO"] | 배너 비디오 |
| 문서 선택 | multiple | ["DOCUMENT"] | 첨부 파일 |
| 모든 타입 | multiple | [] (전체) | 일반 에셋 선택 |

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
| 모달 열기/닫기 | 2 | 0 | 0 | 2 |
| 단일 선택 | 1 | 0 | 1 | 2 |
| 다중 선택 | 1 | 0 | 1 | 2 |
| 타입 필터 | 1 | 0 | 0 | 1 |
| 폴더 탐색 | 1 | 0 | 0 | 1 |
| 검색 | 1 | 0 | 0 | 1 |

### [TC-001] 모달 열기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isOpen=false |
| **When** | isOpen=true로 변경 |
| **Then** | 모달이 표시되고 enterPickerMode() 호출 |

### [TC-002] 단일 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectionMode="single" |
| **When** | 에셋 1개 클릭 후 선택 완료 |
| **Then** | onSelect([asset]) 호출 |

### [TC-003] 다중 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | selectionMode="multiple" |
| **When** | 에셋 3개 선택 후 선택 완료 |
| **Then** | onSelect([asset1, asset2, asset3]) 호출 |

### [TC-004] 최대 선택 수 제한

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | selectionMode="multiple", maxSelection=3 |
| **When** | 4번째 에셋 선택 시도 |
| **Then** | 선택 불가 (토스트 메시지) |

### [TC-005] 타입 필터링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | allowedTypes=["IMAGE"] |
| **When** | AssetPicker 렌더링 |
| **Then** | 이미지 타입만 표시 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | req-feature-planner |
