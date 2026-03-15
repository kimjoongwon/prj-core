# FolderTree Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/FolderTree/

## 역할

폴더 계층 구조를 트리 형태로 표시하는 컴포넌트입니다. 확장/축소, 선택, 폴더 생성/이름 변경/삭제 진입 기능을 지원합니다.

## 디자인 목업

```
┌───────────────────────────────┐
│ 폴더             [+ 폴더 생성] │
├───────────────────────────────┤
│                               │
│ ▼ 📁 루트                     │  ← 현재 선택 (강조)
│   ├── 📁 이미지               │
│   │   ├── 📁 배너             │
│   │   └── 📁 아이콘           │
│   ├── 📁 비디오               │
│   │   └── 📁 프로모션         │
│   ├── 📁 문서                 │
│   └── 📁 보관함               │
│                               │
└───────────────────────────────┘

[컨텍스트 메뉴]
┌───────────────────┐
│ 하위 폴더 생성    │
│ 이름 변경         │
│───────────────────│
│ 삭제              │
└───────────────────┘

[폴더 생성 모달]
┌─────────────────────────────────────┐
│ 폴더 생성                      [X]  │
├─────────────────────────────────────┤
│                                     │
│ 폴더명                              │
│ ┌─────────────────────────────────┐ │
│ │ 새 폴더                         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 상위 폴더                           │
│ ┌─────────────────────────────────┐ │
│ │ 📁 /이미지                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│                  [취소]  [생성]     │
└─────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태        | 설명        | 시각적 변화               |
| ----------- | ----------- | ------------------------- |
| `collapsed` | 폴더 축소   | ▶ 아이콘                  |
| `expanded`  | 폴더 확장   | ▼ 아이콘 + 하위 폴더 표시 |
| `selected`  | 폴더 선택   | bg-primary/10 강조        |
| `hover`     | 마우스 호버 | bg-content2               |
| `loading`   | 로딩 중     | 스핀너 표시               |

## Props

```typescript
interface FolderTreeProps {
  folders: FolderTreeItem[]; // 폴더 목록 (플랫 리스트)
  selectedFolderId?: string | null; // 선택된 폴더 ID
  expandedFolderIds?: Set<string>; // 확장된 폴더 ID 목록
  showCreateButton?: boolean; // 폴더 생성 버튼 표시
  showRenameButton?: boolean; // 폴더 이름 변경 버튼 표시
  showDeleteButton?: boolean; // 폴더 삭제 버튼 표시
  onSelect?: (folder: FolderTreeItem | null) => void; // 폴더 선택 핸들러 (null = 전체 폴더)
  onExpand?: (folderId: string) => void; // 폴더 확장 핸들러
  onCollapse?: (folderId: string) => void; // 폴더 축소 핸들러
  onCreate?: () => void; // 폴더 생성 UI 진입 핸들러
  onRename?: (folder: FolderTreeItem) => void; // 폴더 이름 변경 UI 진입 핸들러
  onDelete?: (folder: FolderTreeItem) => void; // 폴더 삭제 UI 진입 핸들러
  isLoading?: boolean; // 로딩 상태
  className?: string; // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트    | 기획서           | 역할                     |
| ----------- | ---------------- | ------------------------ |
| TreeView    | `ui/TreeView`    | 트리 뷰 기본             |
| IconButton  | `ui/IconButton`  | 확장/축소 버튼           |
| Button      | `ui/Button`      | 폴더 생성 버튼           |
| ContextMenu | `ui/ContextMenu` | 컨텍스트 메뉴            |
| Modal       | `ui/Modal`       | 폴더 생성/이름 변경 모달 |
| Input       | `inputs/Input`   | 폴더명 입력              |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯            | 설명                     |
| --------------- | ------------------------ |
| `header`        | 헤더 영역 커스터마이징   |
| `folderIcon`    | 폴더 아이콘 커스터마이징 |
| `folderActions` | 폴더 행 액션 버튼        |
| `empty`         | 폴더 없을 때 표시        |

## 디자인 토큰

| 항목        | 값              |
| ----------- | --------------- |
| 너비        | 240px (기본)    |
| 행 높이     | 36px            |
| 들여쓰기    | 20px per level  |
| 라운드      | rounded-lg (행) |
| 아이콘 크기 | 16px            |

## 폴더 노드 구조

```typescript
interface FolderNode {
  id: string;
  name: string;
  path: string;
  depth: number;
  children: FolderNode[];
  isExpanded: boolean;
  isSelected: boolean;
}
```

## 구현 체크리스트

- [x] FolderTree.tsx
- [x] flat 리스트 → 트리 렌더링
- [x] FolderNode 서브컴포넌트
- [ ] FolderCreateModal 서브컴포넌트
- [x] header rename/delete action hook
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능          | Happy Path | Error Path | Edge Case | 합계 |
| ------------- | :--------: | :--------: | :-------: | :--: |
| 트리 렌더링   |     1      |     0      |     0     |  1   |
| 확장/축소     |     2      |     0      |     0     |  2   |
| 폴더 선택     |     1      |     0      |     0     |  1   |
| 폴더 생성     |     1      |     0      |     1     |  2   |
| 컨텍스트 메뉴 |     1      |     0      |     0     |  1   |

### [TC-001] 트리 렌더링

**분류:** Happy Path

| 구분      | 내용                    |
| --------- | ----------------------- |
| **Given** | 계층적 폴더 구조 데이터 |
| **When**  | FolderTree 렌더링       |
| **Then**  | 트리 형태로 폴더 표시   |

### [TC-002] 폴더 확장

**분류:** Happy Path

| 구분      | 내용                           |
| --------- | ------------------------------ |
| **Given** | 축소된 폴더                    |
| **When**  | 확장 버튼 클릭                 |
| **Then**  | onExpand 호출 + 하위 폴더 표시 |

### [TC-003] 폴더 선택

**분류:** Happy Path

| 구분      | 내용                             |
| --------- | -------------------------------- |
| **Given** | 폴더 목록                        |
| **When**  | 폴더 클릭                        |
| **Then**  | onSelect 호출 + 선택 스타일 적용 |

### [TC-004] 폴더 생성

**분류:** Happy Path

| 구분      | 내용                                     |
| --------- | ---------------------------------------- |
| **Given** | showCreateButton=true                    |
| **When**  | 폴더 생성 버튼 클릭 → 폴더명 입력 → 생성 |
| **Then**  | onCreate 호출                            |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자       | 내용                                                                                                                      | 작성자              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 2026-03-15 | assets 남은 폴더 관리 범위를 위해 selected folder 기반 rename/delete header action hook을 추가                            | codex               |
| 2026-03-15 | assets 목록 Stage 5 최소 구현으로 트리 렌더링/선택/확장 기능을 우선 구현하고 create modal/context menu는 후속 과제로 분리 | codex               |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일                                      | codex               |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/\* 기준으로 상향                                                              | codex               |
| 2026-02-22 | 초기 생성                                                                                                                 | req-widget-planner  |
| 2026-02-26 | Stage 5 정합화: assets 페이지-컴포넌트 스펙 경로/명칭 일치화                                                              | orch-screen-planner |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리                                                                     | codex               |
