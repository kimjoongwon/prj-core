# 05. 기술 설계서

> 원본 기획서: 동일 폴더 내 01~04 문서

## 1. 컴포넌트 분석

### 1.1 기존 컴포넌트 재사용

| 컴포넌트 | 유형 | 경로 | 용도 |
|----------|------|------|------|
| Button | ui | components/ui/Button | 액션 버튼 |
| Input | inputs | components/inputs/Input | 검색 입력 |
| Chip | ui | @heroui/chip | 상태 표시 |
| Table | ui | @heroui/table | 테이블 |
| Pagination | ui | @heroui/pagination | 페이지네이션 |
| Modal | ui | @heroui/modal | 삭제/상태변경 확인 |
| Tabs | ui | @heroui/tabs | 상태별 탭 |
| AdminLayout | layouts | components/layouts/AdminLayout | 관리자 레이아웃 |

### 1.2 신규 컴포넌트 (구현 완료)

| 컴포넌트명 | 유형 | 설명 | 경로 |
|-----------|------|------|------|
| UserSearchWidget | widgets | 검색 입력 UI | `widgets/user/UserSearchWidget` |
| UserTableWidget | widgets | 회원 테이블 UI | `widgets/user/UserTableWidget` |
| UserFormWidget | widgets | 등록/수정 폼 UI | `widgets/user/UserFormWidget` |
| UserDetailWidget | widgets | 상세 정보 UI | `widgets/user/UserDetailWidget` |
| UserList | features | Store 연결된 회원 목록 | `features/user/UserList` |
| UserForm | features | Store 연결된 등록/수정 폼 | `features/user/UserForm` |

### 1.3 컴포넌트 배치도

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [SideNav]  │              회원 목록                                       │ ← AdminLayout
│            │─────────────────────────────────────────────────────────────│
│            │  ┌─────────────────────────────────────────────────────┐   │
│            │  │ [전체] [활성] [휴면] [탈퇴대기]              (탭 바) │   │ ← Tabs (HeroUI)
│            │  └─────────────────────────────────────────────────────┘   │
│            │                                                             │
│            │  ┌─────────────────────────────────────────────────────┐   │
│            │  │ 🔍 [         검색어 입력            ]  [+ 회원 등록] │   │ ← UserSearchWidget (widgets)
│            │  └─────────────────────────────────────────────────────┘   │
│            │                                                             │
│            │  ┌─────────────────────────────────────────────────────┐   │
│            │  │ □ │ 이름   │ 이메일   │ 전화번호 │ 등급 │ 상태 │ ··· │   │ ← UserTableWidget (widgets)
│            │  │───┼────────┼──────────┼──────────┼──────┼──────┼─────│   │   ├ Table (HeroUI)
│            │  │ □ │ 홍길동 │ hong@... │ 010-...  │ VIP  │ 🟢활성│ ··· │   │   └ Chip (상태 표시)
│            │  └─────────────────────────────────────────────────────┘   │
│            │                                                             │
│            │  ┌─────────────────────────────────────────────────────┐   │
│            │  │         < 1 2 3 4 5 ... 10 >          (페이지네이션)│   │ ← Pagination (HeroUI)
│            │  └─────────────────────────────────────────────────────┘   │
│            │                                                             │
│            │  [선택 항목: 3개]        [일괄 상태 변경] [일괄 삭제]       │ ← 일괄 작업 바 (선택 시)
└──────────────────────────────────────────────────────────────────────────┘

컴포넌트 계층 요약:
AdminLayout
├── Tabs (탭 네비게이션)
├── UserList (features) ─── API 연동
│   ├── UserSearchWidget (widgets)
│   │   └── Input (inputs)
│   ├── UserTableWidget (widgets)
│   │   ├── Table (HeroUI)
│   │   ├── Chip (상태 표시)
│   │   └── Button (액션)
│   └── Pagination (HeroUI)
└── Modal (삭제/상태변경 확인)
```

---

## 2. Entity 설계

### 2.1 기존 Entity 사용

#### User

**파일 경로:** `packages/prisma/schema/user.prisma`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| email | String | 이메일 | @unique |
| name | String | 이름 | - |
| phone | String? | 전화번호 | - |
| status | UserStatus | 상태 | @default(ACTIVE) |
| role | String? | 등급 | - |
| createdAt | DateTime | 가입일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

### 2.2 UserStatus Enum

```prisma
enum UserStatus {
  ACTIVE           // 활성
  INACTIVE         // 휴면
  REMOVED          // 탈퇴대기
}
```

---

## 3. API 설계

| Method | Path | OperationId | 설명 | 인증 |
|--------|------|-------------|------|------|
| GET | /api/v1/users | getUsers | 목록 조회 (검색, 필터, 페이지네이션) | Bearer Token |
| GET | /api/v1/users/:id | getUserById | 상세 조회 | Bearer Token |
| POST | /api/v1/users | createUser | 등록 | Bearer Token |
| PATCH | /api/v1/users/:id | updateUser | 수정 | Bearer Token |
| DELETE | /api/v1/users/:id | deleteUser | 삭제 (Soft Delete) | Bearer Token |

### Query Parameters (GET /api/v1/users)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| page | number | 페이지 번호 (기본: 1) |
| limit | number | 페이지당 항목 수 (기본: 10) |
| search | string | 이름/이메일/전화번호 검색 |
| status | UserStatus | 상태 필터 |

---

## 4. 라우팅 설계

| 경로 | 파일 | 설명 |
|------|------|------|
| `/users` | `page.tsx` | 전체 회원 목록 |
| `/users/active` | `active/page.tsx` | 활성 회원 목록 |
| `/users/dormant` | `dormant/page.tsx` | 휴면 회원 목록 |
| `/users/pending-withdrawal` | `pending-withdrawal/page.tsx` | 탈퇴대기 회원 목록 |
| `/users/new` | `new/page.tsx` | 회원 등록 |
| `/users/[id]` | `[id]/page.tsx` | 회원 상세 |
| `/users/[id]/edit` | `[id]/edit/page.tsx` | 회원 수정 |

---

## 5. 에이전트 실행 계획

### Phase 1: 백엔드 (✅ 이미 구현됨)

API 엔드포인트가 이미 존재하므로 백엔드 작업 불필요.

### Phase 2: 프론트엔드 컴포넌트 (✅ 구현 완료)

**순서:** widget-builder → feature-builder

1. **UserSearchWidget** - 검색 입력 UI
2. **UserTableWidget** - 회원 테이블 UI
3. **UserFormWidget** - 등록/수정 폼 UI
4. **UserDetailWidget** - 상세 정보 UI
5. **UserList** - API 연결된 회원 목록
6. **UserForm** - API 연결된 등록/수정 폼

### Phase 3: 페이지 (✅ 구현 완료)

**순서:** page-builder → page-reviewer

1. **UsersPageContent** - 공통 페이지 레이아웃
2. 전체/활성/휴면/탈퇴대기 탭 페이지 (4개)
3. 등록/상세/수정 페이지 (3개)

---

## 6. 에이전트별 지시사항 (참고용)

### 6.1 widget-builder 지시

**생성할 컴포넌트:** UserSearchWidget, UserTableWidget, UserFormWidget, UserDetailWidget

**공통 요구사항:**
- Props로만 동작하는 순수 UI 컴포넌트
- Store 연동 없음
- HeroUI 컴포넌트 활용

**UserTableWidget Props:**
```typescript
interface UserTableWidgetProps {
  users: User[];
  isLoading: boolean;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  onRowClick: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}
```

### 6.2 feature-builder 지시

**생성할 컴포넌트:** UserList, UserForm

**공통 요구사항:**
- Orval 생성 API 사용 (`@cocrepo/api`)
- `observer`로 감싸기
- Props로 statusFilter 받아서 필터링

**UserList Props:**
```typescript
interface UserListProps {
  statusFilter?: UserStatus;
}
```

---

## 7. 기술 고려사항

### 7.1 보안

| 항목 | 대응 방안 |
|------|----------|
| 인증 | JWT Bearer Token |
| 인가 | 관리자 권한 필요 |
| 입력 검증 | class-validator (백엔드) |

### 7.2 성능

| 항목 | 대응 방안 |
|------|----------|
| 페이지네이션 | Offset 기반 |
| 검색 | 서버사이드 필터링 |
| 상태 관리 | React Query 캐싱 |

### 7.3 URL 상태 관리

| 파라미터 | 라이브러리 | 설명 |
|----------|-----------|------|
| page | nuqs | 페이지 번호 |
| limit | nuqs | 페이지당 항목 수 |
| search | nuqs | 검색어 |

---

## 8. 구현 상태

| 항목 | 상태 | 비고 |
|------|:----:|------|
| 백엔드 API | ✅ | 이미 구현됨 |
| Widget 컴포넌트 | ✅ | 4개 구현 완료 |
| Feature 컴포넌트 | ✅ | 2개 구현 완료 |
| 페이지 컴포넌트 | ✅ | 8개 구현 완료 |
| 타입 체크 | ✅ | 통과 |
