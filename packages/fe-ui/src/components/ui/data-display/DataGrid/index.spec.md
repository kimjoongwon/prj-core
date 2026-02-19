# DataGrid UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/DataGrid/

## 역할

React Table과 HeroUI를 기반으로 한 데이터 그리드. 행 선택, 트리 확장, 복합 정렬, 로딩 오버레이 기능을 제공한다.

## Props

```typescript
type DataGridState = {
  /** 선택된 행의 키 목록 */
  selectedKeys: Key[] | null;
  /** 정렬 상태 (복합 정렬 지원) */
  sorting?: MultiSortDescriptor;
};

type DataGridProps<T> = Omit<TableProps<T>, "tableInstance" | "sortDescriptor"> & {
  /** DataGrid 상태 */
  state: DataGridState;
  /** 컬럼 정의 (TanStack React Table ColumnDef) */
  columns: ColumnDef<T, any>[];
  /** 데이터 배열 (id 필드 필수) */
  data: (T & { id: Key })[];
  /** 정렬 변경 핸들러 */
  onSortChange?: (event: SortEvent) => void;
  /** 정렬 가능한 컬럼 ID 목록 */
  sortableColumns?: string[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 로딩 텍스트 */
  loadingContent?: React.ReactNode;
};
```

## 주요 기능

| 기능 | 설명 |
|------|------|
| 복합 정렬 | 일반 클릭(단일), Shift+클릭(추가), Ctrl+클릭(제거) |
| 행 선택 | selectionMode="multiple" 지원 |
| 트리 확장 | children 배열을 통한 계층 구조 지원 |
| 로딩 오버레이 | isLoading=true 시 반투명 오버레이 + Spinner |

## 내부 의존성

- `Table` 컴포넌트 (같은 디렉토리)
- `@tanstack/react-table` (useReactTable, getCoreRowModel, getExpandedRowModel)
- `@heroui/react` (Spinner)

## HeroUI 매핑

기반: `import { Spinner } from '@heroui/react'`

내부적으로 Table 컴포넌트 사용 (HeroUI Table 래핑).

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
