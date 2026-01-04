# 회원목록 화면 기획서

> 작성일: 2026-01-03
> 버전: 1.0
> 상태: 초안

---

## 1. 개요

### 1.1 목적
엔터프라이즈급 회원 관리 시스템을 구축하여 대규모 사용자 데이터를 효율적으로 관리하고, 고급 필터링, 일괄 작업, 통계 분석 기능을 제공합니다.

### 1.2 대상 사용자
- **SUPER_ADMIN**: 전체 시스템 관리자 (모든 Space의 회원 관리)
- **ADMIN**: Space 관리자 (해당 Space의 회원 관리)

### 1.3 접근 경로
```
/admin/members
/admin/members/:id (회원 상세)
```

---

## 2. 화면 구성

### 2.1 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Header (공통)                                │
├──────────┬──────────────────────────────────────────────────────────┤
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │              대시보드 통계 카드 영역                  │ │
│          │  │  [전체회원] [활성회원] [비활성회원] [신규가입(30일)]  │ │
│  SideNav │  └─────────────────────────────────────────────────────┘ │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │              검색 및 필터 영역                        │ │
│          │  │  [검색바] [고급필터] [필터칩] [초기화]                │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │              액션 툴바                                │ │
│          │  │  [선택됨: N개] [일괄작업▼] [내보내기▼] [+ 회원등록]   │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │              회원 테이블                              │ │
│          │  │  [□] 프로필 | 이름 | 이메일 | 전화번호 | 역할 | ...  │ │
│          │  │  ─────────────────────────────────────────────────── │ │
│          │  │  [□] 🖼️ | 홍길동 | hong@... | 010-... | USER | ...   │ │
│          │  │  [□] 🖼️ | 김철수 | kim@...  | 010-... | ADMIN| ...   │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │              페이지네이션                            │ │
│          │  │  [< 이전] 1 2 3 ... 10 [다음 >] | 페이지당 [20 ▼]    │ │
│          │  └─────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────┘
```

---

## 3. 상세 기능 명세

### 3.1 대시보드 통계 카드

| 카드명 | 데이터 | 아이콘 | 색상 |
|--------|--------|--------|------|
| 전체 회원 | User 총 개수 (removedAt IS NULL) | Users | primary |
| 활성 회원 | 최근 30일 내 로그인 기록 있는 회원 | UserCheck | success |
| 비활성 회원 | 30일 이상 로그인 기록 없는 회원 | UserX | warning |
| 신규 가입 (30일) | 최근 30일 내 createdAt인 회원 | UserPlus | secondary |

**추가 통계 (확장 가능)**
- 역할별 분포 차트 (도넛 차트)
- 월별 가입 추이 (라인 차트)

---

### 3.2 검색 및 필터링

#### 3.2.1 통합 검색
| 필드명 | 설명 |
|--------|------|
| 검색 대상 | 이름, 이메일, 전화번호, 닉네임 |
| 검색 방식 | 부분 일치 (LIKE %keyword%) |
| 디바운스 | 300ms |

#### 3.2.2 고급 필터

| 필터 항목 | 타입 | 옵션 | 기본값 |
|-----------|------|------|--------|
| 역할 | MultiSelect | USER, ADMIN, SUPER_ADMIN | 전체 |
| 상태 | Select | 전체, 활성, 비활성, 삭제됨 | 전체 |
| 가입일 | DateRange | 시작일 ~ 종료일 | - |
| 분류(Category) | TreeSelect | Category 트리 | - |
| 그룹(Group) | MultiSelect | Group 목록 | - |
| Space | Select | Space 목록 (SUPER_ADMIN만) | 현재 Space |

#### 3.2.3 필터 칩
- 적용된 필터를 칩 형태로 표시
- 개별 칩 클릭 시 해당 필터 해제
- "전체 초기화" 버튼으로 모든 필터 해제

---

### 3.3 회원 테이블

#### 3.3.1 테이블 컬럼

| 컬럼명 | 필드 | 정렬 | 너비 | 설명 |
|--------|------|------|------|------|
| 선택 | checkbox | - | 40px | 일괄 선택 |
| 번호 | seq | ✓ | 80px | 자동 증가 번호 |
| 프로필 | Profile.avatarFileId | - | 50px | 아바타 이미지 |
| 이름 | name | ✓ | 120px | 사용자 이름 |
| 이메일 | email | ✓ | 200px | 이메일 주소 |
| 전화번호 | phone | - | 140px | 전화번호 |
| 닉네임 | Profile.nickname | ✓ | 120px | 프로필 닉네임 |
| 역할 | Tenant.Role.name | ✓ | 100px | 역할 배지 |
| 분류 | UserClassification.Category.name | - | 100px | 분류 태그 |
| 상태 | computed | - | 80px | 활성/비활성/삭제 |
| 가입일 | createdAt | ✓ | 120px | YYYY-MM-DD |
| 최근 로그인 | lastLoginAt | ✓ | 120px | YYYY-MM-DD HH:mm |
| 액션 | - | - | 100px | 상세/수정/삭제 |

#### 3.3.2 행 액션

| 액션 | 아이콘 | 권한 | 동작 |
|------|--------|------|------|
| 상세 보기 | Eye | 모든 ADMIN | 회원 상세 페이지 이동 |
| 수정 | Edit | ADMIN 이상 | 회원 수정 모달 |
| 삭제 | Trash | SUPER_ADMIN | 삭제 확인 모달 |

#### 3.3.3 정렬
- 기본 정렬: `createdAt DESC`
- 클릭 시 ASC → DESC → 기본값 순환
- 다중 정렬 지원 (Shift + Click)

---

### 3.4 일괄 작업 (Bulk Actions)

#### 3.4.1 일괄 작업 메뉴

| 작업 | 권한 | 확인 필요 | 설명 |
|------|------|----------|------|
| 역할 변경 | SUPER_ADMIN | ✓ | 선택된 회원들의 역할 일괄 변경 |
| 분류 지정 | ADMIN | ✓ | 선택된 회원들에게 분류 일괄 지정 |
| 그룹 추가 | ADMIN | ✓ | 선택된 회원들을 그룹에 일괄 추가 |
| 비활성화 | ADMIN | ✓ | 선택된 회원들 비활성화 |
| 활성화 | ADMIN | ✓ | 선택된 회원들 활성화 |
| 삭제 | SUPER_ADMIN | ✓✓ | 선택된 회원들 삭제 (2단계 확인) |

#### 3.4.2 내보내기

| 형식 | 설명 |
|------|------|
| Excel (.xlsx) | 현재 필터 적용된 전체 데이터 |
| CSV (.csv) | 현재 필터 적용된 전체 데이터 |
| PDF (.pdf) | 현재 페이지 데이터 (리포트 형식) |

---

### 3.5 회원 등록 모달

#### 3.5.1 입력 필드

| 필드명 | 타입 | 필수 | 유효성 검사 |
|--------|------|------|-------------|
| 이름 | Text | ✓ | 2-50자, 중복 불가 |
| 이메일 | Email | ✓ | 이메일 형식, 중복 불가 |
| 전화번호 | Phone | ✓ | 한국 휴대폰 형식, 중복 불가 |
| 비밀번호 | Password | ✓ | 8자 이상, 영문+숫자+특수문자 |
| 비밀번호 확인 | Password | ✓ | 비밀번호와 일치 |
| 역할 | Select | ✓ | USER, ADMIN |
| 분류 | TreeSelect | - | Category 선택 |
| 그룹 | MultiSelect | - | Group 복수 선택 |

---

### 3.6 회원 상세 페이지 (/admin/members/:id)

#### 3.6.1 레이아웃

```
┌─────────────────────────────────────────────────────────────────┐
│  [← 목록으로]  회원 상세 정보                    [수정] [삭제]  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │                      │  │  기본 정보                        │ │
│  │      프로필 이미지    │  │  이름: 홍길동                     │ │
│  │                      │  │  이메일: hong@example.com         │ │
│  │      홍길동          │  │  전화번호: 010-1234-5678          │ │
│  │      @nickname       │  │  닉네임: gildong                  │ │
│  │                      │  │  가입일: 2025-01-01               │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  역할 및 권한                                                ││
│  │  ┌──────────┐  ┌──────────┐                                  ││
│  │  │ Space A  │  │ Space B  │                                  ││
│  │  │ ADMIN    │  │ USER     │                                  ││
│  │  └──────────┘  └──────────┘                                  ││
│  └──────────────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  분류 및 그룹                                                ││
│  │  분류: [VIP 고객]                                            ││
│  │  그룹: [마케팅팀] [베타테스터]                                ││
│  └──────────────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  활동 이력 [탭: 로그인 | 변경이력]                           ││
│  │  ─────────────────────────────────────────────────────────── ││
│  │  2025-01-03 14:30  로그인                                    ││
│  │  2025-01-02 10:15  정보 수정 (이메일 변경)                   ││
│  │  2025-01-01 09:00  회원 가입                                 ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### 3.6.2 탭 구성

| 탭 | 내용 |
|----|------|
| 기본 정보 | 회원 기본 정보 및 프로필 |
| 역할/권한 | Space별 Tenant 정보 및 역할 |
| 분류/그룹 | Category 및 Group 소속 정보 |
| 활동 이력 | 로그인 기록, 변경 이력 타임라인 |

---

## 4. API 명세

### 4.1 회원 목록 조회

```
GET /api/v1/users

Query Parameters:
- page: number (기본값: 1)
- limit: number (기본값: 20, 최대: 100)
- search: string (통합 검색어)
- roles: string[] (역할 필터)
- status: 'active' | 'inactive' | 'removed' (상태 필터)
- categoryId: string (분류 필터)
- groupIds: string[] (그룹 필터)
- createdFrom: ISO8601 (가입일 시작)
- createdTo: ISO8601 (가입일 종료)
- sortBy: string (정렬 필드)
- sortOrder: 'asc' | 'desc'

Response:
{
  data: User[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  },
  stats: {
    total: number,
    active: number,
    inactive: number,
    newThisMonth: number
  }
}
```

### 4.2 회원 상세 조회

```
GET /api/v1/users/:id

Response:
{
  data: {
    ...User,
    profiles: Profile[],
    tenants: Tenant[] (with Role, Space),
    classification: UserClassification (with Category),
    associations: UserAssociation[] (with Group)
  }
}
```

### 4.3 회원 등록

```
POST /api/v1/users

Body:
{
  name: string,
  email: string,
  phone: string,
  password: string,
  roleId: string,
  categoryId?: string,
  groupIds?: string[]
}
```

### 4.4 회원 수정

```
PATCH /api/v1/users/:id

Body:
{
  name?: string,
  email?: string,
  phone?: string,
  categoryId?: string,
  groupIds?: string[]
}
```

### 4.5 회원 삭제

```
DELETE /api/v1/users/:id

(Soft Delete: removedAt 설정)
```

### 4.6 일괄 작업

```
POST /api/v1/users/bulk

Body:
{
  action: 'changeRole' | 'assignCategory' | 'addGroup' | 'deactivate' | 'activate' | 'delete',
  userIds: string[],
  payload: {
    roleId?: string,
    categoryId?: string,
    groupId?: string
  }
}
```

### 4.7 내보내기

```
GET /api/v1/users/export

Query Parameters:
- format: 'xlsx' | 'csv' | 'pdf'
- (동일한 필터 파라미터)

Response: File download
```

---

## 5. 컴포넌트 구조

### 5.1 페이지 컴포넌트

```
apps/admin/app/(admin)/members/
├── page.tsx                    # 회원 목록 페이지
├── [id]/
│   └── page.tsx               # 회원 상세 페이지
└── _components/
    ├── MemberStatsCards.tsx   # 대시보드 통계 카드
    ├── MemberFilters.tsx      # 검색 및 필터 영역
    ├── MemberTable.tsx        # 회원 테이블
    ├── MemberTableRow.tsx     # 테이블 행
    ├── MemberActionToolbar.tsx # 액션 툴바
    ├── MemberCreateModal.tsx  # 회원 등록 모달
    ├── MemberEditModal.tsx    # 회원 수정 모달
    ├── MemberDeleteConfirm.tsx # 삭제 확인 모달
    ├── MemberBulkActions.tsx  # 일괄 작업 드롭다운
    └── MemberExportMenu.tsx   # 내보내기 메뉴
```

### 5.2 Store 구조

```typescript
// stores/MemberListStore.ts
class MemberListStore {
  // 상태
  members: User[] = [];
  selectedIds: Set<string> = new Set();
  filters: MemberFilters = {};
  pagination: Pagination = { page: 1, limit: 20 };
  sorting: Sorting = { field: 'createdAt', order: 'desc' };
  stats: MemberStats = {};

  // 액션
  fetchMembers(): Promise<void>;
  selectMember(id: string): void;
  selectAll(): void;
  clearSelection(): void;
  setFilter(key: string, value: any): void;
  resetFilters(): void;
  setPage(page: number): void;
  setSorting(field: string, order: 'asc' | 'desc'): void;

  // 일괄 작업
  bulkChangeRole(roleId: string): Promise<void>;
  bulkAssignCategory(categoryId: string): Promise<void>;
  bulkAddGroup(groupId: string): Promise<void>;
  bulkDeactivate(): Promise<void>;
  bulkActivate(): Promise<void>;
  bulkDelete(): Promise<void>;

  // 내보내기
  exportToExcel(): Promise<void>;
  exportToCsv(): Promise<void>;
  exportToPdf(): Promise<void>;
}
```

---

## 6. 권한 매트릭스

| 기능 | USER | ADMIN | SUPER_ADMIN |
|------|------|-------|-------------|
| 회원 목록 조회 | ❌ | ✅ (Space 내) | ✅ (전체) |
| 회원 상세 조회 | ❌ | ✅ | ✅ |
| 회원 등록 | ❌ | ✅ (USER만) | ✅ |
| 회원 수정 | ❌ | ✅ (USER만) | ✅ |
| 회원 삭제 | ❌ | ❌ | ✅ |
| 역할 변경 | ❌ | ❌ | ✅ |
| 일괄 작업 | ❌ | ✅ (제한적) | ✅ |
| 내보내기 | ❌ | ✅ | ✅ |

---

## 7. UI/UX 가이드라인

### 7.1 반응형 대응

| 화면 크기 | 대응 |
|----------|------|
| Desktop (≥1280px) | 전체 테이블 표시 |
| Tablet (768-1279px) | 일부 컬럼 숨김 (전화번호, 닉네임) |
| Mobile (<768px) | 카드 뷰로 전환 |

### 7.2 로딩 상태

- 테이블: Skeleton 로딩
- 통계 카드: Skeleton 로딩
- 모달: 버튼 로딩 스피너

### 7.3 에러 처리

| 에러 상황 | 대응 |
|----------|------|
| 네트워크 오류 | Toast 알림 + 재시도 버튼 |
| 권한 없음 | 403 페이지 리다이렉트 |
| 데이터 없음 | Empty State 컴포넌트 |
| 유효성 검사 실패 | 필드별 인라인 에러 메시지 |

### 7.4 성능 최적화

- 테이블 가상화 (대량 데이터 시)
- 검색 디바운싱 (300ms)
- 페이지네이션 서버 사이드
- 이미지 lazy loading

---

## 8. 테스트 케이스

### 8.1 단위 테스트

- [ ] MemberListStore 필터 적용 테스트
- [ ] MemberListStore 페이지네이션 테스트
- [ ] MemberListStore 일괄 선택 테스트
- [ ] 유효성 검사 로직 테스트

### 8.2 통합 테스트

- [ ] 회원 목록 조회 API 연동
- [ ] 회원 등록 플로우
- [ ] 회원 수정 플로우
- [ ] 일괄 작업 플로우

### 8.3 E2E 테스트

- [ ] 전체 CRUD 플로우
- [ ] 필터링 및 검색 시나리오
- [ ] 권한별 접근 제어 시나리오

---

## 9. 마일스톤

| 단계 | 작업 내용 | 우선순위 |
|------|----------|----------|
| Phase 1 | 기본 목록/상세/CRUD | P0 |
| Phase 2 | 검색 및 필터링 | P0 |
| Phase 3 | 페이지네이션 및 정렬 | P0 |
| Phase 4 | 일괄 작업 | P1 |
| Phase 5 | 내보내기 기능 | P1 |
| Phase 6 | 대시보드 통계 | P2 |
| Phase 7 | 활동 이력 | P2 |

---

## 10. 참고 자료

### 10.1 관련 스키마
- `packages/prisma/schema/user.prisma`
- `packages/prisma/schema/role.prisma`
- `packages/prisma/schema/space.prisma`
- `packages/prisma/schema/core.prisma`

### 10.2 관련 기획서
- `2026-01-01-AdminAuthenticationSystem.md`
- `2025-12-30-AdminLayoutAndMenuSystem.md`
