# 관리자 인증 시스템 화면 기획서

**플랫폼:** Admin Web
**최종 수정일:** 2026-01-01
**버전:** 1.0

---

## 1. 화면 개요

### 목적

관리자가 시스템에 로그인하고, 적절한 Space를 선택하여 API 요청에 필요한 인증 정보를 설정하는 흐름을 정의합니다.

### 인증 흐름 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           인증 플로우                                    │
└─────────────────────────────────────────────────────────────────────────┘

[앱 진입]
    │
    ▼
[인증 상태 확인] ─── 토큰 유효 ───▶ [Space 확인] ─── spaceId 있음 ───▶ [대시보드]
    │                                    │
    │                                    │ spaceId 없음
    │                                    ▼
    │                              [Space 선택 Alert]
    │                                    │
    │                                    ▼
    │                              [Space 선택 페이지]
    │                                    │
    │                                    ▼
    │                              [대시보드]
    │
    │ 토큰 없음/만료
    ▼
[LoginPage]
    │
    │ 로그인 성공
    ▼
[토큰 저장 (Cookie)]
    │
    ▼
[Space 자동 선택]
(user.tenants[0].spaceId)
    │
    ▼
[PersistStore 저장]
(spaceId, groundName)
    │
    ▼
[대시보드 이동 (/)]
```

---

## 2. 화면 구조

### 2.1 LoginPage (로그인 페이지)

**경로:** `/auth/login`

```
+------------------------------------------------------------------+
|                                                                   |
|                      [로고 아이콘]                                 |
|                                                                   |
|                    관리자 로그인                                   |
|                관리자 계정으로 로그인하세요                          |
|                                                                   |
|              +----------------------------------+                  |
|              |  이메일                          |                  |
|              +----------------------------------+                  |
|                                                                   |
|              +----------------------------------+                  |
|              |  비밀번호                  [👁]   |                  |
|              +----------------------------------+                  |
|                                                                   |
|              [        에러 메시지 영역          ]                  |
|                                                                   |
|              +----------------------------------+                  |
|              |         로그인 버튼              |                  |
|              +----------------------------------+                  |
|                                                                   |
+------------------------------------------------------------------+
```

**현재 구현 상태:** ✅ 완료 (UI 컴포넌트 및 훅 존재)

**컴포넌트:**
- `packages/ui/src/components/page/Login/LoginPage.tsx` - Pure UI
- `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx` - 로직 훅
- `apps/admin/app/auth/login/page.tsx` - Next.js 페이지

### 2.2 Space 선택 Alert

**조건:** 로그인 후 spaceId가 없는 경우

```
+------------------------------------------+
|                                          |
|     ⚠️  Space 선택 필요                   |
|                                          |
|     서비스 이용을 위해 Space를             |
|     선택해주세요.                          |
|                                          |
|              [Space 선택하기]             |
|                                          |
+------------------------------------------+
```

**동작:** 확인 버튼 클릭 시 `/select-space` 페이지로 이동

---

## 3. 데이터 요구사항

### 3.1 API 엔드포인트

| Method | Endpoint | 설명 | 현재 상태 |
|--------|----------|------|----------|
| POST | `/api/v1/auth/login` | 로그인 | ✅ 구현됨 (Orval) |
| POST | `/api/v1/auth/logout` | 로그아웃 | ✅ 구현됨 (Orval) |
| POST | `/api/v1/auth/token/refresh` | 토큰 갱신 | ✅ 구현됨 (Orval) |
| GET | `/api/v1/grounds` | Ground 목록 조회 | ✅ 구현됨 (Orval) |

### 3.2 httpOnly 쿠키 환경에서의 토큰 관리

#### 문제점

```
❌ 기존 방식 (사용 불가)
┌─────────────────────────────────────────────────────────────┐
│  JavaScript에서 Cookie 직접 접근하여 JWT 파싱               │
│  → httpOnly 쿠키는 JavaScript에서 접근 불가!                │
└─────────────────────────────────────────────────────────────┘
```

#### 해결 방안

```
✅ 새로운 방식
┌─────────────────────────────────────────────────────────────┐
│  1. 서버에서 토큰과 함께 만료 시간(expiresAt)을 응답        │
│  2. 클라이언트는 만료 시간만 localStorage에 저장            │
│  3. 만료 여부는 저장된 expiresAt과 현재 시간 비교로 판별    │
│  4. 실제 토큰은 httpOnly 쿠키로 자동 전송                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Login API 응답 구조 (수정 필요)

```typescript
// POST /api/v1/auth/login
interface LoginResponse {
  httpStatus: number;
  message: string;
  data: {
    accessToken: string;           // JWT Access Token (httpOnly 쿠키로 설정됨)
    refreshToken: string;          // JWT Refresh Token (httpOnly 쿠키로 설정됨)
    accessTokenExpiresAt: number;  // ⭐ Access Token 만료 시간 (Unix timestamp)
    refreshTokenExpiresAt: number; // ⭐ Refresh Token 만료 시간 (Unix timestamp)
    mainTenantId: string;          // 메인 테넌트 ID
    user: {
      id: string;
      email: string;
      name: string;
      tenants: Array<{
        id: string;
        spaceId: string;           // ⭐ Space ID (첫 번째 사용)
        space: {
          id: string;
          ground: {                // ⭐ Ground 정보 (Space와 1:1 join)
            id: string;
            name: string;          // Ground 이름 (표시용)
            label: string | null;
          };
        };
      }>;
    };
  };
}
```

> **백엔드 수정 필요:**
> 1. `accessTokenExpiresAt`, `refreshTokenExpiresAt` 필드 추가
> 2. `user.tenants[].space.ground` join 추가 (별도 grounds API 호출 불필요)

### 3.4 데이터 관계 구조

```
┌─────────────────────────────────────────────────────────────────┐
│  Prisma 스키마 관계                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User ──── Tenant (Bridge) ──── Space ◄──── Ground (1:1)        │
│              │                    │            │                 │
│              └─ spaceId           │            └─ name, label    │
│                                   │               address, etc   │
│                                   │                              │
│  Space: 추상적 컨테이너 (ID만 존재)                               │
│  Ground: 구체화된 정보 (name, address, phone, email 등)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 포인트:**
- `/api/v1/grounds` 별도 호출 **불필요**
- Login 응답에서 `user.tenants[0].space.ground.name` 으로 Ground 이름 추출
- `spaceId`는 `user.tenants[0].spaceId` 사용

### 3.5 Store 구조 (수정)

#### PersistStore (영속 데이터 + 토큰 만료 시간 통합)

```typescript
// packages/store/src/stores/persistStore.ts
import { makeAutoObservable } from "mobx";

const TOKEN_BUFFER_MS = 30000; // 30초 버퍼 (네트워크 지연 고려)
const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5분

/**
 * PersistStore - 영속 데이터 및 인증 상태 통합 관리
 *
 * - Space/Ground 정보 (spaceId, groundName)
 * - 토큰 만료 시간 (httpOnly 쿠키 환경용, number 타입으로 단순 저장)
 * - localStorage 자동 동기화
 */
class PersistStore {
  // Space/Ground 정보
  spaceId: string | null = null;
  groundName: string | null = null;  // Ground의 name (표시용)

  // 토큰 만료 시간 (Unix timestamp, 실제 토큰은 httpOnly 쿠키에 저장)
  accessTokenExpiresAt: number | null = null;
  refreshTokenExpiresAt: number | null = null;

  constructor(config: { storageKey: string }) {
    makeAutoObservable(this);
    this.hydrate();
  }

  // === Space/Ground 관련 ===
  setSpace(spaceId: string, groundName: string): void {
    this.spaceId = spaceId;
    this.groundName = groundName;
    this.persist();
  }

  clearSpace(): void {
    this.spaceId = null;
    this.groundName = null;
    this.persist();
  }

  // === 토큰 만료 시간 관련 ===
  setTokenExpiries(accessExpiresAt: number, refreshExpiresAt: number): void {
    this.accessTokenExpiresAt = accessExpiresAt;
    this.refreshTokenExpiresAt = refreshExpiresAt;
    this.persist();
  }

  get isAccessTokenExpired(): boolean {
    if (!this.accessTokenExpiresAt) return true;
    return Date.now() >= this.accessTokenExpiresAt - TOKEN_BUFFER_MS;
  }

  get isRefreshTokenExpired(): boolean {
    if (!this.refreshTokenExpiresAt) return true;
    return Date.now() >= this.refreshTokenExpiresAt - TOKEN_BUFFER_MS;
  }

  get isAuthenticated(): boolean {
    return !this.isAccessTokenExpired;
  }

  get needsTokenRefresh(): boolean {
    if (!this.accessTokenExpiresAt) return false;
    const remaining = this.accessTokenExpiresAt - Date.now();
    return remaining > 0 && remaining <= TOKEN_REFRESH_THRESHOLD_MS;
  }

  // === 전체 초기화 (로그아웃) ===
  clear(): void {
    this.spaceId = null;
    this.groundName = null;
    this.accessTokenExpiresAt = null;
    this.refreshTokenExpiresAt = null;
    this.persist();
  }

  // localStorage 동기화는 기존 구현 유지
  private hydrate(): void { /* ... */ }
  private persist(): void { /* ... */ }
}
```

**단순화 장점:**
- VO 없이 number 타입으로 직접 비교 (불필요한 추상화 제거)
- Store 하나에서 모든 영속 데이터 통합 관리
- 로그아웃 시 `clear()` 한 번으로 모든 상태 초기화

---

## 4. 인터랙션 정의

### 4.1 로그인 흐름

| 단계 | 사용자 액션 | 시스템 반응 |
|------|------------|------------|
| 1 | 이메일 입력 | state.email 업데이트 |
| 2 | 비밀번호 입력 | state.password 업데이트 |
| 3 | 로그인 버튼 클릭 | 입력값 검증 (Zod Schema) |
| 4 | - | POST /api/v1/auth/login 호출 |
| 5 | - | 성공: 토큰 Cookie 저장 |
| 6 | - | 성공: Space 자동 선택 (tenants[0]) |
| 7 | - | 성공: PersistStore에 spaceId 저장 |
| 8 | - | 성공: 대시보드(/)로 이동 |
| 9 | - | 실패: 에러 메시지 표시 |

### 4.2 Space 자동 선택 로직

```typescript
// 로그인 성공 후 실행
async function handleLoginSuccess(response: LoginResponse) {
  const {
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    user
  } = response.data;

  // 1. 토큰 만료 시간 저장 (실제 토큰은 httpOnly 쿠키로 자동 저장됨)
  persistStore.setTokenExpiries(accessTokenExpiresAt, refreshTokenExpiresAt);

  // 2. Space 자동 선택 (첫 번째 tenant 사용)
  const firstTenant = user.tenants[0];
  if (firstTenant?.space?.ground) {
    const { spaceId, space } = firstTenant;
    const groundName = space.ground.name;

    // PersistStore에 저장 (x-space-id 헤더용)
    persistStore.setSpace(spaceId, groundName);
  } else {
    // Space/Ground가 없는 경우 alert 표시
    alert('Space를 선택해주세요.');
    router.push('/select-space');
    return;
  }

  // 3. 대시보드로 이동
  router.push('/');
}
```

**로그인 성공 후 데이터 흐름:**

```
Login API 응답
    │
    ├─ accessTokenExpiresAt ───► PersistStore (만료 시간 저장)
    ├─ refreshTokenExpiresAt ──► PersistStore
    │
    └─ user.tenants[0]
         ├─ spaceId ───────────► PersistStore.spaceId
         └─ space.ground.name ─► PersistStore.groundName
```

### 4.3 API 요청 헤더 설정

```typescript
// packages/api/src/libs/customAxios.ts
AXIOS_INSTANCE.interceptors.request.use((config) => {
  // spaceId 헤더 추가
  const spaceId = persistStore.spaceId;
  if (spaceId) {
    config.headers['x-space-id'] = spaceId;
  }

  return config;
});
```

### 4.4 Space 미선택 처리

```typescript
// 모든 보호된 페이지 진입 시 체크
function checkSpaceSelection() {
  const spaceId = persistStore.spaceId;

  if (!spaceId) {
    // Alert 표시
    showAlert({
      title: 'Space 선택 필요',
      message: '서비스 이용을 위해 Space를 선택해주세요.',
      confirmText: 'Space 선택하기',
      onConfirm: () => router.push('/select-space'),
    });
    return false;
  }

  return true;
}
```

---

## 5. 구현 필요 사항

### 5.1 백엔드 수정 필요 (선행 조건)

| 우선순위 | 작업 | 설명 |
|:--------:|------|------|
| 0 | Login API 응답 수정 | `accessTokenExpiresAt`, `refreshTokenExpiresAt` 필드 추가 |

### 5.2 신규 생성이 필요한 파일

| 우선순위 | 파일 | 설명 |
|:--------:|------|------|
| 1 | `apps/admin/src/hooks/useSpaceGuard.ts` | Space 선택 여부 확인 훅 |
| 2 | `packages/ui/src/components/widget/SpaceAlert/SpaceAlert.tsx` | Space 선택 Alert 컴포넌트 |

### 5.3 수정이 필요한 파일

| 우선순위 | 파일 | 작업 내용 |
|:--------:|------|----------|
| 1 | `packages/store/src/stores/persistStore.ts` | 토큰 만료 시간 필드 및 메서드 추가 |
| 2 | `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx` | 로그인 성공 후 만료 시간 저장 및 Space 자동 선택 |
| 3 | `packages/api/src/libs/customAxios.ts` | x-space-id 헤더 인터셉터 추가 |
| 4 | `apps/admin/app/(admin)/layout.tsx` | Space 미선택 시 Alert 표시 |

---

## 6. 상세 구현 명세

### 6.1 useAuthLoginPage 수정

**파일:** `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx`

```typescript
// 기존 코드에 추가할 내용

import { usePersistStore } from "@/stores/AppStoreProvider";

export function useAuthLoginPage() {
  const router = useRouter();
  const persistStore = usePersistStore();

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (response) => {
        const {
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
          user
        } = response.data!;

        // 1. 토큰 만료 시간 저장 (실제 토큰은 httpOnly 쿠키로 자동 저장됨)
        persistStore?.setTokenExpiries(accessTokenExpiresAt, refreshTokenExpiresAt);

        // 2. Space 자동 선택 (첫 번째 tenant 사용)
        const firstTenant = user.tenants?.[0];
        if (firstTenant?.spaceId && firstTenant?.space?.ground) {
          const groundName = firstTenant.space.ground.name;
          persistStore?.setSpace(firstTenant.spaceId, groundName);
          // 3. 대시보드로 이동
          router.push("/");
        } else {
          // Space/Ground가 없는 경우
          alert("Space를 선택해주세요.");
          router.push("/select-space");
        }
      },
      onError: (error) => {
        runInAction(() => {
          state.errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
        });
      },
    },
  });

  // ... 나머지 코드
}
```

### 6.2 x-space-id 헤더 인터셉터

**파일:** `packages/api/src/libs/customAxios.ts`

```typescript
import { AXIOS_INSTANCE } from "./customAxios";

// Store 참조를 위한 변수 (앱 초기화 시 설정)
let persistStoreRef: { spaceId: string | null } | null = null;

export function setApiPersistStore(store: { spaceId: string | null }) {
  persistStoreRef = store;
}

// Request 인터셉터: x-space-id 헤더 추가
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    // spaceId가 있으면 헤더에 추가
    if (persistStoreRef?.spaceId) {
      config.headers["x-space-id"] = persistStoreRef.spaceId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### 6.3 useSpaceGuard 훅

**파일:** `apps/admin/src/hooks/useSpaceGuard.ts`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePersistStore } from "@/stores/AppStoreProvider";

export function useSpaceGuard() {
  const router = useRouter();
  const persistStore = usePersistStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // spaceId가 없으면 Alert 표시
    if (!persistStore?.spaceId) {
      setShowAlert(true);
    }
  }, [persistStore?.spaceId]);

  const handleConfirm = () => {
    setShowAlert(false);
    router.push("/select-space");
  };

  return {
    showAlert,
    handleConfirm,
    hasSpace: !!persistStore?.spaceId,
  };
}
```

### 6.4 Admin Layout에 Space Guard 적용

**파일:** `apps/admin/app/(admin)/layout.tsx`

```typescript
"use client";

import { useSpaceGuard } from "@/hooks/useSpaceGuard";
import { SpaceAlert } from "@cocrepo/ui";
// ... 기존 imports

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { showAlert, handleConfirm } = useSpaceGuard();

  return (
    <PageLayout
      header={...}
      leftAside={<SideNav />}
    >
      {children}

      {/* Space 미선택 Alert */}
      {showAlert && (
        <SpaceAlert
          title="Space 선택 필요"
          message="서비스 이용을 위해 Space를 선택해주세요."
          onConfirm={handleConfirm}
        />
      )}
    </PageLayout>
  );
}
```

---

## 7. 테스트 시나리오

### 7.1 단위 테스트

#### PersistStore 테스트

```typescript
describe('PersistStore', () => {
  let persistStore: PersistStore;

  beforeEach(() => {
    localStorage.clear();
    persistStore = new PersistStore({ storageKey: 'test' });
  });

  describe('Space 관리', () => {
    it('spaceId와 groundName을 저장할 수 있다', () => {
      // Given & When
      persistStore.setSpace('space-123', 'Test Ground');

      // Then
      expect(persistStore.spaceId).toBe('space-123');
      expect(persistStore.groundName).toBe('Test Ground');
    });

    it('Space 정보를 삭제할 수 있다', () => {
      // Given
      persistStore.setSpace('space-123', 'Test Ground');

      // When
      persistStore.clearSpace();

      // Then
      expect(persistStore.spaceId).toBeNull();
    });
  });

  describe('토큰 만료 시간 관리', () => {
    it('토큰 만료 시간을 저장할 수 있다', () => {
      // Given
      const accessExpiresAt = Date.now() + 60 * 60 * 1000;
      const refreshExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      // When
      persistStore.setTokenExpiries(accessExpiresAt, refreshExpiresAt);

      // Then
      expect(persistStore.isAuthenticated).toBe(true);
      expect(persistStore.isAccessTokenExpired).toBe(false);
    });

    it('만료된 토큰 상태를 감지할 수 있다', () => {
      // Given
      const expiredTime = Date.now() - 1000; // 과거

      // When
      persistStore.setTokenExpiries(expiredTime, expiredTime);

      // Then
      expect(persistStore.isAuthenticated).toBe(false);
      expect(persistStore.isAccessTokenExpired).toBe(true);
    });
  });

  describe('전체 초기화 (로그아웃)', () => {
    it('clear() 호출 시 모든 상태가 초기화된다', () => {
      // Given
      persistStore.setSpace('space-123', 'Test Ground');
      persistStore.setTokenExpiries(Date.now() + 10000, Date.now() + 10000);

      // When
      persistStore.clear();

      // Then
      expect(persistStore.spaceId).toBeNull();
      expect(persistStore.groundName).toBeNull();
      expect(persistStore.isAuthenticated).toBe(false);
    });
  });

  describe('localStorage 동기화', () => {
    it('모든 데이터가 localStorage에 저장된다', () => {
      // Given & When
      persistStore.setSpace('space-123', 'Test Ground');
      persistStore.setTokenExpiries(Date.now() + 10000, Date.now() + 10000);

      // Then
      const stored = JSON.parse(localStorage.getItem('test') || '{}');
      expect(stored.spaceId).toBe('space-123');
      expect(stored.accessTokenExpiresAt).toBeDefined();
    });
  });
});
```

#### useAuthLoginPage 테스트

```typescript
describe('useAuthLoginPage', () => {
  const mockLoginResponse = {
    data: {
      accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
      refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      user: {
        tenants: [{
          spaceId: 'space-1',
          space: {
            id: 'space-1',
            ground: { id: 'ground-1', name: 'Ground 1', label: null }
          }
        }]
      },
    },
  };

  it('로그인 성공 시 토큰 만료 시간이 저장된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue(mockLoginResponse);

    // When
    await act(async () => {
      result.current.state.email = 'test@test.com';
      result.current.state.password = 'password123';
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockPersistStore.setTokenExpiries).toHaveBeenCalledWith(
      mockLoginResponse.data.accessTokenExpiresAt,
      mockLoginResponse.data.refreshTokenExpiresAt
    );
  });

  it('로그인 성공 시 첫 번째 Space/Ground가 자동 선택된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue(mockLoginResponse);

    // When
    await act(async () => {
      result.current.state.email = 'test@test.com';
      result.current.state.password = 'password123';
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockPersistStore.setSpace).toHaveBeenCalledWith('space-1', 'Ground 1');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('로그인 실패 시 에러 메시지가 표시된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockRejectedValue(new Error('Invalid credentials'));

    // When
    await act(async () => {
      await result.current.onClickLoginButton();
    });

    // Then
    expect(result.current.state.errorMessage).toBeTruthy();
  });

  it('Space/Ground가 없으면 선택 페이지로 이동한다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue({
      data: {
        ...mockLoginResponse.data,
        user: { tenants: [] }, // 빈 tenants
      },
    });

    // When
    await act(async () => {
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockRouter.push).toHaveBeenCalledWith('/select-space');
  });
});
```

### 7.2 통합 테스트

#### API 인터셉터 테스트

```typescript
describe('AXIOS_INSTANCE 인터셉터', () => {
  it('spaceId가 있으면 x-space-id 헤더가 추가된다', async () => {
    // Given
    setApiPersistStore({ spaceId: 'space-123' });

    // When
    await AXIOS_INSTANCE.get('/api/v1/test');

    // Then
    expect(mockAxios.lastRequest.headers['x-space-id']).toBe('space-123');
  });

  it('spaceId가 없으면 x-space-id 헤더가 추가되지 않는다', async () => {
    // Given
    setApiPersistStore({ spaceId: null });

    // When
    await AXIOS_INSTANCE.get('/api/v1/test');

    // Then
    expect(mockAxios.lastRequest.headers['x-space-id']).toBeUndefined();
  });
});
```

#### 로그인 플로우 통합 테스트

```typescript
describe('로그인 플로우 통합 테스트', () => {
  it('전체 로그인 흐름이 정상 동작한다', async () => {
    // Given
    render(<LoginPage />);

    // When - 로그인 정보 입력
    await userEvent.type(screen.getByLabelText('이메일'), 'admin@test.com');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    // Then
    await waitFor(() => {
      // 1. 토큰 만료 시간이 localStorage에 저장됨 (httpOnly 쿠키는 JS에서 접근 불가)
      expect(localStorage.getItem('auth-token-expiry')).toBeTruthy();
      const tokenExpiry = JSON.parse(localStorage.getItem('auth-token-expiry')!);
      expect(tokenExpiry.accessExpiresAt).toBeGreaterThan(Date.now());

      // 2. spaceId가 localStorage에 저장됨
      expect(localStorage.getItem('admin-persist')).toContain('spaceId');

      // 3. 대시보드로 이동
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });
});
```

### 7.3 E2E 테스트 (Playwright)

```typescript
describe('관리자 로그인 E2E', () => {
  test('정상 로그인 후 대시보드 진입', async ({ page }) => {
    // Given
    await page.goto('/auth/login');

    // When
    await page.fill('[name="email"]', 'admin@cocdev.co.kr');
    await page.fill('[name="password"]', 'Admin123!');
    await page.click('button:has-text("로그인")');

    // Then
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=대시보드')).toBeVisible();
  });

  test('잘못된 비밀번호로 로그인 실패', async ({ page }) => {
    // Given
    await page.goto('/auth/login');

    // When
    await page.fill('[name="email"]', 'admin@cocdev.co.kr');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button:has-text("로그인")');

    // Then
    await expect(page.locator('text=이메일 또는 비밀번호가 올바르지 않습니다')).toBeVisible();
  });

  test('Space 미선택 시 Alert 표시', async ({ page }) => {
    // Given - Space 없이 로그인된 상태 시뮬레이션
    await page.evaluate(() => {
      localStorage.removeItem('admin-persist');
    });

    // When
    await page.goto('/');

    // Then
    await expect(page.locator('text=Space 선택 필요')).toBeVisible();
  });

  test('API 요청에 x-space-id 헤더 포함', async ({ page }) => {
    // Given - 로그인 및 Space 선택 완료
    await login(page);

    // When - API 호출하는 페이지 진입
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes('/api/v1/')),
      page.goto('/members'),
    ]);

    // Then
    expect(request.headers()['x-space-id']).toBeTruthy();
  });
});
```

---

## 8. 보안 고려사항

### 8.1 토큰 저장 (httpOnly 쿠키 환경)

| 항목 | 저장 위치 | 설정 | 비고 |
|------|----------|------|------|
| accessToken | Cookie (서버 설정) | httpOnly, secure, sameSite: strict | JS 접근 불가 |
| refreshToken | Cookie (서버 설정) | httpOnly, secure, sameSite: strict | JS 접근 불가 |
| accessTokenExpiresAt | localStorage | - | 만료 시간만 저장 |
| refreshTokenExpiresAt | localStorage | - | 만료 시간만 저장 |
| spaceId | localStorage | - | PersistStore 관리 |

### 8.2 httpOnly 쿠키의 장점

```
┌─────────────────────────────────────────────────────────────┐
│  httpOnly 쿠키 보안 이점                                      │
├─────────────────────────────────────────────────────────────┤
│  ✅ XSS 공격으로부터 토큰 탈취 방지                           │
│  ✅ JavaScript에서 직접 접근 불가                             │
│  ✅ 브라우저가 자동으로 요청에 포함                           │
│  ✅ CSRF 방지 (sameSite: strict)                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 인터셉터 보안

- 401 응답 시 자동 로그아웃 처리 (PersistStore.clear 호출)
- refreshToken으로 자동 갱신 (백엔드 API 필요)
- CSRF 방지를 위한 sameSite: strict 설정 (백엔드에서 쿠키 설정 시)

---

## 9. 파일 경로 요약

### 기존 파일 (수정 필요)

| 파일 | 작업 |
|------|------|
| `packages/vo/src/auth/token/index.ts` | TokenExpiry export 추가 |
| `packages/store/src/stores/persistStore.ts` | 토큰 만료 시간 필드 및 메서드 추가 |
| `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx` | 토큰 만료 시간 저장 + Space 선택 로직 추가 |
| `packages/api/src/libs/customAxios.ts` | x-space-id 인터셉터 추가 |
| `apps/admin/app/(admin)/layout.tsx` | Space Guard 적용 |

### 신규 파일

| 파일 | 설명 |
|------|------|
| `apps/admin/src/hooks/useSpaceGuard.ts` | Space 선택 확인 훅 |
| `packages/ui/src/components/widget/SpaceAlert/SpaceAlert.tsx` | Space 선택 Alert |

---

## 10. 구현 우선순위

1. **PersistStore 수정** - 토큰 만료 시간 필드 및 메서드 추가
2. **useAuthLoginPage 수정** - 로그인 성공 후 토큰 저장 및 Space 자동 선택
3. **x-space-id 인터셉터 추가** - 모든 API 요청에 헤더 설정
4. **useSpaceGuard 훅 생성** - Space 미선택 감지
5. **SpaceAlert 컴포넌트 생성** - Alert UI
6. **Admin Layout 수정** - Space Guard 적용
7. **테스트 코드 작성** - 단위/통합/E2E 테스트

---

**문서 끝**
