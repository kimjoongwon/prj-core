# Table UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/data-display/Table/

## 역할

HeroUI Table과 TanStack React Table을 통합한 테이블 컴포넌트. 복합 정렬, 행 선택 기능을 제공한다. DataGrid의 내부 구현 컴포넌트이다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ 기본 테이블 ]

┌──────────────────────────────────────────────────────┐
│  이름          상태          역할          생성일      │  ← TableHeader
├──────────────────────────────────────────────────────┤
│  홍길동        활성          관리자        2026-01-01  │  ← TableRow
│  김철수        비활성        사용자        2026-01-02  │
│  이영희        활성          사용자        2026-01-03  │
└──────────────────────────────────────────────────────┘

[ SortableColumnHeader - 정렬 상태별 ]

  미정렬:       이름  ↕         (양방향 화살표)
  오름차순:     이름  ↑  (1)    (단일 정렬, 우선순위 배지)
  내림차순:     이름  ↓  (1)
  복합 정렬:    이름  ↑  (1)    생성일  ↓  (2)

[ 정렬 조작 안내 ]

  일반 클릭   → 단일 정렬 (asc → desc → 해제)
  Shift+클릭  → 복합 정렬 추가/토글
  Ctrl+클릭   → 해당 컬럼 정렬 제거

[ 행 선택 모드 ]

┌──────────────────────────────────────────────────────┐
│ ☑  이름          상태          역할          생성일   │
├──────────────────────────────────────────────────────┤
│ ☑  홍길동        활성          관리자        2026-01-01│  ← 선택됨
│ ☐  김철수        비활성        사용자        2026-01-02│
│ ☑  이영희        활성          사용자        2026-01-03│  ← 선택됨
└──────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 헤더 + 데이터 행 |
| 정렬 가능 | 헤더에 정렬 아이콘(↑↓) 표시 |
| 복합 정렬 | 헤더에 정렬 우선순위 숫자 배지 |
| 행 선택 | 체크박스 + 선택 하이라이트 |

## 하위 컴포넌트

| 컴포넌트 | 파일 | 역할 |
|----------|------|------|
| Table | Table.tsx | 메인 테이블 렌더링 |
| SortableColumnHeader | SortableColumnHeader.tsx | 정렬 가능한 컬럼 헤더 |

### Table Props

```typescript
type TableProps<T> = {
  /** React Table 인스턴스 */
  tableInstance: ReactTableProps<T>;
  /** TableBody 추가 props */
  tableBody?: Omit<TableBodyProps<T>, "children">;
  /** 정렬 상태 (복합 정렬 지원) */
  sortDescriptor?: MultiSortDescriptor;
  /** 정렬 변경 핸들러 */
  onSortChange?: (event: SortEvent) => void;
  /** 정렬 가능한 컬럼 ID 목록 */
  sortableColumns?: string[];
} & Omit<HeroTableProps, "sortDescriptor" | "onSortChange">;
```

### SortableColumnHeader Props

```typescript
type SortDirection = "asc" | "desc";
type SortDescriptor = { column: string; direction: SortDirection };
type MultiSortDescriptor = SortDescriptor[];
type SortEvent = { column: string; shiftKey: boolean; ctrlKey: boolean };

interface SortableColumnHeaderProps {
  columnId: string;
  label: React.ReactNode;
  sortDescriptor?: MultiSortDescriptor;
  onSortChange?: (event: SortEvent) => void;
  sortable?: boolean;
}
```

## 정렬 동작

| 조작 | 동작 |
|------|------|
| 일반 클릭 | 단일 정렬 (asc -> desc -> 해제) |
| Shift+클릭 | 복합 정렬에 추가/토글 |
| Ctrl/Cmd+클릭 | 해당 컬럼 정렬 제거 |

## HeroUI 매핑

기반: `import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
