# 04. 사용 예시 및 시나리오

## 1. 회원 목록 페이지

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

---

## 2. URL Querystring 예시

```
/admin/members?search=홍길동&role=ADMIN&take=20&skip=0
```

페이지 새로고침해도 필터/페이지네이션 상태 유지됩니다.
