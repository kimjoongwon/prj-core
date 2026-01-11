# 데이터 요구사항

## API 엔드포인트

| Method | Endpoint | 설명 | 현재 상태 |
|--------|----------|------|----------|
| POST | `/api/v1/auth/login` | 로그인 | 구현됨 (Orval) |
| POST | `/api/v1/auth/logout` | 로그아웃 | 구현됨 (Orval) |
| POST | `/api/v1/auth/token/refresh` | 토큰 갱신 | 구현됨 (Orval) |
| GET | `/api/v1/grounds` | Ground 목록 조회 | 구현됨 (Orval) |
| PATCH | `/api/v1/users/me/selected-space` | Space 변경 | **추가 필요** |

---

## httpOnly 쿠키 환경에서의 토큰 관리

### 문제점

```
[X] 기존 방식 (사용 불가)
┌─────────────────────────────────────────────────────────────┐
│  JavaScript에서 Cookie 직접 접근하여 JWT 파싱               │
│  → httpOnly 쿠키는 JavaScript에서 접근 불가!                │
└─────────────────────────────────────────────────────────────┘
```

### 해결 방안

```
[O] 새로운 방식
┌─────────────────────────────────────────────────────────────┐
│  1. 서버에서 토큰과 함께 만료 시간(expiresAt)을 응답        │
│  2. 클라이언트는 만료 시간만 localStorage에 저장            │
│  3. 만료 여부는 저장된 expiresAt과 현재 시간 비교로 판별    │
│  4. 실제 토큰은 httpOnly 쿠키로 자동 전송                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Login API 응답 구조 (수정 필요)

```typescript
// POST /api/v1/auth/login
interface LoginResponse {
  httpStatus: number;
  message: string;
  data: {
    accessToken: string;           // JWT Access Token (httpOnly 쿠키로 설정됨)
    refreshToken: string;          // JWT Refresh Token (httpOnly 쿠키로 설정됨)
    accessTokenExpiresAt: number;  // [추가] Access Token 만료 시간 (Unix timestamp)
    refreshTokenExpiresAt: number; // [추가] Refresh Token 만료 시간 (Unix timestamp)
    selectedSpaceId: string | null; // [추가] 마지막 선택한 Space ID (User.selectedSpaceId)
    user: {
      id: string;
      email: string;
      name: string;
      selectedSpaceId: string | null; // [추가] User 레벨에도 포함
      tenants: Array<{
        id: string;
        spaceId: string;           // Space ID
        space: {
          id: string;
          ground: {                // [추가] Ground 정보 (Space와 1:1 join)
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

---

## 데이터 관계 구조

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

---

## Store 구조

### PersistStore (영속 데이터 + 토큰 만료 시간 통합)

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

## 보안 고려사항

### 토큰 저장 위치

| 항목 | 저장 위치 | 설정 | 비고 |
|------|----------|------|------|
| accessToken | Cookie (서버 설정) | httpOnly, secure, sameSite: strict | JS 접근 불가 |
| refreshToken | Cookie (서버 설정) | httpOnly, secure, sameSite: strict | JS 접근 불가 |
| accessTokenExpiresAt | localStorage | - | 만료 시간만 저장 |
| refreshTokenExpiresAt | localStorage | - | 만료 시간만 저장 |
| spaceId | localStorage | - | PersistStore 관리 |

### httpOnly 쿠키의 장점

```
┌─────────────────────────────────────────────────────────────┐
│  httpOnly 쿠키 보안 이점                                      │
├─────────────────────────────────────────────────────────────┤
│  [O] XSS 공격으로부터 토큰 탈취 방지                           │
│  [O] JavaScript에서 직접 접근 불가                             │
│  [O] 브라우저가 자동으로 요청에 포함                           │
│  [O] CSRF 방지 (sameSite: strict)                             │
└─────────────────────────────────────────────────────────────┘
```
