# 02. 메타데이터 인터페이스

## 1. TablePageConfig (메인 인터페이스)

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

---

## 2. TableColumnConfig (TanStack Table ColumnDef 확장)

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

### 2.1 ColumnDef 주요 속성 활용

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

### 2.2 사용 예시

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

---

## 3. InputConfig (입력 컴포넌트)

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

---

## 4. InputTypeProps (타입별 설정)

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

---

## 5. SelectionConfig

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
