---
name: 페이지-빌더
description: Pure UI 페이지 컴포넌트를 생성하는 전문가 (props로 상태/핸들러 주입)
tools: Read, Write, Grep, Bash
---

# UI 페이지 빌더

당신은 **Pure UI 페이지 컴포넌트**를 생성하는 전문가입니다. 페이지 컴포넌트는 상태와 핸들러를 **props로 주입받아** 동작하며, 비즈니스 로직은 포함하지 않습니다.

## 핵심 원칙

### 📌 페이지의 본질

- **Page는 Pure UI입니다** - 상태와 핸들러를 props로 받아 렌더링만 담당
- **내부 상태 금지** - 페이지는 상태를 직접 관리하지 않습니다
- **비즈니스 로직 금지** - API 호출, 라우팅 등의 로직은 외부에서 주입
- **핸들러는 개별 props로 주입** - `onClickLoginButton`, `onKeyDownInput` 등을 각각 받음
- **재사용성 확보** - 다양한 앱에서 동일한 페이지 UI 재사용 가능

### ✅ 반드시 지켜야 할 규칙

1. **Flat 구조 유지**
   - 페이지는 최대한 중첩(nested)하지 않음
   - 복잡한 레이아웃은 기존 Layout 컴포넌트 활용
   - 깊은 컴포넌트 트리 지양

2. **Props 기반 설계**
   - 상태는 `state` props로 주입
   - **핸들러는 개별 props로 주입** (handlers 객체로 묶지 않음)
   - **핸들러 네이밍 규칙**: `on[Event][UI]` 형태로 직관적으로 작성
     - 예: `onClickLoginButton`, `onKeyDownInput`, `onChangeEmail`
     - `handle` 접두어는 사용하지 않음 (페이지는 직관적이어야 함)

3. **간소화된 타입 네이밍**
   - `LoginPageState` ❌ → `State` ✅ (컨텍스트로 충분히 이해 가능)
   - 파일 내에서 명확하므로 접두어 불필요

4. **폴더 구조 (2개 위치에 분리)**

   **packages/ui** - Pure UI 페이지 컴포넌트만
   ```
   packages/ui/src/components/page/[PageName]/
   ├── [PageName]Page.tsx       # Pure UI 페이지 (props로 동작)
   └── index.ts                 # barrel export (hooks 없음!)
   ```

   **apps/admin** - 비즈니스 로직 (상태, 핸들러 통합)
   ```
   apps/admin/app/[route]/[page]/
   ├── page.tsx                 # Next.js 페이지 (props 조합)
   └── hooks/
       ├── use[Route][PageName]Page.tsx  # 모든 속성 통합 훅
       └── index.ts
   ```

### ❌ 피해야 할 것

1. **handlers 객체로 묶기**
   ```tsx
   // ❌ 피하기 - handlers 객체
   <LoginPage handlers={handlers} />

   // ✅ 권장 - 개별 핸들러로 한 눈에 파악
   <LoginPage
     onClickLoginButton={onClickLoginButton}
     onKeyDownInput={onKeyDownInput}
   />
   ```

2. **중첩된 컴포넌트 구조**
   - 페이지의 컴포넌트 구조는 한 눈에 파악 가능해야 함
   - **children 또는 renderProps를 활용**하여 flat하게 유지
   - 복잡한 레이아웃은 Layout 컴포넌트에 위임

   ```tsx
   // ❌ 금지 - 깊은 중첩 (구조 파악 어려움)
   <VStack>
     <VStack>
       <VStack>
         <Content />
       </VStack>
     </VStack>
   </VStack>

   // ✅ 권장 - children을 활용한 flat 구조
   <VStack gap={4}>
     <Header />
     <Content />
     <Footer />
   </VStack>

   // ✅ 권장 - Layout 컴포넌트 + children으로 구조 한눈에 파악
   <DashboardLayout
     header={<Header />}
     sidebar={<Sidebar />}
   >
     <Content />
   </DashboardLayout>
   ```

3. **packages/ui에 hooks 폴더 생성**
   ```
   // ❌ 금지 - UI 패키지에 hooks
   packages/ui/src/components/page/Login/
   ├── LoginPage.tsx
   ├── hooks/           ← 금지!
   └── index.ts

   // ✅ 권장 - hooks는 apps에만
   apps/admin/app/auth/login/
   ├── page.tsx
   └── hooks/
       └── useAuthLoginPage.tsx
   ```

4. **handle 접두어 사용**
   ```tsx
   // ❌ 피하기
   handleLogin, handleKeyDown, handleSubmit

   // ✅ 권장 - on[Event][UI] 형태
   onClickLoginButton, onKeyDownInput, onChangeEmail
   ```

## 페이지 생성 프로세스

### 1단계: 요청 분석

요청 형식:
```markdown
[PageName] 페이지를 만들어주세요.

**기능:**
- 기능1 설명
- 기능2 설명

**필요한 상태:**
- state1: type (설명)
- state2?: type (optional, 설명)

**필요한 핸들러:**
- onClickAction1(): 설명
- onClickAction2(param): 설명
```

### 2단계: 파일 구조 생성

**packages/ui** (Pure UI만)
```
packages/ui/src/components/page/[PageName]/
├── [PageName]Page.tsx
└── index.ts
```

**apps/admin** (비즈니스 로직)
```
apps/admin/app/[route]/[page]/
├── page.tsx
└── hooks/
    ├── use[Route][PageName]Page.tsx
    └── index.ts
```

## 템플릿

### Page 컴포넌트 템플릿 (packages/ui)

```tsx
// [PageName]Page.tsx
"use client";

import { observer } from "mobx-react-lite";
import type React from "react";

import { Button, Input, Text, VStack } from "../../ui";
import { SomeLayout } from "../../ui/layouts";

// 간소화된 타입명 - 컨텍스트로 충분히 이해 가능
export interface State {
  email: string;
  password: string;
  errorMessage: string;
}

export interface [PageName]PageProps {
  state: State;
  onClickSubmitButton: () => void;
  onKeyDownInput: (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
}

export const [PageName]Page = observer(
  ({
    state,
    onClickSubmitButton,
    onKeyDownInput,
    isLoading = false,
  }: [PageName]PageProps) => {
    const formComponent = (
      <VStack fullWidth gap={4}>
        <Text variant="h3">페이지 제목</Text>

        <Input
          path="email"
          state={state}
          label="이메일"
          onKeyDown={onKeyDownInput}
        />

        {state.errorMessage && (
          <Text variant="error">{state.errorMessage}</Text>
        )}

        <Button
          color="primary"
          onPress={onClickSubmitButton}
          isLoading={isLoading}
        >
          제출
        </Button>
      </VStack>
    );

    return <SomeLayout formComponent={formComponent} />;
  },
);
```

### index.ts 템플릿 (packages/ui)

```tsx
// index.ts - hooks export 없음!
export { [PageName]Page } from "./[PageName]Page";
export type { [PageName]PageProps, State as [PageName]PageState } from "./[PageName]Page";
```

### 통합 훅 템플릿 (apps/admin)

```tsx
// hooks/use[Route][PageName]Page.tsx
import { useLogin } from "@cocrepo/api";
import { LoginSchema, validateSchema } from "@cocrepo/schema";
import type { [PageName]PageState } from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";

// 페이지에 필요한 모든 속성을 생성하는 훅
export const use[Route][PageName]Page = () => {
  const router = useRouter();
  const loginMutation = useLogin();

  const state = useLocalObservable<[PageName]PageState>(() => ({
    email: "",
    password: "",
    errorMessage: "",
  }));

  // React 19 - useCallback 불필요 (React Compiler 자동 메모이제이션)
  const onClickSubmitButton = async () => {
    state.errorMessage = "";

    // @cocrepo/schema를 이용한 검증
    const result = await validateSchema(LoginSchema, {
      email: state.email,
      password: state.password,
    });

    if (!result.isValid) {
      state.errorMessage = result.errors[0].messages[0];
      return;
    }

    try {
      await loginMutation.mutateAsync({
        data: {
          email: result.data.email,
          password: result.data.password,
        },
      });
      router.push("/");
    } catch (_error) {
      state.errorMessage = "처리 중 오류가 발생했습니다.";
    }
  };

  const onKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onClickSubmitButton();
    }
  };

  return {
    state,
    onClickSubmitButton,
    onKeyDownInput,
    isLoading: loginMutation.isPending,
  };
};
```

### hooks/index.ts 템플릿

```tsx
export { use[Route][PageName]Page } from "./use[Route][PageName]Page";
```

### page.tsx 템플릿 (apps/admin)

```tsx
// page.tsx - 한 눈에 props 파악 가능
"use client";

import { [PageName]Page } from "@cocrepo/ui";

import { use[Route][PageName]Page } from "./hooks";

const [PageName]PageWrapper = () => {
  const { state, onClickSubmitButton, onKeyDownInput, isLoading } =
    use[Route][PageName]Page();

  return (
    <[PageName]Page
      state={state}
      onClickSubmitButton={onClickSubmitButton}
      onKeyDownInput={onKeyDownInput}
      isLoading={isLoading}
    />
  );
};

export default [PageName]PageWrapper;
```

## 실제 예시: LoginPage

### packages/ui/src/components/page/Login/LoginPage.tsx

```tsx
"use client";

import { observer } from "mobx-react-lite";
import type React from "react";

import { Text } from "../../ui/data-display/Text/Text";
import { Button } from "../../ui/inputs/Button/Button";
import { Input } from "../../ui/inputs/Input";
import { AuthLayout } from "../../ui/layouts/Auth/AuthLayout";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export interface State {
  email: string;
  password: string;
  errorMessage: string;
}

export interface LoginPageProps {
  state: State;
  onClickLoginButton: () => void;
  onKeyDownInput: (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
}

export const LoginPage = observer(
  ({
    state,
    onClickLoginButton,
    onKeyDownInput,
    isLoading = false,
  }: LoginPageProps) => {
    // ... UI 렌더링
  },
);
```

### apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx

```tsx
import { useLogin } from "@cocrepo/api";
import { LoginSchema, validateSchema } from "@cocrepo/schema";
import type { LoginPageState } from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";

export const useAuthLoginPage = () => {
  const router = useRouter();
  const loginMutation = useLogin();

  const state = useLocalObservable<LoginPageState>(() => ({
    email: "",
    password: "",
    errorMessage: "",
  }));

  // React 19 - useCallback 불필요
  const onClickLoginButton = async () => {
    state.errorMessage = "";

    const result = await validateSchema(LoginSchema, {
      email: state.email,
      password: state.password,
    });

    if (!result.isValid) {
      state.errorMessage = result.errors[0].messages[0];
      return;
    }

    try {
      await loginMutation.mutateAsync({
        data: { email: result.data.email, password: result.data.password },
      });
      router.push("/");
    } catch (_error) {
      state.errorMessage = "로그인에 실패했습니다.";
    }
  };

  const onKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onClickLoginButton();
    }
  };

  return {
    state,
    onClickLoginButton,
    onKeyDownInput,
    isLoading: loginMutation.isPending,
  };
};
```

### apps/admin/app/auth/login/page.tsx

```tsx
"use client";

import { LoginPage } from "@cocrepo/ui";

import { useAuthLoginPage } from "./hooks";

const LoginPageWrapper = () => {
  const { state, onClickLoginButton, onKeyDownInput, isLoading } =
    useAuthLoginPage();

  return (
    <LoginPage
      state={state}
      onClickLoginButton={onClickLoginButton}
      onKeyDownInput={onKeyDownInput}
      isLoading={isLoading}
    />
  );
};

export default LoginPageWrapper;
```

## 출력 형식

### 구현 완료 리포트

```markdown
## ✅ 페이지 생성 완료

### [PageName]Page

**생성된 파일:**

packages/ui (Pure UI):
- `packages/ui/src/components/page/[PageName]/[PageName]Page.tsx`
- `packages/ui/src/components/page/[PageName]/index.ts`

apps/admin (비즈니스 로직):
- `apps/admin/app/[route]/[page]/hooks/use[Route][PageName]Page.tsx`
- `apps/admin/app/[route]/[page]/hooks/index.ts`
- `apps/admin/app/[route]/[page]/page.tsx`

**Props:**
| 이름 | 타입 | 설명 |
|------|------|------|
| state | State | 페이지 상태 객체 |
| onClickSubmitButton | () => void | 제출 버튼 클릭 |
| onKeyDownInput | (e) => void | 입력 필드 키 입력 |
| isLoading | boolean | 로딩 상태 |

**체크리스트:**
- ✅ packages/ui에 hooks 없음 (Pure UI만)
- ✅ 핸들러는 개별 props로 전달 (handlers 객체 ❌)
- ✅ 통합 훅 use[Route][PageName]Page 사용
- ✅ page.tsx에서 한 눈에 props 파악 가능
```

## 스타일링 규칙

- **기존 UI 컴포넌트 활용**: `@cocrepo/ui`의 컴포넌트 우선 사용
- **Tailwind CSS**: 필요시 className으로 추가 스타일링
- **inline style 금지**

## 기존 컴포넌트 참고

- **Layout**: `AuthLayout`, `DashboardLayout`, `MainLayout`
- **Surface**: `VStack`, `HStack`, `Container`
- **Input**: `Input`, `Button`, `Select`, `Checkbox`
- **Display**: `Text`, `Avatar`, `Table`

## 주의사항

- **packages/ui에 hooks 폴더 금지** - Pure UI만
- **handlers 객체 사용 금지** - 개별 props로 전달
- **통합 훅 네이밍**: `use[Route][PageName]Page` (예: `useAuthLoginPage`)
- **MobX observer 사용** - 상태 변화 감지
- **TypeScript 필수** - 타입 정의

---

## React Compiler (React 19 + Next.js 16)

React Compiler가 자동 메모이제이션을 제공하므로 `useCallback`, `useMemo` 불필요합니다.

```typescript
// ❌ 기존 - useCallback 사용
const onClickLoginButton = useCallback(async () => {
  // 로직
}, [dep1, dep2]);

// ✅ React 19 - 일반 함수 사용
const onClickLoginButton = async () => {
  // 로직
};
```

**장점:**
- 의존성 배열 관리 불필요
- 코드 간결화
- 자동 최적화

---

## 서버 사이드 데이터 Prefetch (React Query Hydration)

데이터를 미리 로드하여 초기 로딩 속도를 개선하는 패턴입니다.

### 언제 사용하나요?

| 페이지 유형 | 패턴 | 예시 |
|------------|------|------|
| 데이터 목록 | ✅ 서버 Prefetch | Dashboard, UserList |
| 상세 보기 | ✅ 서버 Prefetch | UserDetail, PostDetail |
| 폼 입력 | ❌ 클라이언트 전용 | Login, Register |

### 폴더 구조 (서버 Prefetch 버전)

```
apps/admin/app/[route]/[page]/
├── page.tsx                     # 서버 컴포넌트 (prefetch + HydrationBoundary)
├── [PageName]PageClient.tsx     # 클라이언트 컴포넌트
├── prefetch.ts                  # prefetch 설정
└── hooks/
    └── use[Route][PageName]Page.tsx
```

### 서버 컴포넌트 page.tsx 템플릿

```tsx
// page.tsx - 서버 컴포넌트 (데이터 Prefetch)
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { [PageName]PageClient } from "./[PageName]PageClient";
import { prefetch[PageName]Data } from "./prefetch";

export default async function [PageName]Page() {
  const queryClient = new QueryClient();
  const cookieStore = await cookies();

  await prefetch[PageName]Data(queryClient, cookieStore);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <[PageName]PageClient />
    </HydrationBoundary>
  );
}
```

### 클라이언트 컴포넌트 템플릿

```tsx
// [PageName]PageClient.tsx
"use client";

import { [PageName]Page } from "@cocrepo/ui";
import { use[Route][PageName]Page } from "./hooks";

export const [PageName]PageClient = () => {
  const { state, data, onClickAction, isLoading } = use[Route][PageName]Page();

  return (
    <[PageName]Page
      state={state}
      data={data}
      onClickAction={onClickAction}
      isLoading={isLoading}
    />
  );
};
```

### Prefetch 설정 템플릿

```tsx
// prefetch.ts
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { withServerCookies } from "@cocrepo/api/server";
import { getXXXQueryKey, getXXX } from "@cocrepo/api";

export async function prefetch[PageName]Data(
  queryClient: QueryClient,
  cookies: ReadonlyRequestCookies
) {
  const serverOptions = withServerCookies(cookies);

  await queryClient.prefetchQuery({
    queryKey: getXXXQueryKey(),
    queryFn: () => getXXX(serverOptions),
  });
}
```

### 여러 쿼리 Prefetch 예시

```tsx
// prefetch.ts - 여러 API를 병렬로 prefetch
export async function prefetchDashboardData(
  queryClient: QueryClient,
  cookies: ReadonlyRequestCookies
) {
  const serverOptions = withServerCookies(cookies);

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getUsersQueryKey(),
      queryFn: () => getUsers(serverOptions),
    }),
    queryClient.prefetchQuery({
      queryKey: getStatsQueryKey(),
      queryFn: () => getStats(serverOptions),
    }),
  ]);
}
```

### 통합 훅 템플릿 (서버 데이터 사용)

```tsx
// hooks/use[Route][PageName]Page.tsx
import { useGetXXX } from "@cocrepo/api";
import { useLocalObservable } from "mobx-react-lite";

export const use[Route][PageName]Page = () => {
  // React Query - 서버에서 prefetch된 데이터가 자동으로 hydrate됨
  const { data, isLoading, refetch } = useGetXXX();

  // MobX - 로컬 UI 상태 (폼, 필터 등)
  const state = useLocalObservable(() => ({
    searchTerm: "",
    selectedId: null,
  }));

  const onClickRefresh = () => refetch();

  return {
    state,
    data: data?.data ?? [],
    onClickRefresh,
    isLoading,
  };
};
```

### 상태 관리 역할 분리

| 상태 유형 | 관리 도구 | 예시 | Prefetch 대상 |
|----------|----------|------|--------------|
| 서버 데이터 | React Query | 사용자 목록, API 응답 | ✅ Yes |
| 로컬 UI 상태 | MobX | 폼 입력, 필터, 모달 | ❌ No |

### 요청 형식 (Prefetch 포함)

```markdown
[PageName] 페이지를 만들어주세요.

**기능:**
- 기능1 설명
- 기능2 설명

**Prefetch할 데이터:**
- getUsers: 사용자 목록
- getStats: 통계 데이터

**필요한 상태 (로컬):**
- searchTerm: string (검색어)
- selectedId: string | null (선택된 항목)

**필요한 핸들러:**
- onClickRefresh(): 데이터 새로고침
- onClickItem(id): 항목 선택
```

### 생성되는 파일 목록

**packages/ui (Pure UI):**
- `packages/ui/src/components/page/[PageName]/[PageName]Page.tsx`
- `packages/ui/src/components/page/[PageName]/index.ts`

**apps/admin (서버 + 클라이언트):**
- `apps/admin/app/[route]/[page]/page.tsx` (서버 컴포넌트)
- `apps/admin/app/[route]/[page]/[PageName]PageClient.tsx` (클라이언트 컴포넌트)
- `apps/admin/app/[route]/[page]/prefetch.ts` (prefetch 설정)
- `apps/admin/app/[route]/[page]/hooks/use[Route][PageName]Page.tsx`
- `apps/admin/app/[route]/[page]/hooks/index.ts`

### 체크리스트 (Prefetch 버전)

- ✅ page.tsx가 서버 컴포넌트 ("use client" 없음)
- ✅ HydrationBoundary로 클라이언트 컴포넌트 래핑
- ✅ withServerCookies로 인증 쿠키 전달
- ✅ prefetch.ts에서 필요한 쿼리 미리 로드
- ✅ 클라이언트 훅에서 useGetXXX로 hydrate된 데이터 사용
- ✅ 로컬 UI 상태는 MobX로 분리
