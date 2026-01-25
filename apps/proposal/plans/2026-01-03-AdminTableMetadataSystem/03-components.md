# 컴포넌트 구조 및 반응형

## 1. 디렉토리 구조

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

---

## 2. AdminTable 컴포넌트

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

---

## 3. InputRenderer (입력 컴포넌트 렌더러)

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

## 4. 모바일 반응형

### 자동 카드 뷰 전환

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

### 모바일 UI 자동 변환

| Desktop | Mobile |
|---------|--------|
| 테이블 뷰 | 카드 뷰 |
| 검색 + 필터 나란히 | 검색 + 필터 버튼 (바텀시트) |
| 페이지네이션 | 무한 스크롤 또는 더보기 버튼 |
| 선택 체크박스 | 롱프레스 선택 모드 |
| 액션 버튼 | 하단 플로팅 액션바 |

### InputConfig의 showOn 활용

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

## 5. 레이아웃 구조

### Desktop 레이아웃

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

### Mobile 레이아웃 (카드 뷰)

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

### 선택 모드 시 액션바

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

## 6. Store 연동 (선택적)

복잡한 테이블의 경우 Store로 상태 관리를 분리할 수 있습니다.

### AdminTableStore

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

### useAdminTable 훅

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
