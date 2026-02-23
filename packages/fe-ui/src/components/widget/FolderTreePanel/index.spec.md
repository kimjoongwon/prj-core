# FolderTreePanel Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/FolderTreePanel/

## 역할

폴더 계층 구조를 트리 형태로 표시하는 컴포넌트입니다. 확장/축소, 선택 기능을 지원합니다.

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
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `collapsed` | 폴더 축소 | ▶ 아이콘 |
| `expanded` | 폴더 확장 | ▼ 아이콘 + 하위 폴더 표시 |
| `selected` | 폴더 선택 | bg-primary/10 강조 |
| `hover` | 마우스 호버 | bg-content2 |

## Props

```typescript
interface FolderTreePanelProps {
  folders: FolderTreeItem[];                   // 폴더 목록 (계층 구조)
  selectedFolderId?: string | null;            // 선택된 폴더 ID
  expandedFolderIds: Set<string>;              // 확장된 폴더 ID Set
  onSelect: (folderId: string) => void;        // 폴더 선택 핸들러
  onExpand: (folderId: string) => void;        // 폴더 확장 핸들러
  onCollapse: (folderId: string) => void;      // 폴더 축소 핸들러
  onCreate?: (parentId: string | null, name: string) => void; // 폴더 생성 핸들러
  onRename?: (folder: FolderTreeItem, newName: string) => void; // 이름 변경 핸들러
  onDelete?: (folder: FolderTreeItem) => void; // 폴더 삭제 핸들러
  showCreateButton?: boolean;                  // 폴더 생성 버튼 표시
  isLoading?: boolean;                         // 로딩 상태
  width?: number;                              // 패널 너비
  className?: string;                          // 추가 클래스
}

interface FolderTreeItem {
  id: string;
  name: string;
  path: string;
  parentId?: string | null;
  children?: FolderTreeItem[];
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Button | HeroUI | 폴더 생성 버튼 |
| HStack | ui/surfaces | 가로 레이아웃 |
| VStack | ui/surfaces | 세로 레이아웃 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 너비 | 240px (기본) |
| 행 높이 | 36px |
| 들여쓰기 | 16px per level |
| 라운드 | rounded-lg (행) |
| 아이콘 크기 | 16px |

## 구현 체크리스트

- [x] FolderTreePanel.tsx
- [x] FolderNode 서브컴포넌트
- [x] index.ts (barrel export)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 상위 기획서

- `apps/admin/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | fe-widget-builder |
