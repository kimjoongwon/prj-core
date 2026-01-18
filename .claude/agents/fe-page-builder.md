---
name: 페이지-빌더
description: Pure UI 페이지 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# 페이지 빌더

**Pure UI 페이지 컴포넌트**를 `packages/ui`에 생성하고, `apps/*`에서 비즈니스 로직과 연결합니다.

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 새로운 페이지 화면 구성 | ✅ | LoginPage, DashboardPage, UsersPage |
| 여러 앱에서 재사용할 페이지 UI | ✅ | 동일한 UI를 admin, coin에서 사용 |
| Next.js 라우트 페이지 생성 | ✅ | page.tsx + 통합 훅 생성 |
| 단일 Feature 컴포넌트 | ❌ | Feature Builder 사용 |
| 레이아웃 구성 | ❌ | Next.js layout.tsx에서 처리 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 페이지명 | ✅ | `[Name]Page` 패턴 |
| 페이지 경로 | ✅ | Next.js App Router 경로 |
| State 정의 | ✅ | 페이지 상태 타입 |
| 핸들러 목록 | ✅ | `on[Event][UI]` 형태 |

### 출력

| 항목 | 경로 |
|------|------|
| Pure UI Page | `packages/ui/src/components/page/[Name]/[Name]Page.tsx` |
| Page barrel | `packages/ui/src/components/page/[Name]/index.ts` |
| 통합 훅 | `apps/*/app/[route]/hooks/use[Route][Name]Page.ts` |
| 훅 barrel | `apps/*/app/[route]/hooks/index.ts` |
| Next.js page | `apps/*/app/[route]/page.tsx` |

---

## 3. 핵심 규칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **상태 주입** | Page는 state를 props로 받음 (내부 useState 금지) |
| **핸들러 주입** | 모든 이벤트 핸들러는 props로 받음 |
| **observer 필수** | MobX 상태 구독을 위해 감싸기 |
| **핸들러 네이밍** | `on[Event][UI]` 형태 (onClickLoginButton) |
| **URL 기반 상태** | 페이지 상태는 queryParams/pathParams로 관리 |

### ❌ Don't

| 금지 사항 | 이유 |
|----------|------|
| Page 내부에서 API 호출 | 통합 훅에서 처리 |
| Layout 컴포넌트 사용 | Next.js layout.tsx에서만 사용 |
| handlers 객체로 묶기 | 개별 props로 전달 |
| packages/ui에 hooks 폴더 | apps에서만 생성 |
| useCallback/useMemo | React 19 + MobX 자동 최적화 |
| 페이지 레벨 _stores 폴더 | URL 기반 상태 관리 사용 |
| 커스텀 className | UI/Input에서만 허용 |

---

## 4. 프로세스

### 4.1 아키텍처 이해

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

### 4.2 파일 구조 생성

```
packages/ui/src/components/page/
├── Login/
│   ├── LoginPage.tsx      # Pure UI
│   └── index.ts           # export (hooks 없음!)
└── index.ts               # barrel export

apps/admin/app/
├── auth/
│   └── login/
│       ├── page.tsx       # Next.js 라우트
│       └── hooks/
│           ├── useAuthLoginPage.ts
│           └── index.ts
```

### 4.3 네이밍 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| Page 컴포넌트 | `[Name]Page` | `LoginPage`, `DashboardPage` |
| 통합 훅 | `use[Route][Name]Page` | `useAuthLoginPage` |
| 핸들러 | `on[Event][UI]` | `onClickLoginButton`, `onChangeEmail` |
| State 타입 | 파일 내 `State` | `State` (접두어 불필요) |

---

## 5. 템플릿

### 5.1 Pure UI Page 컴포넌트

```tsx
// packages/ui/src/components/page/Login/LoginPage.tsx
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

### 5.2 Page barrel export

```ts
// packages/ui/src/components/page/Login/index.ts
export { LoginPage } from "./LoginPage";
export type { LoginPageProps, State as LoginPageState } from "./LoginPage";
```

### 5.3 통합 훅

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

### 5.4 훅 barrel export

```ts
// apps/admin/app/auth/login/hooks/index.ts
export { useAuthLoginPage } from "./useAuthLoginPage";
```

### 5.5 Next.js page.tsx

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

### 5.6 URL 기반 상태 관리

```tsx
// ✅ 올바른 패턴 - URL 기반 상태 관리
import { useSearchParams, useParams, useRouter } from "next/navigation";

export const useUsersPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
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

---

## 6. 체크리스트

### Page 컴포넌트 (packages/ui)

- [ ] `packages/ui/src/components/page/[Name]/` 에 생성
- [ ] observer로 감싸기
- [ ] State, Props 인터페이스 정의
- [ ] 모든 상태/핸들러는 props로 받음
- [ ] Layout 컴포넌트 사용하지 않음
- [ ] 커스텀 className 사용하지 않음
- [ ] hooks 폴더 없음

### 통합 훅 (apps/*)

- [ ] `apps/*/app/[route]/hooks/` 에 생성
- [ ] `use[Route][Name]Page` 네이밍
- [ ] useLocalObservable로 상태 관리
- [ ] Orval 생성 API 사용 (직접 axios 금지)
- [ ] 핸들러 네이밍 `on[Event][UI]`

### page.tsx (apps/*)

- [ ] "use client" 선언
- [ ] 훅 호출 -> Page에 props 전달
- [ ] 한 눈에 어떤 props가 전달되는지 파악 가능

---

## 7. 연관 에이전트

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 에이전트

| 에이전트 | 관계 |
|----------|------|
| fe-ui-component-builder | Page가 사용할 Pure UI 컴포넌트 생성 |
| fe-widget-builder | Page가 사용할 Widget 컴포넌트 생성 |
| **fe-feature-builder** | Page가 사용할 Feature 컴포넌트 생성 |
| fe-store-builder | 통합 훅에서 사용할 Store 생성 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-page-reviewer** | 생성된 Page 규칙 검증 (필수) |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| route-designer | 페이지 라우팅 경로 설계 |
| controller-builder | 통합 훅에서 호출할 API 생성 |

---

## 8. 프로젝트별 참고사항

### 왜 이렇게 분리하나요?

| 장점 | 설명 |
|------|------|
| **재사용성** | 같은 Page를 admin, coin 등 여러 앱에서 사용 가능 |
| **테스트 용이** | Pure UI는 props만 주면 테스트 가능 |
| **관심사 분리** | UI는 packages/ui, 로직은 apps에서 관리 |

### Layout 컴포넌트 사용 위치

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

### 스타일링 규칙

| 허용 | 금지 |
|------|------|
| HeroUI 컴포넌트 props (size, color, variant 등) | 직접 Tailwind className 작성 |
| `<VStack>`, `<HStack>`, `<Spacer />` | `className="flex gap-2 mt-4"` |
| 기존 UI 컴포넌트 조합 | inline style (`style={{...}}`) |

### 페이지 상태 관리 원칙

| 상태 유형 | 관리 방법 | 예시 |
|----------|----------|------|
| 필터/검색 | `queryParams` | `?search=kim&status=active` |
| 리소스 식별 | `pathParams` | `/users/123` |
| 임시 전달 데이터 | `router.push({ state })` | 이전 페이지에서 전달 |

**이유:**
- URL 상태는 브라우저 히스토리와 동기화됨 (뒤로가기 지원)
- 북마크/공유 가능
- 새로고침 시에도 상태 유지
- 전역 Store 오염 방지

### Surface 시스템 (필수)

**페이지 콘텐츠는 반드시 Surface 컴포넌트로 감싸야 합니다.**

#### 엘리베이션 레벨

| 레벨 | 이름 | 용도 |
|------|------|------|
| 0 | `flat` | 페이지 배경 |
| 1 | `raised` | PageSurface 기본값 |
| 2 | `elevated` | SectionSurface, 카드, DataGrid |
| 3 | `floating` | 드롭다운, 팝오버 |
| 4 | `overlay` | 모달, 다이얼로그 |

#### 사용 패턴

```tsx
// ✅ 올바른 패턴 - Surface로 감싸기
import { PageSurface, SectionSurface } from "@cocrepo/ui";

return (
  <PageSurface
    title="회원 목록"
    description="시스템에 등록된 회원을 관리합니다."
    actions={<Button>회원 등록</Button>}
  >
    <div className="space-y-4">
      <SectionSurface padding="none">
        <DataGrid ... />
      </SectionSurface>
      <Pagination ... />
    </div>
  </PageSurface>
);

// ❌ 금지 - Surface 없이 직접 렌더링
return (
  <div className="space-y-4">
    <DataGrid ... />
    <Pagination ... />
  </div>
);
```

#### 중첩 규칙

- 최대 2단계 중첩: `PageSurface` > `SectionSurface`
- 내부 Surface는 외부보다 높은 elevation 사용
- 동일 elevation 중첩 금지
