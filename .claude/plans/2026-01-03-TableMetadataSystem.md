# 테이블 메타데이터 시스템 기획서

**작성일:** 2026-01-03
**플랫폼:** Admin Web (Desktop + Tablet + Mobile)
**버전:** 2.0

---

## 1. 개요

### 1.1 목적

테이블 화면을 **메타데이터 기반 선언적 시스템**으로 구성합니다.
메타데이터만 제공하면 테이블 전체가 자동으로 구성됩니다.

### 1.2 기존 컴포넌트 활용

| 컴포넌트 | 위치 | 역할 |
|---------|------|------|
| **DataGrid** | `components/ui/data-display/DataGrid` | TanStack Table 래퍼 |
| **Table** | `components/ui/data-display/Table` | 기본 테이블 |
| **Pagination** | `components/inputs/Pagination` | nuqs 기반 페이지네이션 |

### 1.3 핵심 원칙

```
메타데이터 = columns + data + leftInputs + rightInputs
     ↓
TablePage 컴포넌트 (기존 DataGrid, Pagination 활용)
     ↓
완성된 테이블 UI (URL querystring 자동 연동)
```

- **선언적 구성**: 메타데이터로 테이블 정의
- **nuqs 연동**: 페이지네이션, 필터가 URL querystring과 자동 동기화
- **기존 컴포넌트 재사용**: DataGrid, Pagination, Table 활용
- **Admin 접두어 없음**: 범용 컴포넌트로 설계

---

## 2. 기존 컴포넌트 분석

### 2.1 Pagination (nuqs 연동)

```typescript
// packages/ui/src/components/inputs/Pagination/Pagination.tsx
// 이미 nuqs로 URL querystring 연동됨

const [{ take, skip }, setQueryStates] = useQueryStates({
  take: parseAsInteger.withDefault(10),
  skip: parseAsInteger.withDefault(0),
});

// URL: ?take=10&skip=0
```

### 2.2 DataGrid (TanStack Table 래퍼)

```typescript
// packages/ui/src/components/ui/data-display/DataGrid/DataGrid.tsx

export type DataGridProps<T> = {
  state: { selectedKeys: Key[] | null };
  columns: ColumnDef<T, any>[];
  data: (T & { id: Key })[];
};
```

---

## 3. 메타데이터 인터페이스

### 3.1 TablePageConfig (메인 인터페이스)

```typescript
interface TablePageConfig<T> {
  /** 엔티티명 (컬럼 가시성 시스템 연동) */
  entity: string;

  /** 데이터 배열 */
  data: T[];

  /** 전체 데이터 수 (페이지네이션용) */
  totalCount: number;

  /** 로딩 상태 */
  isLoading?: boolean;

  /** nuqs queryStates (페이지에서 주입) */
  queryStates: Record<string, any>;

  /** nuqs setQueryStates (페이지에서 주입) */
  setQueryStates: (
    values: Record<string, any | null>,
    options?: { history?: 'push' | 'replace' }
  ) => Promise<URLSearchParams>;

  /** 컬럼 정의 (TanStack Table ColumnDef 확장) */
  columns: TableColumnConfig<T>[];

  /** 테이블 상단 좌측 영역 (검색, 필터 등) */
  leftInputs?: InputConfig[];

  /** 테이블 상단 우측 영역 (버튼, 액션 등) */
  rightInputs?: InputConfig[];

  /** 선택 설정 */
  selection?: SelectionConfig;

  /** 모바일 대응 설정 */
  responsive?: ResponsiveConfig;

  /** 빈 상태 메시지 */
  emptyMessage?: string;
}
```

### 3.2 TableColumnConfig (TanStack Table ColumnDef 확장)

TanStack Table의 `ColumnDef`를 상속하여 확장합니다.

```typescript
import { ColumnDef, AccessorFn, CellContext, HeaderContext } from '@tanstack/react-table';

/**
 * TanStack Table의 ColumnDef를 확장한 테이블 컬럼 설정
 *
 * 기본 ColumnDef의 모든 기능을 사용하면서 추가 메타데이터 제공
 */
interface TableColumnConfig<TData, TValue = unknown>
  extends Omit<ColumnDef<TData, TValue>, 'id'> {

  /** 필드명 (ColumnDef의 id로도 사용됨) */
  field: keyof TData | string;

  /** 표시 라벨 (header의 기본값) */
  label: string;

  /** 필수 여부 (필수 컬럼은 디바이스와 관계없이 항상 표시) */
  isRequired?: boolean;

  /** 정렬 방향 */
  align?: 'left' | 'center' | 'right';
}

/**
 * TableColumnConfig를 TanStack Table의 ColumnDef로 변환
 */
function toColumnDef<TData, TValue>(
  config: TableColumnConfig<TData, TValue>
): ColumnDef<TData, TValue> {
  const { field, label, isRequired, align, ...columnDefProps } = config;

  return {
    id: String(field),
    // accessorKey가 없으면 field를 사용
    accessorKey: columnDefProps.accessorKey ?? (field as string),
    // header가 없으면 label 사용
    header: columnDefProps.header ?? label,
    // meta에 추가 정보 저장
    meta: {
      isRequired,
      align,
      label,
      ...columnDefProps.meta,
    },
    ...columnDefProps,
  } as ColumnDef<TData, TValue>;
}
```

### 3.2.1 ColumnDef 주요 속성 활용

```typescript
// TanStack Table ColumnDef의 주요 속성들
interface ColumnDefExample<T> {
  // === 기본 속성 (ColumnDef에서 상속) ===
  accessorKey?: keyof T;           // 데이터 접근 키
  accessorFn?: AccessorFn<T>;      // 커스텀 접근 함수
  header?: string | ((ctx: HeaderContext<T, any>) => ReactNode);  // 헤더
  cell?: (ctx: CellContext<T, any>) => ReactNode;  // 셀 렌더러
  footer?: string | ((ctx: HeaderContext<T, any>) => ReactNode);  // 푸터

  // === 크기 관련 ===
  size?: number;                   // 기본 너비 (px)
  minSize?: number;                // 최소 너비
  maxSize?: number;                // 최대 너비

  // === 기능 관련 ===
  enableSorting?: boolean;         // 정렬 활성화
  enableColumnFilter?: boolean;    // 컬럼 필터 활성화
  enableHiding?: boolean;          // 숨기기 활성화
  enableResizing?: boolean;        // 리사이징 활성화
  enablePinning?: boolean;         // 고정 활성화

  // === 메타 정보 ===
  meta?: {                         // 커스텀 메타데이터
    isRequired?: boolean;
    align?: 'left' | 'center' | 'right';
    label?: string;
  };
}
```

### 3.2.2 사용 예시

```typescript
// TableColumnConfig 정의 (TanStack Table 기능 + 확장 속성)
const columns: TableColumnConfig<User>[] = [
  {
    field: 'name',
    label: '이름',
    isRequired: true,
    enableSorting: true,        // TanStack Table 기능
    size: 150,                  // TanStack Table 기능
  },
  {
    field: 'email',
    label: '이메일',
    enableSorting: true,
    minSize: 200,
  },
  {
    field: 'role',
    label: '역할',
    // TanStack Table의 cell 렌더러 사용
    cell: ({ getValue }) => <RoleBadge role={getValue<Role>()} />,
  },
  {
    field: 'status',
    label: '상태',
    isRequired: true,
    align: 'center',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    field: 'createdAt',
    label: '가입일',
    // accessorFn으로 데이터 변환
    accessorFn: (row) => formatDate(row.createdAt),
    enableSorting: true,
  },
  {
    field: 'actions',
    label: '',
    isRequired: true,
    enableSorting: false,
    enableHiding: false,        // 숨기기 비활성화
    header: () => null,         // 헤더 숨김
    cell: ({ row }) => <RowActions row={row.original} />,
  },
];
```

### 3.3 InputConfig (입력 컴포넌트)

```typescript
type InputType =
  | 'search'        // 검색 입력 (nuqs 연동)
  | 'select'        // 셀렉트 박스 (nuqs 연동)
  | 'multi-select'  // 다중 선택
  | 'date-range'    // 날짜 범위 (nuqs 연동)
  | 'button'        // 버튼
  | 'dropdown'      // 드롭다운 메뉴
  | 'chip-group'    // 필터 칩 그룹
  | 'custom'        // 커스텀 컴포넌트
  ;

interface InputConfig {
  /** 입력 타입 */
  type: InputType;

  /** 고유 식별자 (nuqs querystring key로 사용) */
  id: string;

  /** 표시 라벨 */
  label?: string;

  /** placeholder */
  placeholder?: string;

  /** 권한 체크 (CASL Subject) */
  permission?: {
    action: string;
    subject: string;
  };

  /** 디바이스별 표시 여부 */
  showOn?: ('desktop' | 'tablet' | 'mobile')[];

  /** 타입별 Props */
  props?: InputTypeProps;

  /** 이벤트 핸들러 (nuqs 자동 연동 외 추가 로직) */
  handlers?: InputHandlers;
}
```

### 3.4 InputTypeProps (타입별 설정)

```typescript
interface InputTypeProps {
  // Search - nuqs 자동 연동
  debounceMs?: number;
  queryKey?: string;  // 기본값: id

  // Select / MultiSelect - nuqs 자동 연동
  options?: SelectOption[];
  defaultValue?: string | string[];
  queryKey?: string;

  // DateRange - nuqs 자동 연동
  queryKeys?: { start: string; end: string };

  // Button
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  startContent?: React.ReactNode;

  // Dropdown
  items?: DropdownItem[];

  // Custom
  component?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

interface SelectOption {
  label: string;
  value: string;
}

interface DropdownItem {
  key: string;
  label: string;
  onClick?: () => void;
  permission?: { action: string; subject: string };
}
```

### 3.5 SelectionConfig

```typescript
interface SelectionConfig {
  /** 선택 모드 */
  mode: 'none' | 'single' | 'multiple';

  /** 선택된 키 목록 (외부 상태) */
  selectedKeys?: Set<string>;

  /** 선택 변경 핸들러 */
  onSelectionChange?: (keys: Set<string>) => void;

  /** 선택 시 하단 액션바 */
  actionBar?: {
    /** 선택된 항목 수 표시 */
    showCount?: boolean;
    /** 액션 버튼들 */
    actions?: InputConfig[];
  };
}
```

---

## 4. nuqs 기반 URL Querystring 연동

### 4.1 자동 연동 원칙

모든 필터, 검색, 페이지네이션은 **nuqs를 통해 URL querystring과 자동 동기화**됩니다.

```
URL: /admin/members?search=홍길동&role=ADMIN&take=20&skip=0&startDate=2025-01-01
```

### 4.2 useTableQueryStates 훅

```typescript
// hooks/useTableQueryStates.ts
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function useTableQueryStates(inputs: InputConfig[]) {
  // InputConfig에서 querystring 파서 자동 생성
  const parsers = useMemo(() => {
    const result: Record<string, any> = {
      // 기본 페이지네이션
      take: parseAsInteger.withDefault(10),
      skip: parseAsInteger.withDefault(0),
    };

    for (const input of inputs) {
      const key = input.props?.queryKey ?? input.id;

      switch (input.type) {
        case 'search':
          result[key] = parseAsString.withDefault('');
          break;
        case 'select':
          result[key] = parseAsString.withDefault(input.props?.defaultValue ?? '');
          break;
        case 'multi-select':
          result[key] = parseAsArrayOf(parseAsString).withDefault([]);
          break;
        case 'date-range':
          const keys = input.props?.queryKeys ?? { start: `${key}Start`, end: `${key}End` };
          result[keys.start] = parseAsIsoDateTime;
          result[keys.end] = parseAsIsoDateTime;
          break;
      }
    }

    return result;
  }, [inputs]);

  return useQueryStates(parsers);
}
```

### 4.3 검색 입력 nuqs 연동

```typescript
// inputs/SearchInput.tsx
function SearchInput({ config }: { config: InputConfig }) {
  const queryKey = config.props?.queryKey ?? config.id;
  const [query, setQuery] = useQueryState(queryKey, parseAsString.withDefault(''));

  const debouncedSetQuery = useDebouncedCallback(
    (value: string) => setQuery(value),
    config.props?.debounceMs ?? 300
  );

  return (
    <Input
      placeholder={config.placeholder}
      defaultValue={query}
      onChange={(e) => debouncedSetQuery(e.target.value)}
      startContent={<Search size={16} />}
    />
  );
}
```

### 4.4 필터 셀렉트 nuqs 연동

```typescript
// inputs/SelectInput.tsx
function SelectInput({ config }: { config: InputConfig }) {
  const queryKey = config.props?.queryKey ?? config.id;
  const [value, setValue] = useQueryState(queryKey, parseAsString);

  return (
    <Select
      placeholder={config.placeholder}
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setValue(selected || null);
      }}
    >
      {config.props?.options?.map((opt) => (
        <SelectItem key={opt.value}>{opt.label}</SelectItem>
      ))}
    </Select>
  );
}
```

---

## 5. QueryStates 전달 흐름

### 5.1 핵심 원칙

**queryStates는 페이지에서 관리하고, TablePage에 주입합니다.**

```
[페이지]                              [TablePage]
    │                                      │
    ├─ useTableQueryStates() ──────────────┤
    │       │                              │
    │       ▼                              │
    ├─ queryStates ───► API 호출           │
    │       │                              │
    │       ▼                              │
    ├─ data ───────────────────────────────► 렌더링
    │                                      │
    └─ queryStates, setQueryStates ────────► Input 연동
```

### 5.2 useTableQueryStates 훅 (페이지에서 사용)

```typescript
// hooks/useTableQueryStates.ts
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

/**
 * 페이지에서 호출하여 queryStates를 관리
 * - API 호출에 사용
 * - TablePage에 주입
 */
export function useTableQueryStates(inputs: InputConfig[]) {
  const parsers = useMemo(() => {
    const result: Record<string, any> = {
      take: parseAsInteger.withDefault(10),
      skip: parseAsInteger.withDefault(0),
    };

    for (const input of inputs) {
      const key = input.props?.queryKey ?? input.id;
      switch (input.type) {
        case 'search':
          result[key] = parseAsString.withDefault('');
          break;
        case 'select':
          result[key] = parseAsString.withDefault('');
          break;
        // ... 기타 타입
      }
    }
    return result;
  }, [inputs]);

  return useQueryStates(parsers);
}
```

---

## 6. 사용 예시

### 6.1 회원 목록 페이지

```tsx
// apps/admin/app/(admin)/members/page.tsx

// Input 설정 (별도 분리 권장)
const leftInputs: InputConfig[] = [
  { type: 'search', id: 'search', placeholder: '이름, 이메일 검색' },
  { type: 'select', id: 'role', placeholder: '역할', props: { options: [...] } },
];

function MembersPage() {
  // 1. 페이지에서 queryStates 관리
  const [queryStates, setQueryStates] = useTableQueryStates(leftInputs);

  // 2. queryStates를 API에 직접 전달
  const { data, isLoading } = useGetUsers({
    search: queryStates.search,
    role: queryStates.role,
    take: queryStates.take,
    skip: queryStates.skip,
  });

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // 3. TablePage에 queryStates 주입
  const tableConfig: TablePageConfig<User> = {
    entity: 'User',
    data: data?.data ?? [],
    totalCount: data?.meta?.total ?? 0,
    isLoading,

    // queryStates 주입 (Input 연동용)
    queryStates,
    setQueryStates,

    columns: [
      {
        field: 'name',
        label: '이름',
        isRequired: true,
        enableSorting: true,
        size: 150,
      },
      {
        field: 'email',
        label: '이메일',
        enableSorting: true,
        minSize: 200,
      },
      {
        field: 'phone',
        label: '전화번호',
        size: 120,
      },
      {
        field: 'role',
        label: '역할',
        // TanStack Table의 cell context 사용
        cell: ({ getValue }) => <RoleBadge role={getValue<Role>()} />,
      },
      {
        field: 'status',
        label: '상태',
        isRequired: true,
        align: 'center',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        field: 'actions',
        label: '',
        isRequired: true,
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => <RowActions row={row.original} />,
      },
    ],

    // 상단 좌측 - 검색, 필터 (nuqs 자동 연동)
    leftInputs: [
      {
        type: 'search',
        id: 'search',
        placeholder: '이름, 이메일 검색',
        props: { debounceMs: 300 },
      },
      {
        type: 'select',
        id: 'role',
        placeholder: '역할',
        props: {
          options: [
            { label: '전체', value: '' },
            { label: '관리자', value: 'ADMIN' },
            { label: '일반', value: 'USER' },
          ],
        },
      },
      {
        type: 'date-range',
        id: 'createdAt',
        placeholder: '가입일',
      },
    ],

    // 상단 우측 - 액션 버튼
    rightInputs: [
      {
        type: 'dropdown',
        id: 'export',
        label: '내보내기',
        permission: { action: 'ACCESS', subject: 'feature:export' },
        props: {
          items: [
            { key: 'excel', label: 'Excel', onClick: handleExportExcel },
            { key: 'csv', label: 'CSV', onClick: handleExportCsv },
          ],
        },
      },
      {
        type: 'button',
        id: 'create',
        label: '회원 등록',
        props: { color: 'primary' },
        handlers: { onClick: handleCreate },
      },
    ],

    // 선택
    selection: {
      mode: 'multiple',
      selectedKeys,
      onSelectionChange: setSelectedKeys,
      actionBar: {
        showCount: true,
        actions: [
          {
            type: 'button',
            id: 'bulk-delete',
            label: '삭제',
            props: { color: 'danger' },
            handlers: { onClick: handleBulkDelete },
          },
        ],
      },
    },

    // 모바일
    responsive: {
      mobileCardView: true,
      cardRender: (row) => <MemberCard member={row} />,
    },
  };

  return <TablePage config={tableConfig} />;
}
```

### 5.2 URL Querystring 예시

```
/admin/members?search=홍길동&role=ADMIN&take=20&skip=0
```

페이지 새로고침해도 필터/페이지네이션 상태 유지됩니다.

---

## 6. 컴포넌트 구조

### 6.1 디렉토리 구조

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

### 6.2 TablePage 컴포넌트

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

### 6.2.1 toColumnDef 변환 함수

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

### 6.2.2 TanStack Table 메타 타입 확장

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

### 6.3 TablePageFooter (Pagination 연동)

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

## 7. 컬럼 가시성 시스템 연동

### 7.1 useColumnVisibility 활용

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

---

## 8. 레이아웃 구조

### 8.1 Desktop

```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 검색] [역할▼] [가입일 📅]              [내보내기▼] [+ 등록]  │ <- Header
├─────────────────────────────────────────────────────────────────┤
│ □ │ 이름   │ 이메일        │ 전화번호    │ 역할  │ 상태 │ 액션  │
├───┼────────┼───────────────┼─────────────┼───────┼──────┼───────┤
│ □ │ 홍길동  │ hong@...     │ 010-...    │ USER │ 활성 │ ⋮    │
│ □ │ 김철수  │ kim@...      │ 010-...    │ ADMIN│ 활성 │ ⋮    │
├─────────────────────────────────────────────────────────────────┤
│ 총 100건                                      [< 1 2 3 ... >]  │ <- Footer (Pagination)
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Mobile (카드 뷰)

```
┌───────────────────────────────┐
│ [🔍 검색...]        [필터] [+]│
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │ 홍길동                 ⋮  │ │
│ │ hong@example.com          │ │
│ │ [USER] [활성]             │ │
│ └───────────────────────────┘ │
│ ┌───────────────────────────┐ │
│ │ 김철수                 ⋮  │ │
│ │ kim@example.com           │ │
│ │ [ADMIN] [활성]            │ │
│ └───────────────────────────┘ │
├───────────────────────────────┤
│ 총 100건          [< 1 2 3 >] │
└───────────────────────────────┘
```

---

## 9. 체크리스트

### 타입 정의
- [ ] TablePageConfig 인터페이스
- [ ] TableColumnConfig 인터페이스 (ColumnDef 확장)
- [ ] InputConfig 인터페이스
- [ ] SelectionConfig 인터페이스
- [ ] ResponsiveConfig 인터페이스
- [ ] TanStack Table 메타 타입 확장 (table.d.ts)

### 유틸리티 함수
- [ ] toColumnDef (TableColumnConfig → ColumnDef 변환)
- [ ] toColumnDefs (배열 일괄 변환)

### 컴포넌트 구현
- [ ] TablePage 메인 컴포넌트
- [ ] TablePageContext Provider
- [ ] TablePageHeader (leftInputs, rightInputs)
- [ ] TablePageBody (DataGrid 연동)
- [ ] TablePageFooter (Pagination 연동)
- [ ] TablePageCard (모바일)
- [ ] TablePageActionBar
- [ ] TablePageSkeleton
- [ ] TablePageEmpty

### 입력 컴포넌트 (nuqs 연동)
- [ ] SearchInput (nuqs)
- [ ] SelectInput (nuqs)
- [ ] MultiSelectInput (nuqs)
- [ ] DateRangeInput (nuqs)
- [ ] ButtonInput
- [ ] DropdownInput
- [ ] InputRenderer

### 훅 구현
- [ ] useTableQueryStates (nuqs 통합)
- [ ] useTableColumns (컬럼 가시성)
- [ ] useTableResponsive

### 연동
- [ ] 기존 DataGrid 컴포넌트 활용
- [ ] 기존 Pagination 컴포넌트 활용
- [ ] 컬럼 가시성 시스템 연동
- [ ] CASL 권한 연동

---

## 10. 참고 자료

- [nuqs](https://nuqs.47ng.com/) - URL querystring 상태 관리
- [TanStack Table](https://tanstack.com/table/v8)
- 기존 컴포넌트: `components/ui/data-display/DataGrid`
- 기존 컴포넌트: `components/inputs/Pagination`
- 컬럼 가시성: `2025-12-30-CASL-Permission-System.md` (12장)
