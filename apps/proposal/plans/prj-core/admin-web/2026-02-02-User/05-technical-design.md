# L9-L10: 비즈니스 로직, 테스트

## 이전 레이어 요약 (L0-L8)

- **L0-L2**: 관리자가 이용자 목록 조회/검색/필터링/정렬
- **L3-L4**: 목록 화면 (`/users`)에 검색, 필터, 정렬, 통계 기능
- **L5-L6**: `GET /api/users` API 호출 (기존 구현)
- **L7**: User, Profile, Tenant 엔티티 (기존)
- **L8**: DataGrid, Cell 컴포넌트, SearchFilterBar, FilterPanel

---

## L9: 비즈니스 로직 (Logic)

### 프론트엔드 로직

#### USR-L9-LOG-001: 쿼리 파라미터 관리

**목적**: URL 쿼리 파라미터와 React Query를 동기화

**구현 위치**: `apps/admin/app/users/_client.tsx`

```typescript
// 쿼리 파라미터 타입
interface UserListQueryParams {
  search?: string;
  roles?: string[];
  status?: UserStatus;
  categoryId?: string;
  groupIds?: string[];
  createdFrom?: string;  // ISO8601
  createdTo?: string;    // ISO8601
  sort?: string[];  // JSON:API 컨벤션: 부호 없음=ASC, -prefix=DESC (예: ["name", "-createdAt"])
  skip?: number;
  take?: number;
}

// URL searchParams → 쿼리 파라미터 변환
function parseSearchParams(searchParams: URLSearchParams): UserListQueryParams {
  return {
    search: searchParams.get('search') || undefined,
    roles: searchParams.getAll('roles'),
    status: (searchParams.get('status') as UserStatus) || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    groupIds: searchParams.getAll('groupIds'),
    createdFrom: searchParams.get('createdFrom') || undefined,
    createdTo: searchParams.get('createdTo') || undefined,
    sort: searchParams.getAll('sort').length > 0 ? searchParams.getAll('sort') : undefined,
    skip: searchParams.get('skip') ? Number(searchParams.get('skip')) : undefined,
    take: searchParams.get('take') ? Number(searchParams.get('take')) : undefined,
  };
}
```

#### USR-L9-LOG-002: 검색 Debounce 처리

**목적**: 빈번한 API 호출 방지

```typescript
// 검색어 상태 (로컬)
const [localSearch, setLocalSearch] = useState(queryParams.search ?? '');

// Debounce 적용
const debouncedSearch = useDebounce(localSearch, 300);

// debouncedSearch 변경 시 URL 업데이트
useEffect(() => {
  const newParams = { ...queryParams, search: debouncedSearch, page: 1 };
  updateSearchParams(newParams);
}, [debouncedSearch]);
```

#### USR-L9-LOG-003: 필터 적용 로직

**목적**: 필터 변경 시 페이지 초기화 및 API 재호출

```typescript
function handleFilterChange(newFilters: Partial<UserFilters>) {
  const params: UserListQueryParams = {
    ...queryParams,
    ...newFilters,
    page: 1,  // 필터 변경 시 첫 페이지로
  };

  // 빈 배열이나 null 값은 파라미터에서 제거
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      return v != null && v !== '';
    })
  );

  updateSearchParams(cleanedParams);
}
```

#### USR-L9-LOG-004: 정렬 상태 토글 로직

```typescript
function handleSortToggle(field: string) {
  const currentSort = queryParams.sort ?? [];
  const ascEntry = field;         // "name"
  const descEntry = `-${field}`;  // "-name"

  let newSort: string[];

  if (currentSort.includes(ascEntry)) {
    // ASC → DESC
    newSort = currentSort.map((s) => (s === ascEntry ? descEntry : s));
  } else if (currentSort.includes(descEntry)) {
    // DESC → 정렬 해제
    newSort = currentSort.filter((s) => s !== descEntry);
  } else {
    // 없음 → ASC 추가
    newSort = [...currentSort, ascEntry];
  }

  updateSearchParams({
    ...queryParams,
    sort: newSort.length > 0 ? newSort : undefined,
  });
}
```

#### USR-L9-LOG-005: 적용된 필터 수 계산

```typescript
function getActiveFilterCount(filters: UserFilters): number {
  let count = 0;
  if (filters.roles.length > 0) count++;
  if (filters.status) count++;
  if (filters.categoryId) count++;
  if (filters.groupIds.length > 0) count++;
  if (filters.createdFrom || filters.createdTo) count++;
  return count;
}
```

### 백엔드 로직 (기존 구현)

| 로직 | 위치 | 상태 |
|------|------|------|
| Space 기반 필터링 | `UsersService.getMembersBySpace` | 기존 |
| 통합 검색 | `UsersRepository.searchQuery` | 기존 |
| 통계 계산 | `UsersService.calculateStats` | 기존 |

---

## L10: 테스트 (Test)

### 프론트엔드 테스트

#### USR-L10-TST-001: 페이지 컴포넌트 테스트

**파일**: `apps/admin/app/users/__tests__/page.test.tsx`

```typescript
describe('이용자 목록 페이지', () => {
  describe('초기 로딩', () => {
    it('권한이 있으면 목록을 표시한다', async () => {
      // Given: read 권한이 있는 사용자
      mockAbility.can('read', 'user').returns(true);

      // When: 페이지 렌더링
      render(<UserListPage />);

      // Then: 목록이 표시됨
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });

    it('권한이 없으면 접근 불가 메시지를 표시한다', async () => {
      // Given: read 권한이 없는 사용자
      mockAbility.can('read', 'user').returns(false);

      // When: 페이지 렌더링
      render(<UserListPage />);

      // Then: 접근 불가 메시지
      expect(screen.getByText(/접근 권한이 없습니다/)).toBeInTheDocument();
    });
  });

  describe('검색 기능', () => {
    it('검색어 입력 후 Enter 시 검색을 실행한다', async () => {
      // Given: 목록이 표시된 상태
      render(<UserListPage />);

      // When: 검색어 입력 + Enter
      const searchInput = screen.getByPlaceholderText(/검색/);
      await userEvent.type(searchInput, '홍길동{enter}');

      // Then: API 호출됨 (search 파라미터 포함)
      await waitFor(() => {
        expect(mockUseGetUsers).toHaveBeenCalledWith(
          expect.objectContaining({ search: '홍길동' })
        );
      });
    });
  });

  describe('필터 기능', () => {
    it('역할 필터 변경 시 목록이 갱신된다', async () => {
      // Given: 필터 패널이 열린 상태
      render(<UserListPage />);
      await userEvent.click(screen.getByText('필터'));

      // When: 역할 체크박스 선택
      await userEvent.click(screen.getByLabelText('관리자'));

      // Then: API 호출됨 (roles 파라미터 포함)
      await waitFor(() => {
        expect(mockUseGetUsers).toHaveBeenCalledWith(
          expect.objectContaining({ roles: ['ADMIN'] })
        );
      });
    });

    it('필터 초기화 시 모든 필터가 해제된다', async () => {
      // Given: 필터가 적용된 상태
      render(<UserListPage initialFilters={{ roles: ['ADMIN'] }} />);

      // When: 초기화 버튼 클릭
      await userEvent.click(screen.getByText('초기화'));

      // Then: 필터 없이 API 호출됨
      await waitFor(() => {
        expect(mockUseGetUsers).toHaveBeenCalledWith(
          expect.not.objectContaining({ roles: expect.anything() })
        );
      });
    });
  });

  describe('정렬 기능', () => {
    it('컬럼 헤더 클릭 시 정렬이 토글된다', async () => {
      // Given: 목록이 표시된 상태
      render(<UserListPage />);

      // When: 이름 컬럼 헤더 클릭
      await userEvent.click(screen.getByText('이름'));

      // Then: 오름차순 정렬 API 호출 (JSON:API 컨벤션)
      await waitFor(() => {
        expect(mockUseGetUsers).toHaveBeenCalledWith(
          expect.objectContaining({ sort: expect.arrayContaining(['name']) })
        );
      });

      // When: 다시 클릭
      await userEvent.click(screen.getByText('이름'));

      // Then: 내림차순 정렬 API 호출
      await waitFor(() => {
        expect(mockUseGetUsers).toHaveBeenCalledWith(
          expect.objectContaining({ sort: expect.arrayContaining(['-name']) })
        );
      });
    });
  });

  describe('페이지네이션', () => {
    it('페이지 번호 클릭 시 해당 페이지로 이동한다', async () => {
      // Given: 여러 페이지가 있는 목록
      mockUseGetUsers.mockReturnValue({
        data: { meta: { total: 100, totalPages: 5 } }
      });
      render(<UserListPage />);

      // When: 2페이지 클릭
      await userEvent.click(screen.getByText('2'));

      // Then: page=2로 API 호출
      await waitFor(() => {
        expect(mockUseGetUsers).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 })
        );
      });
    });
  });

  describe('빈 상태', () => {
    it('검색 결과가 없으면 안내 메시지를 표시한다', async () => {
      // Given: 빈 결과
      mockUseGetUsers.mockReturnValue({
        data: { data: [], meta: { total: 0 } }
      });

      // When: 검색 실행
      render(<UserListPage search="존재하지않는사용자" />);

      // Then: 빈 상태 메시지
      expect(screen.getByText(/검색 결과가 없습니다/)).toBeInTheDocument();
    });
  });
});
```

#### USR-L10-TST-002: Cell 컴포넌트 테스트

**파일**: `packages/ui/src/components/cell/__tests__/UserRoleCell.test.tsx`

```typescript
describe('UserRoleCell', () => {
  it('첫 번째 테넌트의 역할을 표시한다', () => {
    // Given
    const tenants = [
      { role: { name: '관리자' } },
      { role: { name: '일반' } },
    ];

    // When
    render(<UserRoleCell tenants={tenants} />);

    // Then
    expect(screen.getByText('관리자')).toBeInTheDocument();
    expect(screen.queryByText('일반')).not.toBeInTheDocument();
  });

  it('테넌트가 없으면 대시를 표시한다', () => {
    render(<UserRoleCell tenants={[]} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});

describe('UserStatusCell', () => {
  it('removedAt이 없으면 활성 상태를 표시한다', () => {
    render(<UserStatusCell removedAt={null} />);
    expect(screen.getByText('활성')).toBeInTheDocument();
  });

  it('removedAt이 있으면 삭제됨 상태를 표시한다', () => {
    render(<UserStatusCell removedAt={new Date()} />);
    expect(screen.getByText('삭제됨')).toBeInTheDocument();
  });
});
```

### 백엔드 테스트 (기존 구현 확인)

| 테스트 | 상태 | 비고 |
|--------|------|------|
| UsersController 유닛 테스트 | 확인 필요 | |
| UsersService 유닛 테스트 | 확인 필요 | |
| Users E2E 테스트 | 확인 필요 | |

### 테스트 실행 명령어

```bash
# 프론트엔드 테스트
pnpm --filter=admin test -- --run users

# 패키지 테스트 (Cell 컴포넌트)
pnpm --filter=@cocrepo/ui test -- --run UserRoleCell
pnpm --filter=@cocrepo/ui test -- --run UserStatusCell

# 백엔드 테스트
pnpm --filter=server test -- users
```

---

## Requirement Graph (L9-L10)

```json
{
  "nodes": [
    {
      "id": "USR-L9-LOG-001",
      "level": 9,
      "type": "logic",
      "label": "쿼리 파라미터 관리",
      "description": "URL 쿼리 파라미터와 React Query 동기화"
    },
    {
      "id": "USR-L9-LOG-002",
      "level": 9,
      "type": "logic",
      "label": "검색 Debounce",
      "description": "300ms debounce로 API 호출 최적화"
    },
    {
      "id": "USR-L9-LOG-003",
      "level": 9,
      "type": "logic",
      "label": "필터 적용",
      "description": "필터 변경 시 페이지 초기화 및 API 재호출"
    },
    {
      "id": "USR-L9-LOG-004",
      "level": 9,
      "type": "logic",
      "label": "정렬 토글",
      "description": "ASC → DESC → 해제 순환"
    },
    {
      "id": "USR-L9-LOG-005",
      "level": 9,
      "type": "logic",
      "label": "필터 카운트",
      "description": "적용된 필터 수 계산"
    },
    {
      "id": "USR-L10-TST-001",
      "level": 10,
      "type": "test",
      "label": "페이지 컴포넌트 테스트",
      "description": "UserListPage 통합 테스트"
    },
    {
      "id": "USR-L10-TST-002",
      "level": 10,
      "type": "test",
      "label": "Cell 컴포넌트 테스트",
      "description": "UserRoleCell, UserStatusCell 단위 테스트"
    }
  ],
  "edges": [
    { "from": "USR-L5-ACT-001", "to": "USR-L9-LOG-001", "type": "implements" },
    { "from": "USR-L5-ACT-003", "to": "USR-L9-LOG-002", "type": "implements" },
    { "from": "USR-L5-ACT-005", "to": "USR-L9-LOG-003", "type": "implements" },
    { "from": "USR-L5-ACT-007", "to": "USR-L9-LOG-004", "type": "implements" },
    { "from": "USR-L8-CMP-021", "to": "USR-L9-LOG-005", "type": "uses" },
    { "from": "USR-L4-SCR-001", "to": "USR-L10-TST-001", "type": "tested_by" },
    { "from": "USR-L8-CMP-010", "to": "USR-L10-TST-002", "type": "tested_by" },
    { "from": "USR-L8-CMP-011", "to": "USR-L10-TST-002", "type": "tested_by" }
  ]
}
```
