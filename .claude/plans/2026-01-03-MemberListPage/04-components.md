# 컴포넌트 구조

> 상위 문서: [README.md](./README.md)

---

## 1. 페이지 컴포넌트

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

---

## 2. Store 구조

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
