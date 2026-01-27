---
description: Pure UI 페이지 컴포넌트를 생성하는 전문가
mode: subagent
tools:
  read: true
  write: true
  edit: true
  grep: true
  bash: true
---

# 페이지 빌더

**페이지 컴포넌트**를 생성합니다. 일반 페이지는 `packages/ui`에 Pure UI로, 목록 페이지는 `apps/*`에 직접 생성합니다.

## 1. 페이지 유형 선택

| 유형 | 설명 | 생성 위치 | 예시 |
|------|------|-----------|------|
| **일반 페이지** | 폼, 대시보드, 상세 보기 등 | `packages/ui` + `apps/*` | Login, Dashboard, UserDetail |
| **목록 페이지** | DataGrid/Table 기반 CRUD | `apps/*`만 | UserList, RoleList |

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
| useState 사용 | MobX useLocalObservable 사용 |
| useCallback/useMemo | React 19 + MobX 자동 최적화 |
| 직접 axios/fetch 호출 | @cocrepo/api 사용 |
| 인라인 함수 선언 | 함수는 컴포넌트 외부 또는 훅에서 정의 |
| 커스텀 className (Page/Feature) | VStack/HStack 등 UI 컴포넌트 사용 |

### 핸들러 네이밍 규칙

| 위치 | 패턴 | 예시 |
|------|------|------|
| Page 컴포넌트 | `on[Event][UI]` | `onClickLoginButton`, `onChangeEmail` |
| 일반 컴포넌트 | `handle[Action]` | `handleSubmit`, `handleDelete` |

## 3. 폴더 구조 (Prefetch 필수)

```
apps/admin/app/[route]/
├── page.tsx          # 서버 컴포넌트 (Prefetch + HydrationBoundary)
├── _client.tsx       # 클라이언트 컴포넌트
├── _prefetch.ts      # Prefetch 설정
└── hooks/            # 통합 훅 (필요 시)
    └── use[Route][Name]Page.ts
```

## 4. 목록 페이지 (DataGrid/Table)

### Cell 컴포넌트 재사용 규칙 (Critical)

**테이블 셀 렌더링 로직은 반드시 재사용 가능한 Cell 컴포넌트로 분리합니다.**

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

## 5. 서버 사이드 Prefetch (필수)

**모든 페이지는 반드시 서버 사이드 Prefetch 패턴을 사용해야 합니다.**

### 서버 컴포넌트 (page.tsx)

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

## 6. Surface 시스템

**페이지 콘텐츠는 반드시 Surface 컴포넌트로 감싸야 합니다.**

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

## 체크리스트

**Prefetch 구조**
- [ ] page.tsx에 `"use client"` 없음 (서버 컴포넌트)
- [ ] HydrationBoundary로 클라이언트 컴포넌트 래핑
- [ ] withServerCookies로 인증 쿠키 전달
- [ ] Orval 생성 prefetch 함수 사용 (prefetchGetXXXQuery)
- [ ] 클라이언트에서 isLoading 제거 (prefetch로 데이터 보장)

**목록 페이지**
- [ ] Prefetch 구조 (page.tsx + _client.tsx + _prefetch.ts)
- [ ] page.tsx가 서버 컴포넌트 ("use client" 없음)
- [ ] _client.tsx에 `"use client"` 선언
- [ ] `observer` 래핑
- [ ] `useLocalObservable` 사용
- [ ] PageSurface + SectionSurface 사용
- [ ] **Cell 컴포넌트 사용** (인라인 포맷터 금지)
- [ ] 삭제 시 ConfirmModal 사용
- [ ] 빈 상태 메시지 설정
