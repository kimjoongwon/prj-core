---
description: Pure UI 페이지 컴포넌트를 생성하는 전문가
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---



# 페이지 빌더

**페이지 컴포넌트**를 생성합니다. 일반 페이지는 `packages/ui`에 Pure UI로, 목록 페이지는 `apps/*`에 직접 생성합니다.

---

## 1. 페이지 유형 선택

| 유형 | 설명 | 생성 위치 | 예시 |
|------|------|-----------|------|
| **일반 페이지** | 폼, 대시보드, 상세 보기 등 | `packages/ui` + `apps/*` | Login, Dashboard, UserDetail |
| **목록 페이지** | DataGrid/Table 기반 CRUD | `apps/*`만 | UserList, RoleList |

### 유형 판단 기준

| 상황 | 유형 |
|------|------|
| 여러 앱에서 재사용할 페이지 UI | 일반 페이지 |
| 로그인, 회원가입 등 폼 페이지 | 일반 페이지 |
| 대시보드, 차트 페이지 | 일반 페이지 |
| 상세/수정 폼 페이지 | 일반 페이지 |
| 테이블 + CRUD 기능 | 목록 페이지 |
| 페이지네이션/정렬/필터 필요 | 목록 페이지 |

---

## 2. 공통 규칙

### ✅ Do (필수)

| 규칙 | 설명 |
|------|------|
| **Prefetch 필수** | 모든 페이지는 서버 사이드 Prefetch 패턴 사용 (섹션 5 참고) |
| **observer 필수** | MobX 상태 구독을 위해 감싸기 |
| **MobX 상태 관리** | `useLocalObservable`로 로컬 상태 관리 |
| **Orval API 사용** | React Query hook (Orval 생성) 사용 |
| **URL 기반 상태** | 페이지 상태는 queryParams/pathParams로 관리 |
| **PageSurface 필수** | 페이지 콘텐츠는 PageSurface로 감싸기 |

### ❌ Don't (금지)

| 금지 사항 | 이유 |
|----------|------|
| **apps/*/src에 feature 폴더 생성** | **Feature는 packages/ui에서만 존재** |
| useState 사용 | MobX useLocalObservable 사용 |
| useCallback/useMemo | React 19 + MobX 자동 최적화 |
| 직접 axios/fetch 호출 | @cocrepo/api 사용 |
| 인라인 함수 선언 | 함수는 컴포넌트 외부 또는 훅에서 정의 |
| 커스텀 className (Page/Feature) | VStack/HStack 등 UI 컴포넌트 사용 |

> ⚠️ **Feature 위치 규칙**: Page에서 Feature를 사용할 때, Feature는 반드시 `packages/fe-ui/src/components/feature/`에서 import합니다. `apps/*/src/components/features/` 같은 앱 내부에 Feature를 만들지 않습니다.

### 핸들러 네이밍 규칙

| 위치 | 패턴 | 예시 |
|------|------|------|
| Page 컴포넌트 | `on[Event][UI]` | `onClickLoginButton`, `onChangeEmail` |
| 일반 컴포넌트 | `handle[Action]` | `handleSubmit`, `handleDelete` |

---

## 3. 폴더 구조 (Prefetch 필수)

```
apps/admin/app/[route]/
├── page.tsx          # 서버 컴포넌트 (Prefetch + HydrationBoundary)
├── _client.tsx       # 클라이언트 컴포넌트
├── _prefetch.ts      # Prefetch 설정
└── hooks/            # 통합 훅 (필요 시)
    └── use[Route][Name]Page.ts
```

### 일반 페이지 추가 구조

```
packages/fe-ui/src/components/page/
├── Login/
│   ├── LoginPage.tsx      # Pure UI
│   └── index.ts           # export (hooks 없음!)
└── index.ts               # barrel export
```

---

## 4. 일반 페이지

### 4.1 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      packages/ui                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  components/page/Login/                              │    │
│  │  ├── LoginPage.tsx    ← Pure UI (상태/핸들러 props) │    │
│  │  └── index.ts         ← export                      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ import
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      apps/admin                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  app/auth/login/                                     │    │
│  │  ├── page.tsx         ← 서버 컴포넌트 (Prefetch)    │    │
│  │  ├── _client.tsx      ← Page + Hook 연결            │    │
│  │  ├── _prefetch.ts     ← Prefetch 설정               │    │
│  │  └── hooks/                                          │    │
│  │      └── useAuthLoginPage.ts  ← 비즈니스 로직       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Pure UI Page 컴포넌트

```tsx
// packages/fe-ui/src/components/page/Login/LoginPage.tsx
"use client";

import { observer } from "mobx-react-lite";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { Input } from "../../ui/inputs/Input/Input";
import { Button } from "../../ui/inputs/Button/Button";
import { Text } from "../../ui/data-display/Text/Text";

export interface State {
  email: string;
  password: string;
  errorMessage: string;
}

export interface LoginPageProps {
  state: State;
  onClickLoginButton: () => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  isLoading?: boolean;
}

export const LoginPage = observer(
  ({ state, onClickLoginButton, onChangeEmail, onChangePassword, isLoading }: LoginPageProps) => {
    return (
      <VStack gap={4}>
        <Input value={state.email} onChange={onChangeEmail} placeholder="이메일" />
        <Input value={state.password} onChange={onChangePassword} type="password" />
        <Button onPress={onClickLoginButton} isLoading={isLoading}>
          로그인
        </Button>
        {state.errorMessage && <Text color="error">{state.errorMessage}</Text>}
      </VStack>
    );
  },
);
```

### 4.3 통합 훅

```tsx
// apps/admin/app/auth/login/hooks/useAuthLoginPage.ts
import { useLogin } from "@cocrepo/api";
import { useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";

export const useAuthLoginPage = () => {
  const router = useRouter();
  const loginMutation = useLogin();

  const state = useLocalObservable(() => ({
    email: "",
    password: "",
    errorMessage: "",
  }));

  const onChangeEmail = (value: string) => {
    state.email = value;
  };

  const onChangePassword = (value: string) => {
    state.password = value;
  };

  const onClickLoginButton = async () => {
    try {
      await loginMutation.mutateAsync({
        data: { email: state.email, password: state.password },
      });
      router.push("/dashboard");
    } catch (error) {
      state.errorMessage = "로그인에 실패했습니다";
    }
  };

  return {
    state,
    onClickLoginButton,
    onChangeEmail,
    onChangePassword,
    isLoading: loginMutation.isPending,
  };
};
```

### 4.4 일반 페이지 체크리스트

**Pure UI Page (packages/ui)**
- [ ] `packages/fe-ui/src/components/page/[Name]/` 에 생성
- [ ] observer로 감싸기
- [ ] State, Props 인터페이스 정의
- [ ] 모든 상태/핸들러는 props로 받음
- [ ] 커스텀 className 사용하지 않음
- [ ] hooks 폴더 없음

**통합 훅 (apps/\*)**
- [ ] `apps/*/app/[route]/hooks/` 에 생성
- [ ] `use[Route][Name]Page` 네이밍
- [ ] useLocalObservable로 상태 관리
- [ ] 핸들러 네이밍 `on[Event][UI]`

---

## 5. 서버 사이드 Prefetch (필수)

**모든 페이지는 반드시 서버 사이드 Prefetch 패턴을 사용해야 합니다.**

### 5.1 페이지 유형별 Prefetch 데이터

| 페이지 유형 | Prefetch 데이터 | 예시 |
|------------|----------------|------|
| 데이터 목록 | 목록 데이터, 필터 옵션 | Dashboard, UserList |
| 상세 보기 | 상세 데이터 | UserDetail, PostDetail |
| 폼 입력 | 선택 옵션 데이터 (역할 목록 등) | UserCreate, UserEdit |
| 순수 입력 폼 | 빈 쿼리라도 구조 유지 | Login, Register |

### 5.2 서버 컴포넌트 (page.tsx)

```tsx
// page.tsx - 서버 컴포넌트
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import UsersPageClient from "./_client";
import { prefetchUsersData } from "./_prefetch";

export default async function UsersPage() {
  const queryClient = new QueryClient();
  const cookieStore = await cookies();

  await prefetchUsersData(queryClient, cookieStore, { page: 1, limit: 20 });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersPageClient initialPage={1} />
    </HydrationBoundary>
  );
}
```

### 5.3 Prefetch 설정 (_prefetch.ts)

```tsx
// _prefetch.ts
import { prefetchGetUsersQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function prefetchUsersData(
  queryClient: QueryClient,
  cookies: ReadonlyRequestCookies,
  params: { page: number; limit: number },
) {
  const { page, limit } = params;

  // Orval 생성 prefetch 함수 사용
  await prefetchGetUsersQuery(queryClient, { page, limit }, {
    request: withServerCookies(cookies),
  });
}
```

### 5.4 클라이언트 컴포넌트 (_client.tsx)

```tsx
// _client.tsx
"use client";

import { useGetUsers } from "@cocrepo/api";
import { observer, useLocalObservable } from "mobx-react-lite";

function UsersPageClient({ initialPage }: { initialPage: number }) {
  const state = useLocalObservable(() => ({
    page: initialPage,
    limit: 20,
  }));

  // prefetch로 초기 데이터 보장 - isLoading 불필요
  const { data: usersResponse } = useGetUsers({
    page: state.page,
    limit: state.limit,
  });

  const users = usersResponse?.data ?? [];

  return (/* ... */);
}

export default observer(UsersPageClient);
```

### 5.5 Prefetch 체크리스트

- [ ] page.tsx가 서버 컴포넌트 ("use client" 없음)
- [ ] HydrationBoundary로 클라이언트 컴포넌트 래핑
- [ ] withServerCookies로 인증 쿠키 전달
- [ ] Orval 생성 prefetch 함수 사용 (prefetchGetXXXQuery)
- [ ] 클라이언트에서 isLoading 제거 (prefetch로 데이터 보장)

---

## 6. 목록 페이지 (DataGrid/Table)

### 6.1 언제 사용하나요?

| 상황 | 테이블 유형 |
|------|------------|
| 데이터 50개 미만, 단순 CRUD | Simple Table (HeroUI Table) |
| 대량 데이터, 페이지네이션 필요 | DataGrid 페이지 |
| 행 선택, 대량 작업 필요 | DataGrid 페이지 |

### 6.2 Cell 컴포넌트 재사용 규칙 (Critical)

**테이블 셀 렌더링 로직은 반드시 재사용 가능한 Cell 컴포넌트로 분리합니다.**

```
packages/fe-ui/src/components/ui/data-display/cells/
├── index.ts
├── BooleanCell/       # true/false → O/X 표시
├── DateCell/          # 날짜 포맷팅
├── DateTimeCell/      # 날짜+시간 포맷팅
├── DefaultCell/       # 기본 텍스트 (null → "-")
├── NumberCell/        # 숫자 포맷팅
├── StatusChipCell/    # 상태 Chip
├── RoleChipCell/      # 역할 Chip
└── RowActionsCell/    # 액션 버튼 그룹
```

### ❌ 잘못된 예시 (인라인 선언)

```tsx
// ❌ 페이지 내에서 포맷터/렌더러 직접 선언
const formatDate = (date: Date | string | null): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR");
};

columnHelper.accessor("createdAt", {
  cell: ({ getValue }) => formatDate(getValue()),  // ❌
});
```

### ✅ 올바른 예시 (Cell 컴포넌트 사용)

```tsx
// ✅ @cocrepo/ui의 Cell 컴포넌트 import
import { DateCell, StatusChipCell } from "@cocrepo/ui";

columnHelper.accessor("createdAt", {
  cell: ({ getValue }) => <DateCell value={getValue()} />,  // ✅
});

columnHelper.display({
  id: "status",
  cell: ({ row }) => <StatusChipCell status={row.original.status} />,  // ✅
});
```

### 6.3 목록 페이지 템플릿

```tsx
// apps/admin/app/(admin)/[entities]/_client.tsx
"use client";

import { useDeleteEntity, useGetEntities } from "@cocrepo/api";
import { DateCell, StatusChipCell, RowActionsCell } from "@cocrepo/ui";
import { ConfirmModal, PageSurface, SectionSurface } from "@cocrepo/ui/widgets";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface EntityItem {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface Props {
  initialPage: number;
}

function EntitiesPageClient({ initialPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state = useLocalObservable(() => ({
    page: initialPage,
    limit: 20,
    deleteModal: {
      isOpen: false,
      target: null as EntityItem | null,
    },
  }));

  // 데이터 조회 (prefetch로 초기 데이터 보장)
  const { data: response, refetch } = useGetEntities({
    page: state.page,
    limit: state.limit,
  });
  const items = (response?.data ?? []) as EntityItem[];
  const meta = response?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const deleteMutation = useDeleteEntity();

  const handlePageChange = (page: number) => {
    state.page = page;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`);
  };

  const handleOpenDeleteModal = (item: EntityItem) => {
    state.deleteModal.target = item;
    state.deleteModal.isOpen = true;
  };

  const handleCloseDeleteModal = () => {
    state.deleteModal.isOpen = false;
    state.deleteModal.target = null;
  };

  const handleDelete = async () => {
    const item = state.deleteModal.target;
    if (!item) return;

    try {
      await deleteMutation.mutateAsync({ id: item.id });
      handleCloseDeleteModal();
      refetch();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <PageSurface
      title="Entity 목록"
      description="시스템에 등록된 Entity를 관리합니다."
      actions={
        <Button
          as={Link}
          href="/entities/new"
          color="primary"
          startContent={<Plus className="h-4 w-4" />}
        >
          Entity 추가
        </Button>
      }
    >
      <SectionSurface padding="none">
        <Table aria-label="Entity 목록">
          <TableHeader>
            <TableColumn>이름</TableColumn>
            <TableColumn align="center">상태</TableColumn>
            <TableColumn align="center">생성일</TableColumn>
            <TableColumn align="center">작업</TableColumn>
          </TableHeader>
          <TableBody items={items} emptyContent="등록된 Entity가 없습니다.">
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <StatusChipCell status={item.status} />
                </TableCell>
                <TableCell>
                  <DateCell value={item.createdAt} />
                </TableCell>
                <TableCell>
                  <RowActionsCell
                    item={item}
                    basePath="/entities"
                    onDelete={handleOpenDeleteModal}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionSurface>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            page={state.page}
            onChange={handlePageChange}
            showControls
          />
        </div>
      )}

      <ConfirmModal
        isOpen={state.deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Entity 삭제"
        message={
          state.deleteModal.target ? (
            <>
              <strong>{state.deleteModal.target.name}</strong>을(를) 삭제하시겠습니까?
            </>
          ) : null
        }
        confirmText="삭제"
        confirmColor="danger"
        loading={deleteMutation.isPending}
      />
    </PageSurface>
  );
}

export default observer(EntitiesPageClient);
```

### 6.4 컬럼 패턴

```tsx
import { DateCell, DefaultCell, NumberCell, BooleanCell, StatusChipCell, RoleChipCell, RowActionsCell } from "@cocrepo/ui";

// 날짜
<DateCell value={item.createdAt} />

// 기본 텍스트 (null → "-")
<DefaultCell value={item.description} />

// 숫자
<NumberCell value={item.count} />

// Boolean (O/X)
<BooleanCell value={item.isActive} />

// 상태 Chip
<StatusChipCell status={item.status} />

// 역할 Chip
<RoleChipCell role={item.role} />

// 액션 버튼
<RowActionsCell item={item} basePath="/users" onDelete={handleOpenDeleteModal} />
```

### 6.5 목록 페이지 체크리스트

- [ ] **Prefetch 구조** (page.tsx + _client.tsx + _prefetch.ts)
- [ ] page.tsx에 `"use client"` 없음 (서버 컴포넌트)
- [ ] _client.tsx에 `"use client"` 선언
- [ ] `observer` 래핑
- [ ] `useLocalObservable` 사용
- [ ] PageSurface + SectionSurface 사용
- [ ] **Cell 컴포넌트 사용** (인라인 포맷터 금지)
- [ ] 삭제 시 ConfirmModal 사용
- [ ] 빈 상태 메시지 설정

---

## 7. Surface 시스템

**페이지 콘텐츠는 반드시 Surface 컴포넌트로 감싸야 합니다.**

### 엘리베이션 레벨

| 레벨 | 이름 | 용도 |
|------|------|------|
| 0 | `flat` | 페이지 배경 |
| 1 | `raised` | PageSurface 기본값 |
| 2 | `elevated` | SectionSurface, 카드, DataGrid |
| 3 | `floating` | 드롭다운, 팝오버 |
| 4 | `overlay` | 모달, 다이얼로그 |

### 사용 패턴

```tsx
import { PageSurface, SectionSurface } from "@cocrepo/ui";

return (
  <PageSurface
    title="회원 목록"
    description="시스템에 등록된 회원을 관리합니다."
    actions={<Button>회원 등록</Button>}
  >
    <SectionSurface padding="none">
      <DataGrid ... />
    </SectionSurface>
  </PageSurface>
);
```

### 중첩 규칙

- 최대 2단계 중첩: `PageSurface` > `SectionSurface`
- 내부 Surface는 외부보다 높은 elevation 사용
- 동일 elevation 중첩 금지

---

## 8. URL 기반 상태 관리

```tsx
import { useSearchParams, useParams, useRouter } from "next/navigation";

export const useUsersPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 상태 읽기
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const page = Number(searchParams.get("page") ?? 1);

  // URL 상태 변경
  const setSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return { search, status, page, setSearch };
};
```

**장점:**
- 브라우저 히스토리와 동기화 (뒤로가기 지원)
- 북마크/공유 가능
- 새로고침 시에도 상태 유지

---

## 9. 연관 에이전트

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 에이전트

| 에이전트 | 관계 |
|----------|------|
| ui-component-builder | Page가 사용할 Pure UI/Cell 컴포넌트 생성 |
| widget-builder | Page가 사용할 Widget 컴포넌트 생성 |
| feature-builder | Page가 사용할 Feature 컴포넌트 생성 |
| store-builder | 통합 훅에서 사용할 Store 생성 |
| controller-builder | API 엔드포인트 생성 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **/fe-review (Skill)** | 생성된 Page 규칙 검증 (필수) |

---

## 10. 참고 파일

| 유형 | 파일 경로 |
|------|----------|
| Simple Table 예시 | `apps/admin/app/(admin)/roles/page.tsx` |
| Pagination 예시 | `apps/admin/app/(admin)/users/page.tsx` |
| ConfirmModal | `packages/fe-ui/src/components/widgets/common/ConfirmModal` |
| **Cell 컴포넌트 폴더** | `packages/fe-ui/src/components/ui/data-display/cells/` |

---

## 11. Entity 도메인 메서드 활용

**컴포넌트에서 반복되는 색상/라벨 매핑 로직은 Entity 클래스의 도메인 메서드를 사용합니다.**

### 11.1 Entity 메서드 사용 패턴

API에서 받은 plain object 데이터를 Entity 인스턴스로 변환하여 메서드를 사용합니다:

```tsx
import { Subject } from "@cocrepo/entity";
import { plainToInstance } from "class-transformer";

function SubjectList({ subjects }: { subjects: Subject[] }) {
  // plain object → Entity 인스턴스 변환
  const subjectInstances = plainToInstance(Subject, subjects);

  return (
    <Table>
      {subjectInstances.map((subject) => (
        <TableRow key={subject.id}>
          <TableCell>
            {/* Entity 메서드 직접 호출 */}
            <Chip color={subject.getGroupColor()}>
              {subject.getGroupLabel()}
            </Chip>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

### 11.2 로컬 함수 vs Entity 메서드

| 구분 | 로컬 함수 (❌ 지양) | Entity 메서드 (✅ 권장) |
|------|-------------------|----------------------|
| 위치 | 컴포넌트 내 | `@cocrepo/entity` |
| 재사용 | 불가 (복사/붙여넣기) | 모든 컴포넌트에서 import |
| 변경 시 | 여러 파일 수정 | 한 곳에서 수정 |
| 테스트 | 컴포넌트와 함께 테스트 | 독립적 단위 테스트 |

### ❌ 잘못된 예시 (로컬 함수)

```tsx
// 컴포넌트 내 로컬 함수 - 재사용 불가
const getGroupColor = (group?: string) => {
  switch (group) {
    case "entity": return "primary";
    case "menu": return "secondary";
    // ...
  }
};

<Chip color={getGroupColor(subject.group)}>{getGroupLabel(subject.group)}</Chip>
```

### ✅ 올바른 예시 (Entity 메서드)

```tsx
import { Subject } from "@cocrepo/entity";
import { plainToInstance } from "class-transformer";

// Entity 인스턴스로 변환 후 메서드 사용
const instances = plainToInstance(Subject, subjects);

<Chip color={subject.getGroupColor()}>{subject.getGroupLabel()}</Chip>
```

### 11.3 활용 가능한 Entity 메서드 패턴

| 패턴 | 설명 | 예시 |
|------|------|------|
| `get{Property}Color()` | HeroUI 색상 variant 반환 | `getStatusColor()`, `getGroupColor()` |
| `get{Property}Label()` | 한글 라벨 반환 | `getStatusLabel()`, `getGroupLabel()` |
| `is{Condition}()` | 조건 확인 | `isActive()`, `isSystem()` |
| `to{Format}()` | 형식 변환 | `toOption()`, `toDisplayName()` |
