---
name: 페이지-빌더
description: Pure UI 페이지 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# 페이지 빌더

**Pure UI 페이지 컴포넌트**를 `packages/ui`에 생성하고, `apps/*`에서 비즈니스 로직과 연결합니다.

---

## 1. 개요

### Page 빌더가 하는 일

1. `packages/ui`에 **Pure UI Page 컴포넌트** 생성
2. `apps/*/app/[route]/`에 **통합 훅(useXxxPage)** 생성
3. `apps/*/app/[route]/page.tsx`에서 둘을 연결

### 왜 이렇게 하나요?

| 장점 | 설명 |
|------|------|
| **재사용성** | 같은 Page를 admin, coin 등 여러 앱에서 사용 가능 |
| **테스트 용이** | Pure UI는 props만 주면 테스트 가능 |
| **관심사 분리** | UI는 packages/ui, 로직은 apps에서 관리 |

---

## 2. 아키텍처

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
│  │  ├── page.tsx         ← Page + Hook 연결            │    │
│  │  └── hooks/                                          │    │
│  │      └── useAuthLoginPage.ts  ← 비즈니스 로직       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 작업 단계

### Step 1: Pure UI Page 컴포넌트 생성

**위치**: `packages/ui/src/components/page/[PageName]/`

```tsx
// packages/ui/src/components/page/Login/LoginPage.tsx
"use client";

import { observer } from "mobx-react-lite";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { Input } from "../../ui/inputs/Input/Input";
import { Button } from "../../ui/inputs/Button/Button";
import { Text } from "../../ui/data-display/Text/Text";

/** Page 내부에서만 사용하는 State 타입 */
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
      <VStack className="gap-4 w-full max-w-md">
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

```ts
// packages/ui/src/components/page/Login/index.ts
export { LoginPage } from "./LoginPage";
export type { LoginPageProps, State as LoginPageState } from "./LoginPage";
```

### Step 2: 통합 훅 생성

**위치**: `apps/admin/app/[route]/[page]/hooks/`

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

```ts
// apps/admin/app/auth/login/hooks/index.ts
export { useAuthLoginPage } from "./useAuthLoginPage";
```

### Step 3: page.tsx에서 연결

**위치**: `apps/admin/app/[route]/[page]/page.tsx`

```tsx
// apps/admin/app/auth/login/page.tsx
"use client";

import { LoginPage } from "@cocrepo/ui";
import { useAuthLoginPage } from "./hooks";

export default function LoginPageRoute() {
  const props = useAuthLoginPage();

  return <LoginPage {...props} />;
}
```

---

## 4. 핵심 규칙

### 4.1 Pure UI 원칙

| 규칙 | 설명 |
|------|------|
| **상태 주입** | Page는 state를 props로 받음 (내부 useState 금지) |
| **핸들러 주입** | 모든 이벤트 핸들러는 props로 받음 |
| **API 호출 금지** | Page 내부에서 API 호출하지 않음 |

### 4.2 네이밍 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| Page 컴포넌트 | `[Name]Page` | `LoginPage`, `DashboardPage` |
| 통합 훅 | `use[Route][Name]Page` | `useAuthLoginPage` |
| 핸들러 | `on[Event][UI]` | `onClickLoginButton`, `onChangeEmail` |
| State 타입 | 파일 내 `State` | `State` (접두어 불필요) |

### 4.3 Layout 컴포넌트 금지 (중요!)

**Page 컴포넌트 내부에서 Layout 컴포넌트를 사용하면 안 됩니다.**

Layout은 반드시 **Next.js의 layout.tsx**에서만 사용해야 합니다.

```tsx
// ❌ 금지 - Page 내부에 Layout 사용
export const LoginPage = observer(({ state, ...handlers }: LoginPageProps) => {
  return (
    <AuthLayout>           {/* ← Layout이 Page 안에 있으면 안 됨! */}
      <Input ... />
      <Button ... />
    </AuthLayout>
  );
});

// ✅ 올바른 패턴 - Page는 순수 UI만 반환
export const LoginPage = observer(({ state, ...handlers }: LoginPageProps) => {
  return (
    <VStack>               {/* ← 순수 UI 컴포넌트만 사용 */}
      <Input ... />
      <Button ... />
    </VStack>
  );
});

// ✅ Layout은 Next.js layout.tsx에서 사용
// apps/admin/app/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayoutComponent>   {/* ← Layout은 여기서만 사용 */}
      {children}
    </AuthLayoutComponent>
  );
}
```

**이유:**
- Layout은 라우트 레벨에서 결정되어야 함
- 같은 Page를 다른 Layout으로 재사용할 수 있어야 함
- 관심사 분리: Page는 콘텐츠, Layout은 구조

### 4.4 기타 금지 패턴

```tsx
// ❌ handlers 객체로 묶기
<LoginPage handlers={{ onClick, onChange }} />

// ✅ 개별 핸들러
<LoginPage onClickLoginButton={onClickLoginButton} onChangeEmail={onChangeEmail} />
```

```tsx
// ❌ packages/ui에 hooks 폴더 생성
packages/ui/src/components/page/Login/hooks/  ← 절대 금지!

// ✅ hooks는 apps에만
apps/admin/app/auth/login/hooks/
```

```tsx
// ❌ useCallback/useMemo 사용
const onClick = useCallback(() => {}, []);

// ✅ 일반 함수 (React 19 + MobX 자동 최적화)
const onClick = () => { ... };
```

---

## 5. 폴더 구조 요약

```
packages/ui/src/components/page/
├── Login/
│   ├── LoginPage.tsx      # Pure UI
│   └── index.ts           # export (hooks 없음!)
├── Dashboard/
│   ├── DashboardPage.tsx
│   └── index.ts
└── index.ts               # barrel export

apps/admin/app/
├── auth/
│   └── login/
│       ├── page.tsx       # Next.js 라우트
│       └── hooks/
│           ├── useAuthLoginPage.ts
│           └── index.ts
└── dashboard/
    ├── page.tsx
    └── hooks/
        └── useDashboardPage.ts
```

---

## 6. 체크리스트

### Page 컴포넌트 (packages/ui)

- [ ] `packages/ui/src/components/page/[Name]/` 에 생성
- [ ] observer로 감싸기
- [ ] State, Props 인터페이스 정의
- [ ] 모든 상태/핸들러는 props로 받음
- [ ] hooks 폴더 없음

### 통합 훅 (apps/*)

- [ ] `apps/*/app/[route]/hooks/` 에 생성
- [ ] `use[Route][Name]Page` 네이밍
- [ ] useLocalObservable로 상태 관리
- [ ] Orval 생성 API 사용 (직접 axios 금지)

### page.tsx (apps/*)

- [ ] "use client" 선언
- [ ] 훅 호출 → Page에 props 전달
- [ ] 한 눈에 어떤 props가 전달되는지 파악 가능
