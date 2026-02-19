# Table UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/Table/

## 역할

HeroUI Table과 TanStack React Table을 통합한 테이블 컴포넌트. 복합 정렬, 행 선택 기능을 제공한다. DataGrid의 내부 구현 컴포넌트이다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
