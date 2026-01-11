# 사용 예시

## 1. 기본 사용 예시

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

---

## 2. 간단한 사용 예시

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

## 3. 컬럼 가시성 시스템 연동

### useColumnVisibility 훅 활용

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

### 필수 컬럼 처리

```tsx
// 필수 컬럼은 가시성 설정과 무관하게 항상 표시
const displayColumns = mergedColumns.filter(col => {
  // isRequired: true면 항상 표시
  if (col.isRequired) return true;
  // 그 외는 visible 설정에 따름
  return col.visible;
});
```
