# Admin 테이블 메타데이터 시스템 기획서

**작성일:** 2026-01-03
**플랫폼:** Admin Web (Desktop + Tablet + Mobile)
**버전:** 1.0

---

## 1. 개요

### 1.1 목적

Admin 화면의 테이블을 **메타데이터 기반 선언적 시스템**으로 구성합니다.
하드코딩된 UI가 아닌, 메타데이터만 제공하면 테이블 전체가 자동으로 구성됩니다.

### 1.2 핵심 원칙

```
메타데이터 = 컬럼 + 데이터 + 입력컴포넌트 + 로직
     ↓
AdminTable 컴포넌트
     ↓
완성된 테이블 UI (반응형 자동 대응)
```

- **선언적 구성**: JSON/객체 형태의 메타데이터로 테이블 정의
- **컴포넌트 주입**: leftInputs, rightInputs에 컴포넌트 메타데이터 정의
- **로직 바인딩**: onClick, onChange 등 핸들러를 메타데이터에 포함
- **동적 컬럼**: 컬럼 가시성 시스템과 연동 (디바이스/역할별)
- **반응형 자동 대응**: 모바일에서 카드 뷰 자동 전환

### 1.3 참조 문서

| 문서 | 내용 |
|------|------|
| `2025-12-30-CASL-Permission-System.md` (12장) | 컬럼 가시성 시스템 |
| `2025-12-30-AdminLayoutAndMenuSystem.md` | Admin 레이아웃 |
| `2025-12-30-AdminLayoutAndMenuSystem-Mobile.md` | 모바일 반응형 |

---

## 2. 메타데이터 인터페이스 설계

### 2.1 AdminTableConfig (메인 인터페이스)

```typescript
interface AdminTableConfig<T> {
  /** 테이블 고유 식별자 (컬럼 설정 저장용) */
  tableId: string;

  /** 엔티티명 (컬럼 가시성 시스템 연동) */
  entity: string;

  /** 데이터 배열 */
  data: T[];

  /** 로딩 상태 */
  isLoading?: boolean;

  /** 컬럼 정의 (정적) - 동적 가시성은 useColumnVisibility로 처리 */
  columns: ColumnConfig<T>[];

  /** 테이블 상단 좌측 영역 (검색, 필터 등) */
  leftInputs?: InputConfig[];

  /** 테이블 상단 우측 영역 (버튼, 액션 등) */
  rightInputs?: InputConfig[];

  /** 테이블 하단 좌측 영역 (선택 정보 등) */
  bottomLeft?: InputConfig[];

  /** 테이블 하단 우측 영역 (페이지네이션 등) */
  bottomRight?: InputConfig[];

  /** 선택 설정 */
  selection?: SelectionConfig;

  /** 페이지네이션 설정 */
  pagination?: PaginationConfig;

  /** 정렬 설정 */
  sorting?: SortingConfig;

  /** 모바일 대응 설정 */
  responsive?: ResponsiveConfig;

  /** 빈 상태 설정 */
  emptyState?: EmptyStateConfig;
}
```

### 2.2 ColumnConfig (컬럼 정의)

```typescript
interface ColumnConfig<T> {
  /** 필드명 (데이터 키) */
  field: keyof T | string;

  /** 표시 라벨 */
  label: string;

  /** 필수 여부 (필수 컬럼은 항상 표시) */
  isRequired?: boolean;

  /** 너비 */
  width?: string | number;

  /** 최소 너비 */
  minWidth?: string | number;

  /** 정렬 가능 여부 */
  sortable?: boolean;

  /** 정렬 방향 */
  align?: 'left' | 'center' | 'right';

  /** 커스텀 셀 렌더러 */
  render?: (value: any, row: T, index: number) => React.ReactNode;

  /** 커스텀 헤더 렌더러 */
  headerRender?: () => React.ReactNode;

  /** 디바이스별 기본 가시성 (DB 설정 오버라이드용) */
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}
```

### 2.3 InputConfig (입력 컴포넌트 정의)

```typescript
type InputType =
  | 'search'        // 검색 입력
  | 'select'        // 셀렉트 박스
  | 'multi-select'  // 다중 선택
  | 'date-range'    // 날짜 범위
  | 'button'        // 버튼
  | 'button-group'  // 버튼 그룹
  | 'dropdown'      // 드롭다운 메뉴
  | 'checkbox'      // 체크박스
  | 'chip-group'    // 필터 칩 그룹
  | 'custom'        // 커스텀 컴포넌트
  ;

interface InputConfig {
  /** 입력 타입 */
  type: InputType;

  /** 고유 식별자 */
  id: string;

  /** 표시 라벨 (선택적) */
  label?: string;

  /** placeholder */
  placeholder?: string;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 숨김 여부 */
  hidden?: boolean;

  /** 권한 체크 (CASL Subject) */
  permission?: {
    action: string;
    subject: string;
  };

  /** 디바이스별 표시 여부 */
  showOn?: ('desktop' | 'tablet' | 'mobile')[];

  /** 타입별 추가 설정 */
  props?: InputTypeProps;

  /** 이벤트 핸들러 */
  handlers?: InputHandlers;
}

/** 타입별 Props */
interface InputTypeProps {
  // Search
  debounceMs?: number;

  // Select / MultiSelect
  options?: SelectOption[];
  defaultValue?: string | string[];

  // DateRange
  minDate?: Date;
  maxDate?: Date;

  // Button
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;

  // ButtonGroup
  buttons?: ButtonConfig[];

  // Dropdown
  items?: DropdownItem[];

  // Custom
  component?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

/** 이벤트 핸들러 */
interface InputHandlers {
  onClick?: () => void;
  onChange?: (value: any) => void;
  onSearch?: (keyword: string) => void;
  onSelect?: (value: string | string[]) => void;
  onDateChange?: (range: { start: Date; end: Date }) => void;
}
```

### 2.4 SelectionConfig (선택 설정)

```typescript
interface SelectionConfig {
  /** 선택 모드 */
  mode: 'none' | 'single' | 'multiple';

  /** 선택된 키 목록 */
  selectedKeys?: Set<string> | 'all';

  /** 선택 변경 핸들러 */
  onSelectionChange?: (keys: Set<string>) => void;

  /** 선택 시 하단 액션바 표시 */
  showActionBar?: boolean;

  /** 액션바 설정 */
  actionBar?: {
    /** 선택된 항목 수 표시 */
    showCount?: boolean;
    /** 액션 버튼들 */
    actions?: InputConfig[];
  };
}
```

### 2.5 PaginationConfig (페이지네이션 설정)

```typescript
interface PaginationConfig {
  /** 현재 페이지 (1-based) */
  page: number;

  /** 페이지당 항목 수 */
  pageSize: number;

  /** 전체 항목 수 */
  total: number;

  /** 페이지 변경 핸들러 */
  onPageChange?: (page: number) => void;

  /** 페이지 크기 변경 핸들러 */
  onPageSizeChange?: (pageSize: number) => void;

  /** 페이지 크기 옵션 */
  pageSizeOptions?: number[];

  /** 페이지 크기 선택 표시 여부 */
  showPageSizeSelector?: boolean;

  /** 전체 항목 수 표시 여부 */
  showTotal?: boolean;
}
```

### 2.6 ResponsiveConfig (반응형 설정)

```typescript
interface ResponsiveConfig {
  /** 모바일에서 카드 뷰로 전환 여부 */
  mobileCardView?: boolean;

  /** 카드 뷰 렌더러 (모바일용) */
  cardRender?: (row: T, index: number) => React.ReactNode;

  /** 브레이크포인트 오버라이드 */
  breakpoints?: {
    mobile?: number;   // 기본: 768
    tablet?: number;   // 기본: 1280
  };
}
```

---

## 3. 사용 예시

### 3.1 기본 사용 예시

```tsx
// apps/admin/app/(admin)/members/page.tsx

function MembersPage() {
  const { data, isLoading } = useGetUsers();
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const tableConfig: AdminTableConfig<User> = {
    tableId: 'members-table',
    entity: 'User',
    data: data?.data ?? [],
    isLoading,

    // 컬럼 정의
    columns: [
      { field: 'name', label: '이름', isRequired: true, sortable: true },
      { field: 'email', label: '이메일', sortable: true },
      { field: 'phone', label: '전화번호' },
      {
        field: 'role',
        label: '역할',
        render: (value) => <RoleBadge role={value} />,
      },
      {
        field: 'status',
        label: '상태',
        isRequired: true,
        render: (value) => <StatusBadge status={value} />,
      },
      {
        field: 'createdAt',
        label: '가입일',
        sortable: true,
        render: (value) => formatDate(value),
      },
      {
        field: 'actions',
        label: '',
        isRequired: true,
        render: (_, row) => (
          <RowActions
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDelete(row)}
          />
        ),
      },
    ],

    // 상단 좌측: 검색, 필터
    leftInputs: [
      {
        type: 'search',
        id: 'search',
        placeholder: '이름, 이메일, 전화번호 검색',
        props: { debounceMs: 300 },
        handlers: { onSearch: setSearch },
      },
      {
        type: 'select',
        id: 'role-filter',
        placeholder: '역할',
        props: {
          options: [
            { label: '전체', value: 'all' },
            { label: '관리자', value: 'ADMIN' },
            { label: '일반', value: 'USER' },
          ],
        },
        handlers: { onSelect: handleRoleFilter },
      },
      {
        type: 'date-range',
        id: 'date-filter',
        placeholder: '가입일',
        handlers: { onDateChange: handleDateFilter },
      },
    ],

    // 상단 우측: 액션 버튼
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

    // 선택 설정
    selection: {
      mode: 'multiple',
      selectedKeys,
      onSelectionChange: setSelectedKeys,
      showActionBar: true,
      actionBar: {
        showCount: true,
        actions: [
          {
            type: 'button',
            id: 'bulk-delete',
            label: '삭제',
            props: { color: 'danger' },
            permission: { action: 'DELETE', subject: 'User' },
            handlers: { onClick: handleBulkDelete },
          },
        ],
      },
    },

    // 페이지네이션
    pagination: {
      page: 1,
      pageSize: 20,
      total: data?.meta?.total ?? 0,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      pageSizeOptions: [10, 20, 50, 100],
      showPageSizeSelector: true,
      showTotal: true,
    },

    // 반응형
    responsive: {
      mobileCardView: true,
      cardRender: (row) => <MemberCard member={row} />,
    },
  };

  return <AdminTable config={tableConfig} />;
}
```

### 3.2 간단한 사용 예시

```tsx
// 최소 설정
const simpleConfig: AdminTableConfig<User> = {
  tableId: 'simple-table',
  entity: 'User',
  data: users,
  columns: [
    { field: 'name', label: '이름', isRequired: true },
    { field: 'email', label: '이메일' },
  ],
};

return <AdminTable config={simpleConfig} />;
```

---

## 4. 컴포넌트 구조

### 4.1 디렉토리 구조

```
packages/ui/src/components/feature/AdminTable/
├── AdminTable.tsx              # 메인 컴포넌트
├── AdminTableContext.tsx       # Context Provider
├── AdminTableHeader.tsx        # 상단 영역 (leftInputs, rightInputs)
├── AdminTableBody.tsx          # 테이블 본문
├── AdminTableFooter.tsx        # 하단 영역 (pagination, selection info)
├── AdminTableCard.tsx          # 모바일 카드 뷰
├── AdminTableActionBar.tsx     # 선택 시 액션바
├── AdminTableSkeleton.tsx      # 로딩 스켈레톤
├── AdminTableEmpty.tsx         # 빈 상태
├── inputs/                     # 입력 컴포넌트 렌더러
│   ├── SearchInput.tsx
│   ├── SelectInput.tsx
│   ├── DateRangeInput.tsx
│   ├── ButtonInput.tsx
│   ├── DropdownInput.tsx
│   └── InputRenderer.tsx       # 타입별 렌더러 분기
├── hooks/
│   ├── useAdminTable.ts        # 테이블 상태 관리
│   ├── useTableColumns.ts      # 컬럼 가시성 연동
│   └── useTableResponsive.ts   # 반응형 처리
├── types.ts                    # 타입 정의
└── index.ts                    # Export
```

### 4.2 AdminTable 컴포넌트

```tsx
// AdminTable.tsx
import { useColumnVisibility } from '@cocrepo/hook';

export function AdminTable<T>({ config }: { config: AdminTableConfig<T> }) {
  const { visibleColumns, deviceType } = useColumnVisibility(config.entity);
  const isMobile = deviceType === 'mobile';

  // 컬럼 가시성 적용
  const filteredColumns = useMemo(() => {
    return config.columns.filter(col => {
      // 필수 컬럼은 항상 표시
      if (col.isRequired) return true;

      // DB 설정 기반 가시성 체크
      const dbColumn = visibleColumns.find(c => c.field === col.field);
      return dbColumn?.visible ?? true;
    });
  }, [config.columns, visibleColumns]);

  // 모바일 카드 뷰
  if (isMobile && config.responsive?.mobileCardView) {
    return (
      <AdminTableContext.Provider value={{ config, filteredColumns }}>
        <AdminTableHeader />
        <AdminTableCard />
        <AdminTableFooter />
        <AdminTableActionBar />
      </AdminTableContext.Provider>
    );
  }

  // 기본 테이블 뷰
  return (
    <AdminTableContext.Provider value={{ config, filteredColumns }}>
      <AdminTableHeader />
      <AdminTableBody />
      <AdminTableFooter />
      <AdminTableActionBar />
    </AdminTableContext.Provider>
  );
}
```

### 4.3 InputRenderer (입력 컴포넌트 렌더러)

```tsx
// inputs/InputRenderer.tsx
import { Can } from '@cocrepo/hook';

export function InputRenderer({ input }: { input: InputConfig }) {
  // 권한 체크
  const content = renderInput(input);

  if (input.permission) {
    return (
      <Can I={input.permission.action} a={input.permission.subject}>
        {content}
      </Can>
    );
  }

  return content;
}

function renderInput(input: InputConfig) {
  // 디바이스별 표시 체크
  const { deviceType } = useDeviceType();
  if (input.showOn && !input.showOn.includes(deviceType)) {
    return null;
  }

  switch (input.type) {
    case 'search':
      return <SearchInput config={input} />;
    case 'select':
      return <SelectInput config={input} />;
    case 'multi-select':
      return <MultiSelectInput config={input} />;
    case 'date-range':
      return <DateRangeInput config={input} />;
    case 'button':
      return <ButtonInput config={input} />;
    case 'button-group':
      return <ButtonGroupInput config={input} />;
    case 'dropdown':
      return <DropdownInput config={input} />;
    case 'chip-group':
      return <ChipGroupInput config={input} />;
    case 'custom':
      const Component = input.props?.component;
      return Component ? <Component {...input.props?.componentProps} /> : null;
    default:
      return null;
  }
}
```

---

## 5. 컬럼 가시성 시스템 연동

### 5.1 useColumnVisibility 훅 활용

```tsx
// AdminTable 내부에서 컬럼 가시성 연동
function AdminTable<T>({ config }: { config: AdminTableConfig<T> }) {
  // DB 기반 컬럼 가시성 조회
  const { visibleColumns, isLoading: columnsLoading } = useColumnVisibility(config.entity);

  // config.columns와 DB 설정 병합
  const mergedColumns = useMemo(() => {
    return config.columns.map(col => {
      const dbCol = visibleColumns.find(c => c.field === col.field);
      return {
        ...col,
        // DB 설정이 있으면 우선, 없으면 config 설정 사용
        visible: dbCol?.visible ?? true,
        width: dbCol?.width ?? col.width,
        sortable: dbCol?.sortable ?? col.sortable,
      };
    });
  }, [config.columns, visibleColumns]);

  // ...
}
```

### 5.2 필수 컬럼 처리

```tsx
// 필수 컬럼은 가시성 설정과 무관하게 항상 표시
const displayColumns = mergedColumns.filter(col => {
  // isRequired: true면 항상 표시
  if (col.isRequired) return true;
  // 그 외는 visible 설정에 따름
  return col.visible;
});
```

---

## 6. 모바일 반응형

### 6.1 자동 카드 뷰 전환

```tsx
// responsive.mobileCardView: true 설정 시
if (isMobile && config.responsive?.mobileCardView) {
  return (
    <div className="flex flex-col gap-3">
      {config.data.map((row, index) => (
        config.responsive.cardRender
          ? config.responsive.cardRender(row, index)
          : <DefaultCard row={row} columns={displayColumns} />
      ))}
    </div>
  );
}
```

### 6.2 모바일 UI 자동 변환

| Desktop | Mobile |
|---------|--------|
| 테이블 뷰 | 카드 뷰 |
| 검색 + 필터 나란히 | 검색 + 필터 버튼 (바텀시트) |
| 페이지네이션 | 무한 스크롤 또는 더보기 버튼 |
| 선택 체크박스 | 롱프레스 선택 모드 |
| 액션 버튼 | 하단 플로팅 액션바 |

### 6.3 InputConfig의 showOn 활용

```tsx
const leftInputs: InputConfig[] = [
  // 모든 디바이스에서 표시
  {
    type: 'search',
    id: 'search',
    placeholder: '검색',
    // showOn 생략 = 모든 디바이스
  },
  // Desktop/Tablet에서만 표시
  {
    type: 'select',
    id: 'filter',
    showOn: ['desktop', 'tablet'],
  },
  // Mobile에서만 표시 (필터 바텀시트 트리거)
  {
    type: 'button',
    id: 'filter-mobile',
    label: '필터',
    showOn: ['mobile'],
    handlers: { onClick: openFilterSheet },
  },
];
```

---

## 7. 레이아웃 구조

### 7.1 Desktop 레이아웃

```
┌─────────────────────────────────────────────────────────────────┐
│ [검색] [필터1▼] [필터2▼] [날짜범위]     [내보내기▼] [+ 회원등록] │ <- Header
├─────────────────────────────────────────────────────────────────┤
│ □ │ 이름   │ 이메일        │ 전화번호    │ 역할  │ 상태 │ 액션  │
├───┼────────┼───────────────┼─────────────┼───────┼──────┼───────┤
│ □ │ 홍길동  │ hong@...     │ 010-...    │ USER │ 활성 │ ⋮    │
│ □ │ 김철수  │ kim@...      │ 010-...    │ ADMIN│ 활성 │ ⋮    │
├─────────────────────────────────────────────────────────────────┤
│ 총 100건                              [< 1 2 3 ... 10 >] [20▼] │ <- Footer
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Mobile 레이아웃 (카드 뷰)

```
┌───────────────────────────────┐
│ [🔍 검색...]        [필터] [+]│ <- Header (간소화)
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
│           ...                 │
├───────────────────────────────┤
│ [더보기] (페이지네이션 대체)   │ <- Footer
└───────────────────────────────┘
```

### 7.3 선택 모드 시 액션바

```
Desktop:
┌─────────────────────────────────────────────────────────────────┐
│ ✓ 3개 선택됨                              [역할변경] [삭제]     │
└─────────────────────────────────────────────────────────────────┘

Mobile (플로팅):
┌───────────────────────────────┐
│     [역할변경]    [삭제]      │
│      3개 선택됨               │
└───────────────────────────────┘
```

---

## 8. Store 연동 (선택적)

### 8.1 AdminTableStore

복잡한 테이블의 경우 Store로 상태 관리를 분리할 수 있습니다.

```typescript
// stores/AdminTableStore.ts
class AdminTableStore<T> {
  @observable data: T[] = [];
  @observable isLoading = false;
  @observable selectedKeys = new Set<string>();
  @observable filters: Record<string, any> = {};
  @observable pagination = { page: 1, pageSize: 20, total: 0 };
  @observable sorting = { field: null, direction: 'asc' };

  @action setFilter(key: string, value: any) { /* ... */ }
  @action setPage(page: number) { /* ... */ }
  @action toggleSelection(key: string) { /* ... */ }
  @action selectAll() { /* ... */ }
  @action clearSelection() { /* ... */ }

  // API 호출
  @action async fetchData() { /* ... */ }
  @action async bulkDelete() { /* ... */ }
  @action async export(format: 'excel' | 'csv') { /* ... */ }
}
```

### 8.2 useAdminTable 훅

```typescript
// hooks/useAdminTable.ts
export function useAdminTable<T>(options: UseAdminTableOptions<T>) {
  const [store] = useState(() => new AdminTableStore<T>());

  // API 훅 연동
  const { data, isLoading, refetch } = useQuery(/* ... */);

  useEffect(() => {
    store.setData(data ?? []);
    store.setLoading(isLoading);
  }, [data, isLoading]);

  return {
    store,
    config: store.toConfig(),
    refetch,
  };
}
```

---

## 9. 체크리스트

### 타입 정의
- [ ] AdminTableConfig 인터페이스 정의
- [ ] ColumnConfig 인터페이스 정의
- [ ] InputConfig 인터페이스 정의
- [ ] SelectionConfig 인터페이스 정의
- [ ] PaginationConfig 인터페이스 정의
- [ ] ResponsiveConfig 인터페이스 정의

### 컴포넌트 구현
- [ ] AdminTable 메인 컴포넌트
- [ ] AdminTableContext Provider
- [ ] AdminTableHeader (leftInputs, rightInputs 렌더링)
- [ ] AdminTableBody (TanStack Table 연동)
- [ ] AdminTableFooter (페이지네이션)
- [ ] AdminTableCard (모바일 카드 뷰)
- [ ] AdminTableActionBar (선택 시 액션바)
- [ ] AdminTableSkeleton (로딩 상태)
- [ ] AdminTableEmpty (빈 상태)

### 입력 컴포넌트 렌더러
- [ ] InputRenderer (타입별 분기)
- [ ] SearchInput
- [ ] SelectInput
- [ ] MultiSelectInput
- [ ] DateRangeInput
- [ ] ButtonInput
- [ ] ButtonGroupInput
- [ ] DropdownInput
- [ ] ChipGroupInput

### 훅 구현
- [ ] useAdminTable
- [ ] useTableColumns (컬럼 가시성 연동)
- [ ] useTableResponsive (반응형 처리)

### 연동
- [ ] 컬럼 가시성 시스템 연동 (useColumnVisibility)
- [ ] CASL 권한 연동 (Can 컴포넌트)
- [ ] TanStack Table 연동

### 테스트
- [ ] Storybook 스토리 작성
- [ ] 단위 테스트 작성
- [ ] 반응형 테스트 (Desktop/Tablet/Mobile)

---

## 10. 참고 자료

- [TanStack Table](https://tanstack.com/table/v8)
- [HeroUI Table](https://heroui.com/docs/components/table)
- 컬럼 가시성 시스템: `2025-12-30-CASL-Permission-System.md` (12장)
