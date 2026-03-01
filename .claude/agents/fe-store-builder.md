---
name: fe-store-builder
description: MobX 기반 Store를 생성하는 전문가
tools: Read, Write, Grep, Bash
---


# Store Builder (MobX)

MobX 기반의 Store를 생성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 여러 페이지에서 공유되는 전역 상태 | ✅ | AuthStore, NavigationStore |
| 앱 전체에서 접근해야 하는 설정 | ✅ | TokenStore, PersistStore |
| 복잡한 상태 머신 | ✅ | 멀티스텝 프로세스 |
| 도메인 모델 (데이터 구조) | ✅ | NavItem, User, Company |
| 페이지 레벨 상태 | ❌ | 페이지 로컬 state(`useState`/`useLocalObservable`) 사용 |
| 컴포넌트 로컬 상태 | ❌ | useLocalObservable 사용 |
| API 캐싱 | ❌ | React Query 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| Store명 | ✅ | `[Name]Store` 패턴 |
| Store 유형 | ✅ | RootStore 주입형 / 독립형 / 설정 주입형 |
| 상태 목록 | ✅ | observable 필드 정의 |
| 액션 목록 | ⚪ | 상태 변경 메서드 |
| computed 목록 | ⚪ | 파생 상태 getter |

### 출력

| 항목 | 경로 |
|------|------|
| Store 클래스 | `packages/fe-store/src/stores/[name]Store.ts` |
| Domain Model | `packages/fe-store/src/stores/[name].ts` (필요시) |
| useStore hook | `packages/fe-store/src/stores/useStore.ts` (추가) |
| RootStore 등록 | `packages/fe-store/src/stores/rootStore.ts` (수정) |
| barrel export | `packages/fe-store/src/stores/index.ts` (추가) |
| 페이지 전용 상태 | `apps/*/src/app/**/_client.tsx`, `apps/*/src/app/**/hooks/` (로컬 state로 구현) |

---

## 3. 핵심 규칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **makeAutoObservable 사용** | 생성자 마지막에 호출 |
| **범용적 이름 사용** | 앱 종속 이름 금지 |
| **재사용성 검증 선행** | 2개 이상 페이지/도메인 재사용이 없으면 Store 생성 금지 |
| **rootStore 참조 패턴** | 다른 Store 접근 시 rootStore 통해 참조 |
| **상태 변경만 담당** | API 호출은 외부에서 수행 후 결과 전달 |
| **computed는 동기적** | getter는 순수 함수로 작성 |

### ❌ Don't

| 금지 사항 | 이유 |
|----------|------|
| 페이지 레벨 Store 생성 | 페이지 로컬 state가 원칙 |
| Store에서 직접 API 호출 | 상태 관리와 데이터 페칭 분리 |
| 앱 종속적 하드코딩 | 공용 패키지 재사용성 |
| 비동기 computed | computed는 동기적이어야 함 |
| AdminStore, CoinStore 등 네이밍 | 범용적 이름 사용 |

---

## 4. 프로세스

### 4.1 아키텍처 이해

| 프론트엔드 (Store) | 백엔드 | 설명 |
|-------------------|--------|------|
| `*Store` (접미사 있음) | Service Layer | 비즈니스 로직, 상태 관리 |
| 접미사 없는 클래스 | Domain Model / Entity | 데이터 구조, 도메인 모델 |

### 4.2 Store 유형 결정

| 유형 | 사용 시점 |
|------|----------|
| RootStore 주입형 | 다른 Store와 상호작용 필요 |
| 독립형 Store | 다른 Store와 상호작용 불필요 |
| 설정 주입형 Store | 앱별 설정이 필요한 경우 |

> 생성 전 게이트: 단일 페이지에서만 쓰이는 상태라면 Store를 만들지 않고 페이지 로컬 state로 구현합니다.

### 4.3 파일 구조

```
packages/fe-store/src/stores/
├── Store.ts              # RootStore
├── useStore.ts           # useStore hooks
├── index.ts              # barrel export
├── navigationStore.ts    # NavigationStore (Service Layer)
├── navItem.ts           # NavItem (Domain Model)
├── authStore.ts         # AuthStore (Service Layer)
├── persistStore.ts      # PersistStore (Service Layer)
└── tokenStore.ts        # TokenStore (Service Layer)
```

### 4.4 등록 절차

1. Store 클래스 생성
2. RootStore에 타입 추가
3. useStore hook 추가
4. index.ts에 export 추가

---

## 5. 템플릿

### 5.1 RootStore 주입형 (권장)

```typescript
import { makeAutoObservable } from "mobx";
import { RootStore } from "./Store";

/**
 * AuthStore - 인증 비즈니스 로직
 *
 * @example
 * ```typescript
 * const rootStore = new RootStore();
 * rootStore.authStore = new AuthStore(rootStore);
 *
 * authStore.logout();
 * ```
 */
export class AuthStore {
  readonly rootStore: RootStore;
  isLoggingOut = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Computed
  get isAuthenticated(): boolean {
    return !this.rootStore.tokenStore?.isAccessTokenExpired();
  }

  // Actions
  async logout(logoutApi?: () => Promise<unknown>) {
    try {
      this.isLoggingOut = true;
      if (logoutApi) {
        await logoutApi();
      }
      this.rootStore.tokenStore?.clearTokens();
      this.rootStore.persistStore?.clear();
    } finally {
      this.isLoggingOut = false;
    }
  }
}
```

### 5.2 독립형 Store

```typescript
import { makeAutoObservable } from "mobx";

export interface ModalStoreConfig {
  defaultOpen?: boolean;
}

export class ModalStore {
  isOpen = false;
  data: unknown = null;

  constructor(config?: ModalStoreConfig) {
    this.isOpen = config?.defaultOpen ?? false;
    makeAutoObservable(this);
  }

  open(data?: unknown): void {
    this.data = data ?? null;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.data = null;
  }
}
```

### 5.3 설정 주입형 Store

```typescript
import { makeAutoObservable, reaction } from "mobx";

export interface PersistStoreConfig {
  storageKey: string;
}

interface PersistedData {
  spaceId: string | null;
  accessTokenExpiresAt: number | null;
}

export class PersistStore {
  spaceId: string | null = null;
  accessTokenExpiresAt: number | null = null;

  constructor(private config: PersistStoreConfig) {
    // config는 observable에서 제외
    makeAutoObservable<this, "config">(this, {
      config: false,
    });

    this.hydrate();
    this.setupAutoSave();
  }

  private hydrate(): void {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(this.config.storageKey);
    if (stored) {
      try {
        const data: PersistedData = JSON.parse(stored);
        this.spaceId = data.spaceId;
        this.accessTokenExpiresAt = data.accessTokenExpiresAt;
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }

  private setupAutoSave(): void {
    if (typeof window === "undefined") return;

    reaction(
      () => ({
        spaceId: this.spaceId,
        accessTokenExpiresAt: this.accessTokenExpiresAt,
      }),
      (data) => {
        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      },
    );
  }

  clear(): void {
    this.spaceId = null;
    this.accessTokenExpiresAt = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.config.storageKey);
    }
  }
}
```

### 5.4 Domain Model (접미사 없음)

```typescript
// NavItem - 네비게이션 아이템 도메인 모델
class NavItem {
  readonly id: string;
  readonly label: string;
  readonly children: NavItem[];

  setActive(value: boolean): void { /* 자신의 상태만 변경 */ }
  findChildById(id: string): NavItem | undefined { /* 데이터 탐색 */ }
}
```

### 5.5 RootStore 등록

```typescript
// packages/fe-store/src/stores/Store.ts
import { makeAutoObservable } from "mobx";
import { NewStore } from "./newStore";

export class RootStore {
  // 기존 Store들...
  newStore?: NewStore;

  constructor() {
    makeAutoObservable(this);
  }
}
```

### 5.6 useStore Hook 추가

```typescript
// packages/fe-store/src/stores/useStore.ts

/**
 * NewStore를 가져오는 selector hook
 */
export const useNewStore = () => {
  const store = useStore();
  if (!store.newStore) {
    throw new Error("newStore가 초기화되지 않았습니다.");
  }
  return store.newStore;
};
```

### 5.7 Export 추가

```typescript
// packages/fe-store/src/stores/index.ts
export { NewStore } from "./newStore";
export { useNewStore } from "./useStore";
```

---

## 6. 체크리스트

- [ ] `makeAutoObservable(this)` 호출 확인
- [ ] 앱 종속적 이름 없음 확인 (Admin, Coin 등)
- [ ] RootStore 주입 필요시 `readonly rootStore: RootStore` 선언
- [ ] computed getter는 순수 함수로 작성
- [ ] action 메서드는 상태 변경만 담당
- [ ] API 직접 호출 없음 확인
- [ ] RootStore에 Store 타입 추가
- [ ] useStore hook 추가
- [ ] index.ts에 export 추가
- [ ] JSDoc 주석 및 @example 작성

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
| technical-designer | Store 설계 정의 |
| entity-builder | Domain Model 기반이 되는 Entity 정의 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-feature-builder** | Store를 연결하여 Feature 컴포넌트 생성 |
| fe-page-builder | 통합 훅에서 Store 사용 |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| fe-widget-builder | Widget이 Store 타입을 참조하여 Props 정의 |

---

## 8. 프로젝트별 참고사항

### Store 설계 원칙

1. **Store는 여러 Domain Model을 조합하여 비즈니스 로직 수행**
   ```typescript
   class NavigationStore {
     private _items: NavItem[];  // Domain Model 컬렉션
     selectNavItem(id: string): void { /* NavItem들을 조작하는 비즈니스 로직 */ }
   }
   ```

2. **Domain Model은 자신의 데이터만 관리**
   ```typescript
   class NavItem {
     setActive(value: boolean): void { this._active = value; }
   }
   ```

3. **Store 간 상호작용은 RootStore를 통해**
   ```typescript
   class AuthStore {
     logout(): void {
       this.rootStore.tokenStore?.clearTokens();
       this.rootStore.persistStore?.clear();
     }
   }
   ```

### 페이지 레벨 Store 금지 (Critical)

```
❌ 안티패턴
apps/admin/web/app/(admin)/users/
├── _stores/
│   └── UserListStore.ts   ← 금지!
└── page.tsx

✅ Store는 packages/fe-store에만
packages/fe-store/src/stores/
├── navigationStore.ts     ← 전역 Store
├── authStore.ts           ← 전역 Store
└── ...
```

**페이지 상태는 URL 기반으로 관리:**

| 상태 유형 | 관리 방법 | 예시 |
|----------|----------|------|
| 필터/검색 | `queryParams` | `?search=kim&status=active` |
| 리소스 식별 | `pathParams` | `/users/123` |
| 임시 전달 데이터 | `router.push({ state })` | 이전 페이지에서 전달 |

### Store에서 API 호출 금지

```typescript
// ❌ 금지
export class UserStore {
  async fetchUsers() {
    const users = await getUsers();  // 직접 API 호출
    this.users = users;
  }
}

// ✅ 권장 - 외부에서 API 호출 후 결과 전달
export class UserStore {
  setUsers(users: User[]): void {
    this.users = users;
  }
}

// 컴포넌트에서
const { data } = useGetUsers();
useEffect(() => {
  if (data) userStore.setUsers(data);
}, [data]);
```

### 관련 파일

- RootStore: `packages/fe-store/src/stores/Store.ts`
- useStore hooks: `packages/fe-store/src/stores/useStore.ts`
- Export: `packages/fe-store/src/stores/index.ts`
