---
name: 데이터그리드-페이지-빌더
description: DataGrid/Table 기반 어드민 CRUD 페이지를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# DataGrid 페이지 빌더

**역할**: DataGrid 또는 HeroUI Table 기반의 어드민 CRUD 페이지 생성

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 |
|------|----------|
| 목록 + CRUD 기능이 필요한 어드민 페이지 | ✅ 사용 |
| 테이블에 정렬/필터/페이지네이션이 필요 | ✅ 사용 |
| 데이터 목록 조회 + 삭제 확인 모달 | ✅ 사용 |
| 단순 폼 페이지 (로그인, 설정 등) | ❌ fe-page-builder 사용 |
| 대시보드/차트 페이지 | ❌ fe-page-builder 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| 엔티티명 | ✅ | `User`, `Role`, `Product` 등 |
| API Hook 이름 | ✅ | `useGetUsers`, `useGetRoles` 등 (Orval 생성) |
| 컬럼 정의 | ✅ | 표시할 컬럼 목록과 타입 |
| 기능 범위 | ✅ | 조회만 / CRUD / 선택+대량작업 |

### 출력

| 산출물 | 경로 | 설명 |
|--------|------|------|
| 페이지 컴포넌트 | `apps/admin/app/(admin)/[route]/page.tsx` | Next.js 라우트 페이지 |
| 훅 (선택) | `apps/admin/app/(admin)/[route]/hooks/use[Name]Page.ts` | 복잡한 로직 분리 시 |

---

## 3. 핵심 규칙

### ✅ Do

- MobX `useLocalObservable`로 상태 관리
- React Query hook (Orval 생성) 사용
- `observer`로 컴포넌트 감싸기
- URL 쿼리 기반 페이지네이션
- HeroUI 컴포넌트 사용 (Table, Button, Chip, Modal)
- 삭제 시 ConfirmModal 사용
- **재사용 가능한 Cell 컴포넌트 사용** (`@cocrepo/ui`의 cells)

### ❌ Don't

- useState 사용
- 직접 axios/fetch 호출
- useCallback/useMemo 사용
- 인라인 함수 선언
- packages/ui에 페이지 생성 (apps에만 생성)
- **페이지 내 셀 렌더러/포맷터 함수 인라인 선언** (Cell 컴포넌트로 분리)

---

## 3.1 Cell 컴포넌트 재사용 규칙 (Critical)

**테이블 셀 렌더링 로직은 반드시 재사용 가능한 Cell 컴포넌트로 분리합니다.**

### Cell 컴포넌트 위치

```
packages/ui/src/components/ui/data-display/cells/
├── index.ts
├── BooleanCell/       # true/false → O/X 표시
├── DateCell/          # 날짜 포맷팅
├── DateTimeCell/      # 날짜+시간 포맷팅
├── DefaultCell/       # 기본 텍스트 (null → "-")
├── ExpandableCell/    # 펼치기/접기
├── LinkCell/          # 링크 셀
├── NumberCell/        # 숫자 포맷팅
├── StatusChipCell/    # 상태 Chip (신규 필요 시 생성)
├── RoleChipCell/      # 역할 Chip (신규 필요 시 생성)
└── RowActionsCell/ # 액션 버튼 그룹 (신규 필요 시 생성)
```

### ❌ 잘못된 예시 (인라인 선언)

```tsx
// ❌ 페이지 내에서 포맷터/렌더러 직접 선언
const formatDate = (date: Date | string | null): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR");
};

const getStatusChip = (status: string) => {
  const config = { active: { label: "활성", color: "success" } };
  return <Chip {...config[status]} />;
};

// 컬럼에서 인라인 사용
columnHelper.accessor("createdAt", {
  cell: ({ getValue }) => formatDate(getValue()),  // ❌
});
```

### ✅ 올바른 예시 (Cell 컴포넌트 사용)

```tsx
// ✅ @cocrepo/ui의 Cell 컴포넌트 import
import { DateCell, StatusChipCell } from "@cocrepo/ui";

// 컬럼에서 Cell 컴포넌트 사용
columnHelper.accessor("createdAt", {
  cell: ({ getValue }) => <DateCell value={getValue()} />,  // ✅
});

columnHelper.display({
  id: "status",
  cell: ({ row }) => <StatusChipCell status={row.original.status} />,  // ✅
});
```

### 새 Cell 컴포넌트가 필요한 경우

1. **먼저 기존 Cell 확인**: `packages/ui/src/components/ui/data-display/cells/`
2. **없으면 생성**: `ui-component-builder` 에이전트 사용
3. **생성 위치**: `packages/ui/src/components/ui/data-display/cells/[CellName]/`
4. **index.ts에 export 추가**

### Cell 컴포넌트 작성 규칙

```tsx
// packages/ui/src/components/ui/data-display/cells/StatusChipCell/StatusChipCell.tsx
import { Chip } from "@heroui/react";

interface StatusChipCellProps {
  status: string;
  removedAt?: Date | string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: "success" | "warning" | "danger" | "default" }> = {
  active: { label: "활성", color: "success" },
  inactive: { label: "비활성", color: "default" },
  pending: { label: "대기", color: "warning" },
  removed: { label: "탈퇴대기", color: "danger" },
};

export const StatusChipCell = ({ status, removedAt }: StatusChipCellProps) => {
  const effectiveStatus = removedAt ? "removed" : status;
  const config = STATUS_CONFIG[effectiveStatus] ?? { label: effectiveStatus, color: "default" };

  return (
    <div className="flex justify-center">
      <Chip size="sm" color={config.color} variant="flat">
        {config.label}
      </Chip>
    </div>
  );
};
```

---

## 4. 페이지 유형 선택

### 4.1 Simple Table (HeroUI Table 직접 사용)

**적합한 경우:**
- 데이터 50개 미만
- 페이지네이션 불필요
- 선택/정렬 기능 불필요
- 단순 CRUD

**예시:** 역할 목록 (`/roles`)

### 4.2 DataGrid (고급 테이블)

**적합한 경우:**
- 대량 데이터 (페이지네이션 필요)
- 행 선택 기능
- 복합 정렬
- 대량 작업 (선택 후 일괄 삭제 등)

**예시:** 회원 목록 (`/users`)

---

## 5. 템플릿

### 5.1 Simple Table 페이지 (권장 기본)

```tsx
// apps/admin/app/(admin)/[entities]/page.tsx
"use client";

import { useDelete[Entity], useGet[Entities] } from "@cocrepo/api";
import { ConfirmModal } from "@cocrepo/ui/widgets";
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Plus, [Icon] } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface [Entity]Item {
  id: string;
  // ... 필드 정의
}

function [Entities]Page() {
  const router = useRouter();

  // 데이터 조회
  const { data: response, isLoading, refetch } = useGet[Entities]();
  const items = (response?.data ?? []) as [Entity]Item[];

  // 삭제 mutation
  const deleteMutation = useDelete[Entity]();

  // 로컬 상태 (모달)
  const state = useLocalObservable(() => ({
    deleteModal: {
      isOpen: false,
      target: null as [Entity]Item | null,
    },
  }));

  // 삭제 모달 열기
  const handleOpenDeleteModal = (item: [Entity]Item) => {
    state.deleteModal.target = item;
    state.deleteModal.isOpen = true;
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    state.deleteModal.isOpen = false;
    state.deleteModal.target = null;
  };

  // 삭제 실행
  const handleDelete = async () => {
    const item = state.deleteModal.target;
    if (!item) return;

    try {
      await deleteMutation.mutateAsync({ id: item.id });
      handleCloseDeleteModal();
      refetch();
      router.refresh();
    } catch (err) {
      console.error("[Entity] 삭제 실패:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">[Entity] 목록</h1>
          <p className="text-default-500">[설명 텍스트]</p>
        </div>
        <Button
          as={Link}
          href="/[entities]/new"
          color="primary"
          startContent={<Plus className="h-4 w-4" />}
        >
          [Entity] 추가
        </Button>
      </div>

      {/* 테이블 */}
      <Table
        aria-label="[Entity] 목록"
        classNames={{
          wrapper: "bg-content1 shadow-sm",
        }}
      >
        <TableHeader>
          <TableColumn>[컬럼1]</TableColumn>
          <TableColumn>[컬럼2]</TableColumn>
          <TableColumn align="center">상태</TableColumn>
          <TableColumn align="center">작업</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          isLoading={isLoading}
          emptyContent="등록된 [Entity]이(가) 없습니다."
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <[Icon] className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-default-400">{item.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-default-600">
                  {item.description || "-"}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Chip size="sm" color="success" variant="flat">
                    활성
                  </Chip>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    as={Link}
                    href={`/[entities]/${item.id}/edit`}
                    size="sm"
                    variant="flat"
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => handleOpenDeleteModal(item)}
                  >
                    삭제
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={state.deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="[Entity] 삭제"
        message={
          state.deleteModal.target ? (
            <>
              <strong>{state.deleteModal.target.name}</strong>을(를)
              삭제하시겠습니까?
              <br />
              <span className="text-default-500">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </>
          ) : null
        }
        confirmText="삭제"
        confirmColor="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default observer([Entities]Page);
```

### 5.2 DataGrid 페이지 (페이지네이션 필요 시)

```tsx
// apps/admin/app/(admin)/[entities]/page.tsx
"use client";

import { useDelete[Entity], useGet[Entities] } from "@cocrepo/api";
import { ConfirmModal } from "@cocrepo/ui/widgets";
import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface [Entity]Item {
  id: string;
  // ... 필드 정의
}

function [Entities]Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? 1);

  // 로컬 상태
  const state = useLocalObservable(() => ({
    page: initialPage,
    limit: 20,
    deleteModal: {
      isOpen: false,
      target: null as [Entity]Item | null,
    },
  }));

  // 데이터 조회
  const { data: response, isLoading, refetch } = useGet[Entities]({
    page: state.page,
    limit: state.limit,
  });
  const items = (response?.data ?? []) as [Entity]Item[];
  const meta = response?.meta;
  const totalPages = meta?.totalPages ?? 1;

  // 삭제 mutation
  const deleteMutation = useDelete[Entity]();

  // 페이지 변경
  const handlePageChange = (page: number) => {
    state.page = page;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`);
  };

  // 삭제 모달 열기
  const handleOpenDeleteModal = (item: [Entity]Item) => {
    state.deleteModal.target = item;
    state.deleteModal.isOpen = true;
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    state.deleteModal.isOpen = false;
    state.deleteModal.target = null;
  };

  // 삭제 실행
  const handleDelete = async () => {
    const item = state.deleteModal.target;
    if (!item) return;

    try {
      await deleteMutation.mutateAsync({ id: item.id });
      handleCloseDeleteModal();
      refetch();
    } catch (err) {
      console.error("[Entity] 삭제 실패:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">[Entity] 목록</h1>
          <p className="text-default-500">[설명 텍스트]</p>
        </div>
        <Button
          as={Link}
          href="/[entities]/new"
          color="primary"
          startContent={<Plus className="h-4 w-4" />}
        >
          [Entity] 추가
        </Button>
      </div>

      {/* 테이블 */}
      <Table
        aria-label="[Entity] 목록"
        classNames={{
          wrapper: "bg-content1 shadow-sm",
        }}
      >
        <TableHeader>
          <TableColumn>[컬럼1]</TableColumn>
          <TableColumn>[컬럼2]</TableColumn>
          <TableColumn align="center">상태</TableColumn>
          <TableColumn align="center">작업</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          isLoading={isLoading}
          emptyContent="등록된 [Entity]이(가) 없습니다."
        >
          {(item) => (
            <TableRow key={item.id}>
              {/* ... 셀 내용 (Simple Table과 동일) */}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={state.page}
            onChange={handlePageChange}
            showControls
          />
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={state.deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="[Entity] 삭제"
        message={/* ... */}
        confirmText="삭제"
        confirmColor="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default observer([Entities]Page);
```

---

## 6. 컬럼 패턴 (Cell 컴포넌트 기반)

**모든 셀 렌더링은 재사용 가능한 Cell 컴포넌트를 사용합니다.**

### 6.1 기본 Cell 컴포넌트 사용

```tsx
import { DateCell, DefaultCell, NumberCell, BooleanCell } from "@cocrepo/ui";

// 날짜
columnHelper.accessor("createdAt", {
  header: "생성일",
  cell: ({ getValue }) => <DateCell value={getValue()} />,
});

// 기본 텍스트
columnHelper.accessor("description", {
  header: "설명",
  cell: ({ getValue }) => <DefaultCell value={getValue()} />,
});

// 숫자
columnHelper.accessor("count", {
  header: "수량",
  cell: ({ getValue }) => <NumberCell value={getValue()} />,
});

// Boolean
columnHelper.accessor("isActive", {
  header: "활성",
  cell: ({ getValue }) => <BooleanCell value={getValue()} />,
});
```

### 6.2 아이콘 + 이름 + 부제목 (ProfileAvatarCell)

```tsx
// 재사용 가능한 Cell 컴포넌트로 분리 권장
import { ProfileAvatarCell } from "@cocrepo/ui";

columnHelper.accessor("name", {
  header: "회원정보",
  cell: ({ row }) => (
    <ProfileAvatarCell
      name={row.original.name}
      subtitle={row.original.email}
      icon={<User className="h-4 w-4" />}
    />
  ),
});
```

### 6.3 상태 Chip (StatusChipCell)

```tsx
// ✅ Cell 컴포넌트 사용 (권장)
import { StatusChipCell } from "@cocrepo/ui";

columnHelper.display({
  id: "status",
  header: "상태",
  cell: ({ row }) => (
    <StatusChipCell
      status={row.original.status}
      removedAt={row.original.removedAt}
    />
  ),
});
```

### 6.4 역할 Chip (RoleChipCell)

```tsx
import { RoleChipCell } from "@cocrepo/ui";

columnHelper.display({
  id: "role",
  header: "역할",
  cell: ({ row }) => (
    <RoleChipCell role={row.original.tenants?.[0]?.role} />
  ),
});
```

### 6.5 액션 버튼 (RowActionsCell)

```tsx
import { RowActionsCell } from "@cocrepo/ui";

columnHelper.display({
  id: "actions",
  header: "작업",
  cell: ({ row }) => (
    <RowActionsCell
      item={row.original}
      basePath="/users"
      onDelete={handleOpenDeleteModal}
      disableEdit={row.original.isSystem}
      disableDelete={row.original.isSystem}
    />
  ),
});
```

### 6.6 새 Cell 컴포넌트가 없는 경우

기존 Cell 컴포넌트가 없으면 **먼저 생성 후 사용**합니다:

```bash
# ui-component-builder 에이전트로 Cell 생성
# 위치: packages/ui/src/components/ui/data-display/cells/
```

---

## 7. 체크리스트

### 생성 전

- [ ] API Hook이 존재하는지 확인 (`useGet[Entities]`, `useDelete[Entity]`)
- [ ] 엔티티 타입 정의 확인 (API 응답 타입)
- [ ] 필요한 컬럼 목록 정의
- [ ] 페이지네이션 필요 여부 결정
- [ ] **필요한 Cell 컴포넌트 확인** (`packages/ui/src/components/ui/data-display/cells/`)

### 생성 후

- [ ] `"use client"` 선언 확인
- [ ] `observer` 래핑 확인
- [ ] MobX `useLocalObservable` 사용 확인
- [ ] React Query hook 사용 확인
- [ ] 삭제 시 ConfirmModal 사용 확인
- [ ] 빈 상태 메시지 설정 확인
- [ ] 로딩 상태 처리 확인
- [ ] **셀 렌더링에 Cell 컴포넌트 사용 확인** (인라인 포맷터 금지)
- [ ] **페이지 내 getStatus/formatDate 등 인라인 함수 없음 확인**

---

## 8. 연관 에이전트

| 관계 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | be-controller-builder | 목록/삭제 API 생성 |
| **선행** | be-dto-builder | 응답 DTO 생성 |
| **선행/병행** | ui-component-builder | 새 Cell 컴포넌트 생성 (필요 시) |
| **후행** | fe-page-builder | 상세/수정 폼 페이지 생성 |

---

## 9. 참고 파일

| 유형 | 파일 경로 |
|------|----------|
| Simple Table 예시 | `apps/admin/app/(admin)/roles/page.tsx` |
| Pagination 예시 | `apps/admin/app/(admin)/users/page.tsx` |
| ConfirmModal | `packages/ui/src/components/widgets/common/ConfirmModal` |
| DataGrid | `packages/ui/src/components/ui/data-display/DataGrid` |
| **Cell 컴포넌트 폴더** | `packages/ui/src/components/ui/data-display/cells/` |
| DateCell | `packages/ui/src/components/ui/data-display/cells/DateCell` |
| DefaultCell | `packages/ui/src/components/ui/data-display/cells/DefaultCell` |
| BooleanCell | `packages/ui/src/components/ui/data-display/cells/BooleanCell` |

---

## 요약

어드민 CRUD 목록 페이지를 생성합니다. 기본적으로 HeroUI Table을 직접 사용하고, 페이지네이션이 필요한 경우 URL 쿼리 기반으로 구현합니다. MobX `useLocalObservable`로 모달 상태를 관리하고, React Query hook으로 데이터를 조회합니다. 삭제 시 반드시 ConfirmModal로 확인을 받습니다.
