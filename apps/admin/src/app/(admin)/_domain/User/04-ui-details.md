# L7-L8: 데이터 모델, UI 컴포넌트

## 이전 레이어 요약 (L0-L6)

- **L0-L2**: 관리자가 이용자 목록을 조회/검색/필터링/정렬
- **L3**: 목록 표시, 통합 검색, 필터 패널, 정렬, 통계
- **L4**: 이용자 목록 화면 (`/users`)
- **L5**: 페이지 로드, 검색, 필터, 정렬, 페이지네이션 인터랙션
- **L6**: `GET /api/users` (기존 구현)

---

## L7: 데이터 모델 (Entity)

### 엔티티 목록

| ID | 엔티티 | 위치 | 상태 | 설명 |
|----|--------|------|------|------|
| USR-L7-ENT-001 | User | `@cocrepo/prisma` | 기존 | 이용자 기본 정보 |
| USR-L7-ENT-002 | Profile | `@cocrepo/prisma` | 기존 | 이용자 프로필 (1:N) |
| USR-L7-ENT-003 | Tenant | `@cocrepo/prisma` | 기존 | 테넌트 (Space-User-Role 연결) |
| USR-L7-ENT-004 | UserClassification | `@cocrepo/prisma` | 기존 | 이용자 분류 |
| USR-L7-ENT-005 | UserAssociation | `@cocrepo/prisma` | 기존 | 이용자-그룹 연결 |

### 엔티티 관계

```
┌──────────────┐      1:N      ┌──────────────┐
│    User      │───────────────│   Profile    │
│              │               │ (nickname,   │
│ id           │               │  avatar)     │
│ name         │               └──────────────┘
│ email        │
│ phone        │      1:N      ┌──────────────┐
│ password     │───────────────│   Tenant     │
│ createdAt    │               │ (Space+Role) │
│ removedAt    │               └──────────────┘
│              │
│              │      1:1      ┌──────────────────────┐
│              │───────────────│ UserClassification   │
│              │               │ (Category 연결)       │
│              │               └──────────────────────┘
│              │
│              │      1:N      ┌──────────────────────┐
│              │───────────────│  UserAssociation     │
└──────────────┘               │ (Group 연결)          │
                               └──────────────────────┘
```

### 주요 엔티티 상세

#### User (기존)

```prisma
model User {
  id                 String              @id @default(uuid())
  seq                Int                 @unique @default(autoincrement())
  updatedAt          DateTime?           @updatedAt @db.Timestamptz(6)
  createdAt          DateTime            @default(now()) @db.Timestamptz(6)
  removedAt          DateTime?           @db.Timestamptz(6)
  phone              String              @unique
  name               String              @unique
  email              String              @unique
  password           String
  profiles           Profile[]
  tenants            Tenant[]
  classification     UserClassification?
  associations       UserAssociation[]
  // ... 기타 관계
}
```

### DTO 목록 (기존)

| DTO | 위치 | 용도 |
|-----|------|------|
| UserDto | `@cocrepo/dto` | 응답용 |
| QueryUsersDto | `@cocrepo/dto` | 목록 조회 쿼리 |
| UserPaginationMetaDto | `@cocrepo/dto` | 페이지네이션 메타 |
| UserStatsDto | `@cocrepo/dto` | 통계 정보 |
| UserDetailResponseDto | `@cocrepo/dto` | 상세 응답 (미사용) |

---

## L8: UI 컴포넌트

### 컴포넌트 계층 구조

```
Page (이용자 목록)
└── PageSurface
    ├── SectionSurface (통계)
    │   └── StatsCard (Widget) x 3
    │
    ├── SearchFilterBar (Widget)
    │   ├── SearchInput (Pure UI)
    │   └── FilterButton (Pure UI)
    │
    ├── FilterPanel (Widget) - 접이식
    │   ├── CheckboxGroup (Pure UI) - 역할
    │   ├── RadioGroup (Pure UI) - 상태
    │   ├── Select (Pure UI) - 분류
    │   ├── MultiSelect (Pure UI) - 그룹
    │   └── DateRangePicker (Pure UI) - 가입일
    │
    └── SectionSurface (목록)
        └── DataGrid (Pure UI)
            ├── Column: seq (번호)
            ├── Column: name (이름)
            ├── Column: email (이메일)
            ├── Column: phone (전화번호)
            ├── Column: role (역할) - Cell 필요
            ├── Column: status (상태) - Cell 필요
            └── Column: createdAt (가입일) - Cell 필요
```

### 컴포넌트 목록

#### Pure UI (기존 활용)

| ID | 컴포넌트 | 패키지 | 상태 | 설명 |
|----|---------|--------|------|------|
| USR-L8-CMP-001 | DataGrid | `@cocrepo/ui` | 기존 | 테이블 그리드 |
| USR-L8-CMP-002 | Input | HeroUI | 기존 | 검색 입력창 |
| USR-L8-CMP-003 | Button | HeroUI | 기존 | 버튼 |
| USR-L8-CMP-004 | Select | HeroUI | 기존 | 단일 선택 |
| USR-L8-CMP-005 | Checkbox | HeroUI | 기존 | 체크박스 |
| USR-L8-CMP-006 | DatePicker | HeroUI | 기존 | 날짜 선택 |

#### Cell 컴포넌트 (신규)

| ID | 컴포넌트 | 위치 | 설명 |
|----|---------|------|------|
| USR-L8-CMP-010 | UserRoleCell | `@cocrepo/ui` | 역할 뱃지 표시 |
| USR-L8-CMP-011 | UserStatusCell | `@cocrepo/ui` | 상태 뱃지 표시 |
| USR-L8-CMP-012 | DateTimeCell | `@cocrepo/ui` | 날짜 포맷팅 |

#### Widget 컴포넌트

| ID | 컴포넌트 | 위치 | 상태 | 설명 |
|----|---------|------|------|------|
| USR-L8-CMP-020 | StatsCard | `@cocrepo/ui` | 확인 필요 | 통계 카드 |
| USR-L8-CMP-021 | SearchFilterBar | `@cocrepo/ui` | 신규 | 검색+필터버튼 조합 |
| USR-L8-CMP-022 | FilterPanel | `@cocrepo/ui` | 신규 | 접이식 필터 패널 |

### 컴포넌트 상세

#### USR-L8-CMP-010: UserRoleCell

**용도**: DataGrid에서 역할을 뱃지 형태로 표시

**Props**:
```typescript
interface UserRoleCellProps {
  tenants?: TenantDto[];
}
```

**렌더링**:
```tsx
// 첫 번째 Tenant의 Role 표시
<Badge color="primary" variant="flat">
  {tenants?.[0]?.role?.name ?? '-'}
</Badge>
```

#### USR-L8-CMP-011: UserStatusCell

**용도**: DataGrid에서 이용자 상태를 뱃지로 표시

**Props**:
```typescript
interface UserStatusCellProps {
  removedAt?: Date | null;
}
```

**렌더링**:
```tsx
// removedAt 기반 상태 계산
const status = removedAt ? 'removed' : 'active';
const color = removedAt ? 'danger' : 'success';
const label = removedAt ? '삭제됨' : '활성';

<Badge color={color} variant="flat">
  {label}
</Badge>
```

#### USR-L8-CMP-021: SearchFilterBar

**용도**: 검색창과 필터 토글 버튼을 조합한 위젯

**Props**:
```typescript
interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onFilterToggle: () => void;
  isFilterOpen: boolean;
  filterCount: number;  // 적용된 필터 수 표시
}
```

**레이아웃**:
```
┌────────────────────────────────────────────────┐
│ [🔍 검색어 입력...                  ] [필터 ▼] │
└────────────────────────────────────────────────┘
```

#### USR-L8-CMP-022: FilterPanel

**용도**: 접이식 필터 옵션 패널

**Props**:
```typescript
interface FilterPanelProps {
  isOpen: boolean;
  filters: UserFilters;
  onFilterChange: (filters: Partial<UserFilters>) => void;
  onReset: () => void;
  roleOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  groupOptions: { label: string; value: string }[];
}

interface UserFilters {
  roles: string[];
  status: 'active' | 'inactive' | 'removed' | null;
  categoryId: string | null;
  groupIds: string[];
  createdFrom: Date | null;
  createdTo: Date | null;
}
```

### DataGrid 컬럼 설정

```typescript
const columns: ColumnDef<UserDto>[] = [
  {
    id: 'seq',
    header: '번호',
    accessor: 'seq',
    width: 80,
    sortable: true,
  },
  {
    id: 'name',
    header: '이름',
    accessor: 'name',
    width: 150,
    sortable: true,
  },
  {
    id: 'email',
    header: '이메일',
    accessor: 'email',
    width: 200,
    sortable: true,
  },
  {
    id: 'phone',
    header: '전화번호',
    accessor: 'phone',
    width: 150,
  },
  {
    id: 'role',
    header: '역할',
    cell: ({ row }) => <UserRoleCell tenants={row.tenants} />,
    width: 120,
  },
  {
    id: 'status',
    header: '상태',
    cell: ({ row }) => <UserStatusCell removedAt={row.removedAt} />,
    width: 100,
  },
  {
    id: 'createdAt',
    header: '가입일',
    cell: ({ row }) => <DateTimeCell value={row.createdAt} format="YYYY-MM-DD" />,
    width: 120,
    sortable: true,
  },
];
```

---

## Requirement Graph (L7-L8)

```json
{
  "nodes": [
    {
      "id": "USR-L7-ENT-001",
      "level": 7,
      "type": "entity",
      "label": "User",
      "description": "이용자 기본 정보 (기존)",
      "metadata": { "status": "existing", "package": "@cocrepo/prisma" }
    },
    {
      "id": "USR-L7-ENT-002",
      "level": 7,
      "type": "entity",
      "label": "Profile",
      "description": "이용자 프로필 (기존)",
      "metadata": { "status": "existing", "package": "@cocrepo/prisma" }
    },
    {
      "id": "USR-L7-ENT-003",
      "level": 7,
      "type": "entity",
      "label": "Tenant",
      "description": "Space-User-Role 연결 (기존)",
      "metadata": { "status": "existing", "package": "@cocrepo/prisma" }
    },
    {
      "id": "USR-L8-CMP-001",
      "level": 8,
      "type": "component",
      "label": "DataGrid",
      "description": "테이블 그리드 (기존)",
      "metadata": { "status": "existing", "package": "@cocrepo/ui" }
    },
    {
      "id": "USR-L8-CMP-010",
      "level": 8,
      "type": "component",
      "label": "UserRoleCell",
      "description": "역할 뱃지 Cell",
      "metadata": { "status": "new", "package": "@cocrepo/ui" }
    },
    {
      "id": "USR-L8-CMP-011",
      "level": 8,
      "type": "component",
      "label": "UserStatusCell",
      "description": "상태 뱃지 Cell",
      "metadata": { "status": "new", "package": "@cocrepo/ui" }
    },
    {
      "id": "USR-L8-CMP-012",
      "level": 8,
      "type": "component",
      "label": "DateTimeCell",
      "description": "날짜 포맷팅 Cell",
      "metadata": { "status": "check", "package": "@cocrepo/ui" }
    },
    {
      "id": "USR-L8-CMP-020",
      "level": 8,
      "type": "component",
      "label": "StatsCard",
      "description": "통계 카드 Widget",
      "metadata": { "status": "check", "package": "@cocrepo/ui" }
    },
    {
      "id": "USR-L8-CMP-021",
      "level": 8,
      "type": "component",
      "label": "SearchFilterBar",
      "description": "검색+필터 조합 Widget",
      "metadata": { "status": "new", "package": "@cocrepo/ui" }
    },
    {
      "id": "USR-L8-CMP-022",
      "level": 8,
      "type": "component",
      "label": "FilterPanel",
      "description": "접이식 필터 패널 Widget",
      "metadata": { "status": "new", "package": "@cocrepo/ui" }
    }
  ],
  "edges": [
    { "from": "USR-L6-API-001", "to": "USR-L7-ENT-001", "type": "returns" },
    { "from": "USR-L7-ENT-001", "to": "USR-L7-ENT-002", "type": "has_many" },
    { "from": "USR-L7-ENT-001", "to": "USR-L7-ENT-003", "type": "has_many" },
    { "from": "USR-L4-SCR-001", "to": "USR-L8-CMP-001", "type": "uses" },
    { "from": "USR-L4-SCR-001", "to": "USR-L8-CMP-020", "type": "uses" },
    { "from": "USR-L4-SCR-001", "to": "USR-L8-CMP-021", "type": "uses" },
    { "from": "USR-L4-SCR-001", "to": "USR-L8-CMP-022", "type": "uses" },
    { "from": "USR-L8-CMP-001", "to": "USR-L8-CMP-010", "type": "contains" },
    { "from": "USR-L8-CMP-001", "to": "USR-L8-CMP-011", "type": "contains" },
    { "from": "USR-L8-CMP-001", "to": "USR-L8-CMP-012", "type": "contains" }
  ]
}
```
