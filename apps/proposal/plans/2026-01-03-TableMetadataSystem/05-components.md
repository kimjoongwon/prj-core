# 05. 컴포넌트 구조 및 구현

## 1. 디렉토리 구조

```
packages/ui/src/components/feature/TablePage/
├── TablePage.tsx               # 메인 컴포넌트
├── TablePageContext.tsx        # Context Provider
├── TablePageHeader.tsx         # 상단 영역 (leftInputs, rightInputs)
├── TablePageBody.tsx           # DataGrid 래퍼
├── TablePageFooter.tsx         # Pagination 래퍼
├── TablePageCard.tsx           # 모바일 카드 뷰
├── TablePageActionBar.tsx      # 선택 시 액션바
├── TablePageSkeleton.tsx       # 로딩 스켈레톤
├── TablePageEmpty.tsx          # 빈 상태
├── inputs/                     # 입력 컴포넌트 렌더러
│   ├── SearchInput.tsx         # nuqs 연동
│   ├── SelectInput.tsx         # nuqs 연동
│   ├── DateRangeInput.tsx      # nuqs 연동
│   ├── ButtonInput.tsx
│   ├── DropdownInput.tsx
│   └── InputRenderer.tsx
├── hooks/
│   ├── useTableQueryStates.ts  # nuqs 통합 훅
│   ├── useTableColumns.ts      # 컬럼 가시성 연동
│   └── useTableResponsive.ts
├── types.ts
└── index.ts
```

---

## 2. TablePage 컴포넌트

```tsx
// TablePage.tsx
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid } from '../../ui/data-display/DataGrid';
import { Pagination } from '../../inputs/Pagination';
import { useColumnVisibility } from '@cocrepo/hook';

export function TablePage<T extends { id: Key }>({ config }: { config: TablePageConfig<T> }) {
  const { visibleColumns, deviceType } = useColumnVisibility(config.entity);
  const isMobile = deviceType === 'mobile';

  // TableColumnConfig를 TanStack Table ColumnDef로 변환
  const tableColumns = useMemo((): ColumnDef<T, any>[] => {
    return config.columns
      // 필수 컬럼 또는 가시성 설정된 컬럼만 필터링
      .filter(col => col.isRequired || isColumnVisible(col.field, visibleColumns))
      // TableColumnConfig → ColumnDef 변환
      .map(col => toColumnDef(col));
  }, [config.columns, visibleColumns]);

  // 모바일 카드 뷰
  if (isMobile && config.responsive?.mobileCardView) {
    return (
      <TablePageContext.Provider value={{ config }}>
        <TablePageHeader />
        <TablePageCard />
        <TablePageFooter />
        <TablePageActionBar />
      </TablePageContext.Provider>
    );
  }

  // 기본 테이블 뷰
  return (
    <TablePageContext.Provider value={{ config }}>
      <TablePageHeader />
      {config.isLoading ? (
        <TablePageSkeleton />
      ) : config.data.length === 0 ? (
        <TablePageEmpty message={config.emptyMessage} />
      ) : (
        <DataGrid
          data={config.data}
          columns={tableColumns}
          state={{ selectedKeys: Array.from(config.selection?.selectedKeys ?? []) }}
          selectionMode={config.selection?.mode}
        />
      )}
      <TablePageFooter totalCount={config.totalCount} />
      <TablePageActionBar />
    </TablePageContext.Provider>
  );
}
```

---

## 3. toColumnDef 변환 함수

```tsx
// utils/toColumnDef.ts
import { ColumnDef } from '@tanstack/react-table';

export function toColumnDef<TData, TValue = unknown>(
  config: TableColumnConfig<TData, TValue>
): ColumnDef<TData, TValue> {
  const { field, label, isRequired, align, ...columnDefProps } = config;

  return {
    id: String(field),
    accessorKey: columnDefProps.accessorKey ?? (field as string),
    header: columnDefProps.header ?? label,
    meta: {
      isRequired,
      align,
      label,
      ...columnDefProps.meta,
    },
    ...columnDefProps,
  } as ColumnDef<TData, TValue>;
}

// 여러 컬럼 일괄 변환
export function toColumnDefs<TData>(
  configs: TableColumnConfig<TData, any>[]
): ColumnDef<TData, any>[] {
  return configs.map(toColumnDef);
}
```

---

## 4. TanStack Table 메타 타입 확장

```tsx
// types/table.d.ts
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** 필수 컬럼 여부 */
    isRequired?: boolean;
    /** 정렬 방향 */
    align?: 'left' | 'center' | 'right';
    /** 표시 라벨 */
    label?: string;
  }
}
```

---

## 5. TablePageFooter (Pagination 연동)

```tsx
// TablePageFooter.tsx
import { Pagination } from '../../inputs/Pagination';

export function TablePageFooter({ totalCount }: { totalCount: number }) {
  return (
    <div className="flex justify-between items-center py-4">
      <Text variant="body2" className="text-default-500">
        총 {totalCount.toLocaleString()}건
      </Text>
      <Pagination totalCount={totalCount} />
    </div>
  );
}
```

---

## 6. 컬럼 가시성 시스템 연동

### useColumnVisibility 활용

```tsx
// TablePage 내부
const { visibleColumns, deviceType } = useColumnVisibility(config.entity);

// config.columns와 DB 설정 병합
const filteredColumns = config.columns.filter(col => {
  // 필수 컬럼은 항상 표시
  if (col.isRequired) return true;

  // DB 설정 기반 가시성 체크
  const dbCol = visibleColumns.find(c => c.field === col.field);
  return dbCol?.visible ?? true;
});
```
