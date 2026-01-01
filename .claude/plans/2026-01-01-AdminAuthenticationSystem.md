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
    selectedSpaceId: string | null; // ⭐ 마지막 선택한 Space ID (User.selectedSpaceId)
    user: {
      id: string;
      email: string;
      name: string;
      selectedSpaceId: string | null; // ⭐ User 레벨에도 포함
      tenants: Array<{
        id: string;
        spaceId: string;           // Space ID
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

> **selectedSpaceId 우선순위:**
> 1. `selectedSpaceId`가 있으면 해당 Space 사용 (마지막 선택 복원)
> 2. `selectedSpaceId`가 null이면 `tenants[0].spaceId` 사용 (첫 로그인)

> **백엔드 수정 필요:**
> 1. `accessTokenExpiresAt`, `refreshTokenExpiresAt` 필드 추가
> 2. `user.tenants[].space.ground` join 추가 (별도 grounds API 호출 불필요)
> 3. `selectedSpaceId` 필드 추가 (User.selectedSpaceId 반환)

### 3.4 데이터 관계 구조

```
┌─────────────────────────────────────────────────────────────────┐
│  Prisma 스키마 관계                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User ──┬── selectedSpaceId ───────► Space (현재 작업 중인 공간) │
│         │                              │                         │
│         └── Tenant (Bridge) ──────► Space ◄──── Ground (1:1)    │
│               │                        │            │            │
│               └─ spaceId, roleId       │            └─ name 등   │
│                                        │                         │
│  User.selectedSpaceId: 현재 선택된 Space (작업 상태)             │
│  Tenant: 접근 가능한 Space + Role 목록 (권한/자격)               │
│  Space: 추상적 컨테이너 (ID만 존재)                               │
│  Ground: 구체화된 정보 (name, address, phone, email 등)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 포인트:**
- `User.selectedSpaceId`: 마지막으로 선택한 Space (DB 저장)
- `/api/v1/grounds` 별도 호출 **불필요**
- Login 응답에서 `selectedSpaceId` 또는 `user.tenants[0].spaceId` 사용
- **개념 분리**: Tenant는 "권한", selectedSpaceId는 "현재 상태"

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
  /**
   * Space 설정
   * @param spaceId - Space ID (null = "전체" 선택, 슈퍼매니저만 가능)
   * @param groundName - 표시용 Ground 이름 ("전체" 또는 실제 이름)
   */
  setSpace(spaceId: string | null, groundName: string): void {
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

### 4.0 슈퍼매니저 권한 및 "전체" Space 선택

#### 슈퍼매니저 (SuperManager) 개념

```
┌─────────────────────────────────────────────────────────────────┐
│  권한 레벨 구조                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [슈퍼매니저]                                                      │
│      │                                                           │
│      ├── 모든 Space의 리소스 조회 가능                              │
│      ├── Space 선택 시 "전체" 옵션 사용 가능                        │
│      └── X-Space-ID: undefined → 모든 리소스 조회                  │
│                                                                  │
│  [일반 매니저]                                                     │
│      │                                                           │
│      ├── 소속된 Space의 리소스만 조회 가능                          │
│      ├── Space 선택 시 "전체" 옵션 없음                            │
│      └── X-Space-ID: 반드시 spaceId 필수                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### SpaceSelector 컴포넌트

```
┌────────────────────────────────────────┐
│  [SpaceSelector 드롭다운]                │
├────────────────────────────────────────┤
│                                         │
│  슈퍼매니저인 경우:                       │
│  ┌──────────────────────────────────┐   │
│  │  ▼  전체                          │   │  ← X-Space-ID: undefined
│  │     ──────────────────────────   │   │
│  │     Ground A                     │   │  ← X-Space-ID: space-a-id
│  │     Ground B                     │   │  ← X-Space-ID: space-b-id
│  │     Ground C                     │   │  ← X-Space-ID: space-c-id
│  └──────────────────────────────────┘   │
│                                         │
│  일반 매니저인 경우:                       │
│  ┌──────────────────────────────────┐   │
│  │  ▼  Ground A                     │   │  ← X-Space-ID: space-a-id
│  │     ──────────────────────────   │   │
│  │     Ground B                     │   │  ← X-Space-ID: space-b-id
│  └──────────────────────────────────┘   │
│                                         │
└────────────────────────────────────────┘
```

#### 백엔드 처리 로직

```typescript
// 백엔드 Request Context Interceptor 로직
function handleSpaceId(request: Request, user: User) {
  const spaceId = request.headers['x-space-id'];

  if (spaceId === undefined || spaceId === '') {
    // X-Space-ID가 undefined인 경우
    if (user.isSuperManager) {
      // 슈퍼매니저: 모든 리소스 조회 허용
      return { spaceId: null, queryAllSpaces: true };
    } else {
      // 일반 매니저: 에러 반환 (Space 선택 필수)
      throw new ForbiddenException('Space 선택이 필요합니다.');
    }
  } else {
    // X-Space-ID가 있는 경우: 해당 Space 리소스만 조회
    return { spaceId, queryAllSpaces: false };
  }
}
```

#### Repository 레이어 처리 예시

```typescript
// 슈퍼매니저의 "전체" 선택 시 Repository 쿼리 예시
async findMembers(context: RequestContext) {
  const where: Prisma.UserWhereInput = {};

  if (context.queryAllSpaces) {
    // 슈퍼매니저 + 전체 선택: Space 필터 없이 조회
    // where.spaceId 조건 생략
  } else {
    // 특정 Space 선택: 해당 Space만 조회
    where.tenants = { some: { spaceId: context.spaceId } };
  }

  return this.prisma.user.findMany({ where });
}
```

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
    selectedSpaceId,
    user
  } = response.data;

  // 1. 토큰 만료 시간 저장 (실제 토큰은 httpOnly 쿠키로 자동 저장됨)
  persistStore.setTokenExpiries(accessTokenExpiresAt, refreshTokenExpiresAt);

  // 2. Space 선택 (selectedSpaceId 우선, 없으면 첫 번째 tenant)
  let targetTenant: Tenant | undefined;

  if (selectedSpaceId) {
    // DB에 저장된 마지막 선택 Space 복원
    targetTenant = user.tenants.find(t => t.spaceId === selectedSpaceId);
  }

  if (!targetTenant) {
    // selectedSpaceId가 없거나 유효하지 않으면 첫 번째 tenant 사용
    targetTenant = user.tenants[0];
  }

  if (targetTenant?.space?.ground) {
    const { spaceId, space } = targetTenant;
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
    ├─ selectedSpaceId ────────► Space 선택 기준 (우선순위 1)
    │       │
    │       ▼
    │   user.tenants에서 해당 spaceId를 가진 tenant 찾기
    │       │
    │       └─ 없으면 user.tenants[0] 사용 (우선순위 2)
    │
    └─ targetTenant
         ├─ spaceId ───────────► PersistStore.spaceId
         └─ space.ground.name ─► PersistStore.groundName
```

### 4.3 API 요청 헤더 설정

```typescript
// packages/api/src/libs/customAxios.ts
AXIOS_INSTANCE.interceptors.request.use((config) => {
  // spaceId 헤더 추가
  // - spaceId가 있으면: 해당 Space의 리소스만 조회
  // - spaceId가 null/undefined이면: 헤더를 보내지 않음 (슈퍼매니저의 "전체" 선택)
  const spaceId = persistStore.spaceId;
  if (spaceId) {
    config.headers['x-space-id'] = spaceId;
  }
  // spaceId가 null/undefined인 경우 헤더를 설정하지 않음
  // → 백엔드에서 슈퍼매니저인 경우 모든 리소스 조회 허용

  return config;
});
```

> **"전체" 선택 시 헤더 동작:**
> - `spaceId = null` → `X-Space-ID` 헤더 미포함 → 백엔드에서 슈퍼매니저 확인 후 전체 조회
> - `spaceId = 'space-123'` → `X-Space-ID: space-123` → 해당 Space만 조회

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
| 0-1 | Prisma 스키마 수정 | `User.selectedSpaceId` 필드 추가 |
| 0-2 | Login API 응답 수정 | `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `selectedSpaceId` 필드 추가 |
| 0-3 | Space 변경 API 추가 | `PATCH /api/v1/users/me/selected-space` 엔드포인트 추가 |

#### Prisma 스키마 변경

```prisma
// packages/prisma/schema/user.prisma
model User {
  // ... 기존 필드들
  selectedSpaceId  String?   @map("selected_space_id")
  selectedSpace    Space?    @relation("UserSelectedSpace", fields: [selectedSpaceId], references: [id])
  // ...
}
```

#### Space 변경 API

```typescript
// PATCH /api/v1/users/me/selected-space
// Request Body
interface UpdateSelectedSpaceRequest {
  spaceId: string;
}

// Response
interface UpdateSelectedSpaceResponse {
  httpStatus: number;
  message: string;
  data: {
    selectedSpaceId: string;
  };
}
```

**호출 시점:**
- 사용자가 헤더의 Space 드롭다운에서 다른 Space를 선택할 때
- Space 선택 페이지(`/select-space`)에서 Space를 선택할 때

### 5.2 신규 생성이 필요한 파일

| 우선순위 | 파일 | 설명 |
|:--------:|------|------|
| 1 | `apps/admin/src/hooks/useSpaceGuard.ts` | Space 선택 여부 확인 훅 |
| 2 | `apps/admin/src/hooks/useChangeSpace.ts` | Space 변경 훅 (API 호출 + Store 업데이트) |
| 3 | `packages/ui/src/components/feature/SpaceSelector/SpaceSelector.tsx` | Space 선택 드롭다운 (슈퍼매니저용 "전체" 포함) |
| 4 | `packages/ui/src/components/widget/SpaceAlert/SpaceAlert.tsx` | Space 선택 Alert 컴포넌트 |

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
          selectedSpaceId,  // ⭐ 마지막 선택한 Space
          user
        } = response.data!;

        // 1. 토큰 만료 시간 저장 (실제 토큰은 httpOnly 쿠키로 자동 저장됨)
        persistStore?.setTokenExpiries(accessTokenExpiresAt, refreshTokenExpiresAt);

        // 2. Space 선택 (selectedSpaceId 우선, 없으면 첫 번째 tenant)
        let targetTenant = selectedSpaceId
          ? user.tenants?.find(t => t.spaceId === selectedSpaceId)
          : undefined;

        if (!targetTenant) {
          targetTenant = user.tenants?.[0];
        }

        if (targetTenant?.spaceId && targetTenant?.space?.ground) {
          const groundName = targetTenant.space.ground.name;
          persistStore?.setSpace(targetTenant.spaceId, groundName);
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

### 6.4 useChangeSpace 훅 (Space 변경)

**파일:** `apps/admin/src/hooks/useChangeSpace.ts`

```typescript
"use client";

import { useCallback } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";
import { useUpdateSelectedSpace } from "@cocrepo/api";

interface UseChangeSpaceOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Space 변경 훅
 * - API 호출로 DB에 selectedSpaceId 저장
 * - PersistStore 업데이트 (x-space-id 헤더용)
 */
export function useChangeSpace(options?: UseChangeSpaceOptions) {
  const persistStore = usePersistStore();

  const mutation = useUpdateSelectedSpace({
    mutation: {
      onSuccess: (response) => {
        options?.onSuccess?.();
      },
      onError: (error) => {
        options?.onError?.(error);
      },
    },
  });

  const changeSpace = useCallback(
    async (spaceId: string, groundName: string) => {
      // 1. API 호출 (DB 저장)
      await mutation.mutateAsync({ data: { spaceId } });

      // 2. PersistStore 업데이트 (x-space-id 헤더용)
      persistStore?.setSpace(spaceId, groundName);
    },
    [mutation, persistStore]
  );

  return {
    changeSpace,
    isLoading: mutation.isPending,
  };
}
```

### 6.5 SpaceSelector 컴포넌트 (슈퍼매니저용 "전체" 포함)

**파일:** `packages/ui/src/components/feature/SpaceSelector/SpaceSelector.tsx`

```typescript
"use client";

import { observer } from "mobx-react-lite";

/**
 * SpaceItem - 선택 가능한 Space 정보
 */
interface SpaceItem {
  spaceId: string | null;  // null = "전체" 선택
  groundName: string;
}

interface SpaceSelectorProps {
  /** 선택 가능한 Space 목록 (tenants에서 추출) */
  spaces: SpaceItem[];
  /** 현재 선택된 spaceId (null = "전체") */
  selectedSpaceId: string | null;
  /** 슈퍼매니저 여부 (true면 "전체" 옵션 표시) */
  isSuperManager: boolean;
  /** Space 선택 시 콜백 */
  onSelectSpace: (spaceId: string | null, groundName: string) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * SpaceSelector - Space 선택 드롭다운
 *
 * - 슈퍼매니저: "전체" 옵션 + Space 목록
 * - 일반 매니저: Space 목록만 표시
 */
export const SpaceSelector = observer(function SpaceSelector({
  spaces,
  selectedSpaceId,
  isSuperManager,
  onSelectSpace,
  isLoading = false,
}: SpaceSelectorProps) {
  // 현재 선택된 항목의 표시 텍스트
  const selectedLabel =
    selectedSpaceId === null
      ? "전체"
      : spaces.find((s) => s.spaceId === selectedSpaceId)?.groundName ?? "선택";

  const handleSelect = (spaceId: string | null, groundName: string) => {
    onSelectSpace(spaceId, groundName);
  };

  return (
    <Dropdown>
      <DropdownTrigger disabled={isLoading}>
        <Text>{selectedLabel}</Text>
        <ChevronDownIcon />
      </DropdownTrigger>
      <DropdownContent>
        {/* 슈퍼매니저인 경우 "전체" 옵션 표시 */}
        {isSuperManager && (
          <>
            <DropdownItem
              key="all"
              onClick={() => handleSelect(null, "전체")}
              selected={selectedSpaceId === null}
            >
              <Text>전체</Text>
            </DropdownItem>
            <DropdownSeparator />
          </>
        )}

        {/* Space 목록 */}
        {spaces.map((space) => (
          <DropdownItem
            key={space.spaceId}
            onClick={() => handleSelect(space.spaceId, space.groundName)}
            selected={selectedSpaceId === space.spaceId}
          >
            <Text>{space.groundName}</Text>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
});
```

### 6.6 SpaceSelector 사용 예시 (헤더)

**파일:** `apps/admin/src/components/Header/HeaderSpaceSelector.tsx`

```typescript
"use client";

import { observer } from "mobx-react-lite";
import { SpaceSelector } from "@cocrepo/ui";
import { useChangeSpace } from "@/hooks/useChangeSpace";
import { usePersistStore, useUserStore } from "@/stores/AppStoreProvider";

/**
 * HeaderSpaceSelector - 헤더에 표시되는 Space 선택 컴포넌트
 */
export const HeaderSpaceSelector = observer(function HeaderSpaceSelector() {
  const persistStore = usePersistStore();
  const userStore = useUserStore();

  const { changeSpace, isLoading } = useChangeSpace({
    onSuccess: () => {
      // Space 변경 후 현재 페이지 데이터 새로고침
      window.location.reload();
    },
  });

  // tenants에서 SpaceItem 배열 생성
  const spaces = userStore?.user?.tenants?.map((tenant) => ({
    spaceId: tenant.spaceId,
    groundName: tenant.space?.ground?.name ?? "Unknown",
  })) ?? [];

  const handleSelectSpace = (spaceId: string | null, groundName: string) => {
    // spaceId가 null이면 "전체" 선택 (슈퍼매니저만 가능)
    changeSpace(spaceId, groundName);
  };

  return (
    <SpaceSelector
      spaces={spaces}
      selectedSpaceId={persistStore?.spaceId ?? null}
      isSuperManager={userStore?.isSuperManager ?? false}
      onSelectSpace={handleSelectSpace}
      isLoading={isLoading}
    />
  );
});
```

### 6.7 useChangeSpace 훅 수정 ("전체" 지원)

**파일:** `apps/admin/src/hooks/useChangeSpace.ts`

```typescript
"use client";

import { useCallback } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";
import { useUpdateSelectedSpace } from "@cocrepo/api";

interface UseChangeSpaceOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Space 변경 훅 (슈퍼매니저의 "전체" 선택 지원)
 *
 * - spaceId가 string: 해당 Space 선택 → X-Space-ID: spaceId
 * - spaceId가 null: "전체" 선택 → X-Space-ID: 헤더 미포함 (슈퍼매니저만)
 */
export function useChangeSpace(options?: UseChangeSpaceOptions) {
  const persistStore = usePersistStore();

  const mutation = useUpdateSelectedSpace({
    mutation: {
      onSuccess: () => {
        options?.onSuccess?.();
      },
      onError: (error) => {
        options?.onError?.(error);
      },
    },
  });

  const changeSpace = useCallback(
    async (spaceId: string | null, groundName: string) => {
      // 1. API 호출 (DB 저장) - "전체"면 null 전송
      await mutation.mutateAsync({ data: { spaceId } });

      // 2. PersistStore 업데이트
      // - spaceId가 null: "전체" 선택 → API 인터셉터에서 X-Space-ID 헤더 미포함
      // - spaceId가 string: 특정 Space 선택 → X-Space-ID: spaceId
      persistStore?.setSpace(spaceId, groundName);
    },
    [mutation, persistStore]
  );

  return {
    changeSpace,
    isLoading: mutation.isPending,
  };
}
```

### 6.8 Admin Layout에 Space Guard 적용

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
      selectedSpaceId: null,  // 첫 로그인
      user: {
        tenants: [
          {
            spaceId: 'space-1',
            space: {
              id: 'space-1',
              ground: { id: 'ground-1', name: 'Ground 1', label: null }
            }
          },
          {
            spaceId: 'space-2',
            space: {
              id: 'space-2',
              ground: { id: 'ground-2', name: 'Ground 2', label: null }
            }
          }
        ]
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

  it('selectedSpaceId가 없으면 첫 번째 tenant가 선택된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue(mockLoginResponse); // selectedSpaceId: null

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

  it('selectedSpaceId가 있으면 해당 Space가 선택된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue({
      data: {
        ...mockLoginResponse.data,
        selectedSpaceId: 'space-2',  // 마지막 선택한 Space
      },
    });

    // When
    await act(async () => {
      result.current.state.email = 'test@test.com';
      result.current.state.password = 'password123';
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockPersistStore.setSpace).toHaveBeenCalledWith('space-2', 'Ground 2');
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
        selectedSpaceId: null,
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
| `packages/store/src/stores/persistStore.ts` | 토큰 만료 시간 필드 및 메서드 추가 |
| `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx` | 토큰 만료 시간 저장 + Space 선택 로직 추가 |
| `packages/api/src/libs/customAxios.ts` | x-space-id 인터셉터 추가 |
| `apps/admin/app/(admin)/layout.tsx` | Space Guard 적용 |

### 신규 파일

| 파일 | 설명 |
|------|------|
| `apps/admin/src/hooks/useSpaceGuard.ts` | Space 선택 확인 훅 |
| `apps/admin/src/hooks/useChangeSpace.ts` | Space 변경 훅 (null 지원) |
| `packages/ui/src/components/feature/SpaceSelector/SpaceSelector.tsx` | Space 선택 드롭다운 ("전체" 포함) |
| `apps/admin/src/components/Header/HeaderSpaceSelector.tsx` | 헤더용 SpaceSelector 래퍼 |
| `packages/ui/src/components/widget/SpaceAlert/SpaceAlert.tsx` | Space 선택 Alert |

---

## 10. 구현 우선순위

### 백엔드 (선행 조건)

| 순서 | 작업 | 설명 |
|:----:|------|------|
| 0-1 | Prisma 스키마 수정 | `User.selectedSpaceId` 필드 추가 및 마이그레이션 |
| 0-2 | Login API 응답 수정 | `selectedSpaceId`, 토큰 만료 시간 필드 추가 |
| 0-3 | Space 변경 API 추가 | `PATCH /api/v1/users/me/selected-space` |

### 프론트엔드

| 순서 | 작업 | 설명 |
|:----:|------|------|
| 1 | PersistStore 수정 | 토큰 만료 시간 + spaceId null 지원 |
| 2 | useAuthLoginPage 수정 | `selectedSpaceId` 우선 선택 로직 구현 |
| 3 | x-space-id 인터셉터 추가 | 모든 API 요청에 헤더 설정 (null 시 미포함) |
| 4 | SpaceSelector 컴포넌트 생성 | "전체" 옵션 포함 드롭다운 |
| 5 | HeaderSpaceSelector 생성 | 헤더용 SpaceSelector 래퍼 |
| 6 | useChangeSpace 훅 생성 | Space 변경 (null = "전체" 지원) |
| 7 | useSpaceGuard 훅 생성 | Space 미선택 감지 |
| 8 | SpaceAlert 컴포넌트 생성 | Alert UI |
| 9 | Admin Layout 수정 | Space Guard + SpaceSelector 적용 |
| 10 | 테스트 코드 작성 | 단위/통합/E2E 테스트 |

---

**문서 끝**
