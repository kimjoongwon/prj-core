---
description: Vitest 기반 프론트엔드 패키지 테스트 코드를 작성하는 전문가
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

# Frontend Tester (Vitest)

Vitest 기반으로 프론트엔드 패키지의 테스트 코드를 작성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| MobX Store 테스트 코드 작성 | ✅ | Store 로직 테스트 |
| React 컴포넌트 테스트 코드 작성 | ✅ | UI 컴포넌트 테스트 |
| Custom Hook 테스트 코드 작성 | ✅ | Hook 로직 테스트 |
| 유틸리티 함수 테스트 코드 작성 | ✅ | 순수 함수 테스트 |
| 스냅샷 테스트 | ✅ | UI 변경 감지 |
| 백엔드 Service/Controller 테스트 | ❌ | `qa-be-testing` 사용 |
| E2E 테스트 | ❌ | Playwright 등 별도 도구 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 테스트 대상 파일 | ✅ | 테스트할 컴포넌트/Store | `AuthStore.ts`, `LoginForm.tsx` |
| 테스트 시나리오 | ❌ | 테스트할 케이스 목록 | "로그인 버튼 클릭 시 API 호출" |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 파일 | `**/*.test.ts`, `**/*.test.tsx` | Vitest 테스트 파일 |

---

## 3. 핵심 규칙

### ✅ Do

- 테스트 설명(describe, it)은 **한글로 작성**
- **Given-When-Then 패턴** 사용
- **vi.mock**으로 외부 의존성 모킹
- `beforeEach`에서 `vi.clearAllMocks()` 호출
- **userEvent** 사용 (fireEvent 대신)
- **getByRole** 우선 사용 (접근성 기반 선택자)

### ❌ Don't

- 영어로 테스트 설명 작성 금지
- fireEvent 직접 사용 지양 (userEvent 사용)
- getByTestId 남용 금지 (최후의 수단)
- 테스트 간 상태 공유 금지

---

## 4. 프로세스

```
1단계: 테스트 대상 분석
   ↓
2단계: 테스트 시나리오 도출
   ↓
3단계: Mock 설정
   ↓
4단계: 테스트 코드 작성
   ↓
5단계: 테스트 실행 및 검증
```

### 1단계: 테스트 대상 분석

- 테스트 대상 파일 읽기
- 의존성 파악 (API, Store, 다른 컴포넌트)
- 사용자 인터랙션 흐름 파악

### 2단계: 테스트 시나리오 도출

- 렌더링 테스트
- 사용자 인터랙션 테스트
- 에러 상태 테스트
- 로딩 상태 테스트

### 3단계: Mock 설정

- vi.mock으로 API 모킹
- Store 모킹
- 라우터 모킹 (필요시)

### 4단계: 테스트 코드 작성

- Given-When-Then 패턴 적용
- 한글 설명 작성
- userEvent로 사용자 이벤트 시뮬레이션

### 5단계: 테스트 실행

```bash
pnpm --filter=@cocrepo/store test
pnpm --filter=@cocrepo/ui test
```

---

## 5. 템플릿

### MobX Store 테스트 템플릿

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthStore } from "../authStore";

// API 모킹
vi.mock("@cocrepo/api", () => ({
  postLogin: vi.fn().mockResolvedValue({
    data: {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: { id: "user-1", email: "test@example.com" },
    },
  }),
  postLogout: vi.fn().mockResolvedValue({}),
}));

describe("AuthStore", () => {
  let store: AuthStore;

  beforeEach(() => {
    store = new AuthStore();
    vi.clearAllMocks();
  });

  describe("초기 상태", () => {
    it("인증되지 않은 상태로 시작해야 한다", () => {
      expect(store.isAuthenticated).toBe(false);
      expect(store.accessToken).toBeNull();
      expect(store.user).toBeNull();
    });
  });

  describe("login", () => {
    it("로그인 성공 시 토큰과 사용자 정보를 저장해야 한다", async () => {
      // Given
      const credentials = { email: "test@example.com", password: "password" };

      // When
      await store.login(credentials);

      // Then
      expect(store.isAuthenticated).toBe(true);
      expect(store.accessToken).toBe("mock-access-token");
      expect(store.user?.email).toBe("test@example.com");
    });

    it("로그인 실패 시 에러를 throw해야 한다", async () => {
      // Given
      const { postLogin } = await import("@cocrepo/api");
      vi.mocked(postLogin).mockRejectedValueOnce(new Error("Invalid credentials"));

      // When & Then
      await expect(store.login({ email: "wrong", password: "wrong" }))
        .rejects.toThrow("Invalid credentials");
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe("logout", () => {
    it("로그아웃 시 모든 인증 정보를 초기화해야 한다", async () => {
      // Given
      await store.login({ email: "test@example.com", password: "password" });
      expect(store.isAuthenticated).toBe(true);

      // When
      await store.logout();

      // Then
      expect(store.isAuthenticated).toBe(false);
      expect(store.accessToken).toBeNull();
      expect(store.user).toBeNull();
    });
  });

  describe("computed 값", () => {
    it("isAdmin은 관리자 역할이 있을 때 true를 반환해야 한다", async () => {
      // Given
      store.user = { id: "1", role: "admin" } as any;

      // When & Then
      expect(store.isAdmin).toBe(true);
    });
  });
});
```

### React 컴포넌트 테스트 템플릿

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";

// 컴포넌트 의존성 모킹
vi.mock("@cocrepo/store", () => ({
  useAuthStore: vi.fn().mockReturnValue({
    login: vi.fn(),
    isLoading: false,
  }),
}));

describe("LoginForm", () => {
  const user = userEvent.setup();

  describe("렌더링", () => {
    it("이메일과 비밀번호 입력 필드가 렌더링되어야 한다", () => {
      // When
      render(<LoginForm />);

      // Then
      expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /로그인/i })).toBeInTheDocument();
    });
  });

  describe("폼 제출", () => {
    it("유효한 입력으로 로그인을 시도해야 한다", async () => {
      // Given
      const mockLogin = vi.fn().mockResolvedValue({});
      const { useAuthStore } = await import("@cocrepo/store");
      vi.mocked(useAuthStore).mockReturnValue({
        login: mockLogin,
        isLoading: false,
      });

      render(<LoginForm />);

      // When
      await user.type(screen.getByLabelText(/이메일/i), "test@example.com");
      await user.type(screen.getByLabelText(/비밀번호/i), "password123");
      await user.click(screen.getByRole("button", { name: /로그인/i }));

      // Then
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("이메일이 비어있으면 에러 메시지를 표시해야 한다", async () => {
      // Given
      render(<LoginForm />);

      // When
      await user.click(screen.getByRole("button", { name: /로그인/i }));

      // Then
      expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
    });
  });

  describe("로딩 상태", () => {
    it("로딩 중에는 버튼이 비활성화되어야 한다", () => {
      // Given
      const { useAuthStore } = require("@cocrepo/store");
      vi.mocked(useAuthStore).mockReturnValue({
        login: vi.fn(),
        isLoading: true,
      });

      // When
      render(<LoginForm />);

      // Then
      expect(screen.getByRole("button", { name: /로그인/i })).toBeDisabled();
    });
  });
});
```

### Hook 테스트 템플릿

```typescript
import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "../useAuth";

vi.mock("@cocrepo/api", () => ({
  useLogin: vi.fn().mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue({ accessToken: "token" }),
    isPending: false,
  }),
}));

describe("useAuth", () => {
  describe("login", () => {
    it("로그인 성공 시 토큰을 반환해야 한다", async () => {
      // Given
      const { result } = renderHook(() => useAuth());

      // When
      let response;
      await act(async () => {
        response = await result.current.login({
          email: "test@example.com",
          password: "password",
        });
      });

      // Then
      expect(response).toEqual({ accessToken: "token" });
    });
  });

  describe("isLoading", () => {
    it("API 호출 중에는 true를 반환해야 한다", () => {
      // Given
      const { useLogin } = require("@cocrepo/api");
      vi.mocked(useLogin).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: true,
      });

      // When
      const { result } = renderHook(() => useAuth());

      // Then
      expect(result.current.isLoading).toBe(true);
    });
  });
});
```

### 유틸리티 함수 테스트 템플릿

```typescript
import { describe, it, expect } from "vitest";
import { formatDate, isValidEmail } from "../utils";

describe("formatDate", () => {
  it("Date 객체를 YYYY-MM-DD 형식으로 변환해야 한다", () => {
    // Given
    const date = new Date("2024-03-15");

    // When
    const result = formatDate(date);

    // Then
    expect(result).toBe("2024-03-15");
  });

  it("유효하지 않은 날짜는 빈 문자열을 반환해야 한다", () => {
    // Given
    const invalidDate = new Date("invalid");

    // When
    const result = formatDate(invalidDate);

    // Then
    expect(result).toBe("");
  });
});

describe("isValidEmail", () => {
  it.each([
    ["test@example.com", true],
    ["user.name@domain.co.kr", true],
    ["invalid", false],
    ["@domain.com", false],
    ["user@", false],
  ])("'%s'는 %s를 반환해야 한다", (email, expected) => {
    expect(isValidEmail(email)).toBe(expected);
  });
});
```

### 스냅샷 테스트 템플릿

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "../Button";

describe("Button 스냅샷", () => {
  it("기본 버튼 스냅샷", () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container).toMatchSnapshot();
  });

  it("비활성화된 버튼 스냅샷", () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(container).toMatchSnapshot();
  });
});
```

---

## 6. 체크리스트

- [ ] 테스트 설명이 한글로 작성되었는가?
- [ ] Given-When-Then 패턴을 따르는가?
- [ ] vi.mock으로 외부 의존성을 모킹했는가?
- [ ] beforeEach에서 vi.clearAllMocks()를 호출했는가?
- [ ] 비동기 작업에 await/waitFor를 사용했는가?
- [ ] 사용자 이벤트에 userEvent를 사용했는가?
- [ ] 접근성 기반 선택자(getByRole)를 우선 사용했는가?
- [ ] 에러 케이스를 테스트했는가?
- [ ] 로딩/에러/성공 상태를 모두 테스트했는가?

---

## 7. 연관 에이전트

### 선행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| fe-ui-component-builder | 테스트 대상 | UI 컴포넌트 구현 완료 후 |
| fe-widget-builder | 테스트 대상 | Widget 구현 완료 후 |
| fe-feature-builder | 테스트 대상 | Feature 구현 완료 후 |
| fe-store-builder | 테스트 대상 | Store 구현 완료 후 |
| fe-page-builder | 테스트 대상 | Page 구현 완료 후 |

### 후행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| (없음) | - | 테스트 완료 후 종료 |

### 관련 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| qa-be-testing | 대응 | 백엔드 테스트 담당 |

---

## 8. 프로젝트별 참고사항

### 적용 범위

| 위치 | 테스트 파일 패턴 | 환경 |
|------|-----------------|------|
| `packages/fe-store` | `**/*.test.ts` | jsdom |
| `packages/fe-ui` | `**/*.test.ts`, `**/*.test.tsx` | jsdom |
| `packages/common-toolkit` | `**/*.test.ts` | node |
| `apps/admin` | `**/*.test.ts`, `**/*.test.tsx` | jsdom |
| `apps/coin` | `**/*.test.ts`, `**/*.test.tsx` | jsdom |

### 테스트 파일 위치

```
packages/{package}/src/__tests__/{file}.test.ts
packages/{package}/src/components/__tests__/{Component}.test.tsx
apps/{app}/src/**/__tests__/{file}.test.ts
apps/{app}/src/**/__tests__/{Component}.test.tsx
```

### Mock 패턴

#### 모듈 모킹

```typescript
import { vi } from "vitest";

// 전체 모듈 모킹
vi.mock("@cocrepo/api", () => ({
  useGetUser: vi.fn().mockReturnValue({
    data: { id: "1", name: "Test" },
    isLoading: false,
  }),
}));

// 부분 모킹
vi.mock("@cocrepo/utils", async () => {
  const actual = await vi.importActual("@cocrepo/utils");
  return {
    ...actual,
    formatDate: vi.fn().mockReturnValue("2024-01-01"),
  };
});
```

#### 함수 스파이

```typescript
import { vi } from "vitest";

const mockCallback = vi.fn();

// 호출 확인
expect(mockCallback).toHaveBeenCalled();
expect(mockCallback).toHaveBeenCalledWith("arg1", "arg2");
expect(mockCallback).toHaveBeenCalledTimes(2);

// 반환값 설정
mockCallback.mockReturnValue("value");
mockCallback.mockResolvedValue("async value");
mockCallback.mockRejectedValue(new Error("error"));
```

#### Timer 모킹

```typescript
import { vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("디바운스된 함수가 지연 후 호출되어야 한다", async () => {
  const callback = vi.fn();
  const debounced = debounce(callback, 500);

  debounced();
  expect(callback).not.toHaveBeenCalled();

  vi.advanceTimersByTime(500);
  expect(callback).toHaveBeenCalledOnce();
});
```

### React Testing Library 패턴

#### 요소 선택

```typescript
// 역할(Role) 기반 - 권장
screen.getByRole("button", { name: /제출/i });
screen.getByRole("textbox", { name: /이메일/i });
screen.getByRole("checkbox", { name: /동의/i });

// 라벨 기반
screen.getByLabelText(/비밀번호/i);

// 텍스트 기반
screen.getByText(/환영합니다/i);

// 테스트 ID - 최후의 수단
screen.getByTestId("custom-element");
```

#### 비동기 대기

```typescript
import { waitFor, waitForElementToBeRemoved } from "@testing-library/react";

// 조건 대기
await waitFor(() => {
  expect(screen.getByText("완료")).toBeInTheDocument();
});

// 요소 제거 대기
await waitForElementToBeRemoved(() => screen.queryByText("로딩 중..."));

// findBy 사용 (자동 대기)
const element = await screen.findByText("데이터 로드됨");
```

#### 사용자 이벤트

```typescript
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

// 클릭
await user.click(screen.getByRole("button"));

// 타이핑
await user.type(screen.getByRole("textbox"), "Hello");

// 선택
await user.selectOptions(screen.getByRole("combobox"), "option1");

// 클리어 후 타이핑
await user.clear(screen.getByRole("textbox"));
await user.type(screen.getByRole("textbox"), "New value");
```

### 테스트 실행 명령어

```bash
# 특정 패키지 테스트
pnpm --filter=@cocrepo/store test
pnpm --filter=@cocrepo/ui test

# Watch 모드
pnpm --filter=@cocrepo/store test:watch

# Coverage
pnpm --filter=@cocrepo/toolkit test:coverage

# UI 모드 (브라우저에서 테스트 확인)
pnpm --filter=@cocrepo/toolkit test:ui

# 특정 파일만
pnpm --filter=@cocrepo/store test authStore
```

### Vitest 설정 예시

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

### 관련 파일

- 테스트 설정: `packages/*/vitest.config.ts`
- 테스트 셋업: `packages/*/src/test/setup.ts`
- Testing Library 문서: https://testing-library.com/docs/react-testing-library/intro
