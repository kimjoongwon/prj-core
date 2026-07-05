# fe-store-agent 상세 지시

원본 에이전트 파일: `.codex/agents/25-fe-store-agent.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 역할은 공용 agent입니다.
- 웹/모바일 양쪽에서 소비할 수 있는 공용 계약만 다루며, UI 런타임별 시각 규칙은 소비 소유 에이전트의 `웹 규칙` 또는 `모바일 규칙` 섹션을 따릅니다.
- `@heroui/react`, `heroui-native`, DOM, Expo/native UI 구현 세부 규칙은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

### Shared 런타임 Boundary

- 공용 hook/store는 React Web과 React Native에서 모두 소비될 수 있으므로 UI 런타임 import를 추가하지 않습니다.
- route-local hook/util/type/상태는 웹/모바일 모두 `fe-route-agent`가 처리하고 별도 spec을 만들지 않습니다.

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

# App State Agent (MobX)

MobX 기반의 앱 상태 객체를 생성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 여러 페이지에서 공유되는 전역 상태 | ✅ | session, navigation |
| 앱 전체에서 접근해야 하는 설정 | ✅ | tokens, space, locale |
| 복잡한 상태 머신 | ✅ | 멀티스텝 프로세스 |
| 도메인 모델 (데이터 구조) | ✅ | NavItem, User, Company |
| 페이지 레벨 상태 | ❌ | 페이지 로컬 상태(`useState`/`useLocalObservable`) 사용 |
| 컴포넌트 로컬 상태 | ❌ | useLocalObservable 사용 |
| API 캐싱 | ❌ | React Query 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 상태명 | ✅ | 의미 기반 이름. `Store` 접미사 금지 |
| 상태 유형 | ✅ | AppStore 주입형 / 독립형 / 설정 주입형 |
| 상태 목록 | ✅ | observable 필드 정의 |
| 액션 목록 | ⚪ | 상태 변경 메서드 |
| computed 목록 | ⚪ | 파생 상태 getter |

### 출력

| 항목 | 경로 |
|------|------|
| 상태 클래스 | `packages/fe-store/src/stores/[meaning].ts` |
| Domain Model | `packages/fe-store/src/stores/[name].ts` (필요시) |
| App hook/facade | `packages/fe-store/src/stores/useApp.ts`의 `useApp` 단일 진입점과 `AppStore` 하위 경로 |
| AppStore 등록 | `packages/fe-store/src/stores/appStore.ts` (수정) |
| barrel export | `packages/fe-store/src/stores/index.ts` (추가) |
| 페이지 전용 상태 | `apps/*/src/app/**/_client.tsx`, `apps/*/src/app/**/hooks/` (로컬 상태로 구현) |

---

## 3. 핵심 규칙

### ✅ 권장

| 규칙 | 설명 |
|------|------|
| **makeAutoObservable 사용** | 생성자 마지막에 호출 |
| **범용적 이름 사용** | 앱 종속 이름 금지 |
| **재사용성 검증 선행** | 2개 이상 페이지/도메인 재사용이 없으면 공용 상태 생성 금지 |
| **app 참조 패턴** | 다른 상태 접근 시 AppStore의 의미 경로를 통해 참조 |
| **상태 변경만 담당** | API 호출은 외부에서 수행 후 결과 전달 |
| **computed는 동기적** | getter는 순수 함수로 작성 |

### ❌ 금지

| 금지 사항 | 이유 |
|----------|------|
| 페이지 레벨 공용 상태 생성 | 페이지 로컬 상태가 원칙 |
| 상태 객체에서 직접 API 호출 | 상태 관리와 데이터 페칭 분리 |
| 앱 종속적 하드코딩 | 공용 패키지 재사용성 |
| 비동기 computed | computed는 동기적이어야 함 |
| Admin, Coin 같은 앱 종속 네이밍 | 범용적 이름 사용 |

---

## 4. 프로세스

### 4.1 아키텍처 이해

| 프론트엔드 상태 | 백엔드 | 설명 |
|-------------------|--------|------|
| 의미 기반 상태명 | Service Layer | 비즈니스 로직, 상태 관리 |
| 도메인 명사 클래스 | Domain Model / Entity | 데이터 구조, 도메인 모델 |

> 새 상태 객체, app 프로퍼티, provider, hook 이름에는 `Store` 접미사를 붙이지 않습니다.

### 4.2 상태 유형 결정

| 유형 | 사용 시점 |
|------|----------|
| AppStore 주입형 | 다른 상태와 상호작용 필요 |
| 독립형 상태 | 다른 상태와 상호작용 불필요 |
| 설정 주입형 상태 | 앱별 설정이 필요한 경우 |

> 생성 전 게이트: 단일 페이지에서만 쓰이는 상태라면 공용 상태를 만들지 않고 페이지 로컬 상태로 구현합니다.

### 4.3 파일 구조

```
packages/fe-store/src/stores/
├── appStore.ts          # AppStore
├── useApp.ts             # useApp 단일 진입점
├── index.ts              # barrel export
├── navigation.ts         # Navigation (Service Layer)
├── navItem.ts           # NavItem (Domain Model)
├── session.ts           # 인증 상태
├── space.ts         # space/session 저장 상태
└── tokens.ts            # 토큰 상태
```

### 4.4 등록 절차

1. 상태 클래스 생성
2. AppStore에 의미 경로 추가
3. `useApp()`에서 시작하는 접근 경로 확인
4. index.ts에 export 추가

### 4.5 App 진입점 원칙

- 컴포넌트와 공용 hook은 `useApp()` 하나로 앱 상태 컨테이너를 가져옵니다.
- `useNavigation`, `useSpace`, `useMobileNavigation`, `useFloatingActions`처럼 하위 상태를 직접 반환하는 selector hook을 새로 만들거나 사용하지 않습니다.
- UI 생존 위치를 표현해야 하는 상태는 `app.ui.<layout-slot>.<feature-component>` 경로로 노출합니다. 예: `app.ui.footer.mobileBottomNavigation`, `app.ui.footer.mobileMenu`, `app.ui.body.leftAside.sideNavigation`.
- 앱 의미 상태는 `app.navigation`, `app.ability`, `app.space`, `app.session`, `app.locale`처럼 app에서 직접 시작합니다.

---

## 5. 템플릿

### 5.1 AppStore 주입형 (권장)

```typescript
import { makeAutoObservable } from "mobx";
import type { AppStore } from "./appStore";

/**
 * SessionState - 인증 비즈니스 로직
 *
 * @example
 * ```typescript
 * const app = new AppStore();
 * app.session = new SessionState(app);
 *
 * app.session.logout();
 * ```
 */
export class SessionState {
  readonly app: AppStore;
  isLoggingOut = false;

  constructor(app: AppStore) {
    this.app = app;
    makeAutoObservable(this);
  }

  // Computed
  get isAuthenticated(): boolean {
    return !this.app.space?.isAccessTokenExpired;
  }

  // Actions
  async logout(logoutApi?: () => Promise<unknown>) {
    try {
      this.isLoggingOut = true;
      if (logoutApi) {
        await logoutApi();
      }
      this.app.space?.clear();
    } finally {
      this.isLoggingOut = false;
    }
  }
}
```

### 5.2 독립형 상태

```typescript
import { makeAutoObservable } from "mobx";

export interface ModalConfig {
  defaultOpen?: boolean;
}

export class Modal {
  isOpen = false;
  data: unknown = null;

  constructor(config?: ModalConfig) {
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

### 5.3 설정 주입형 상태

```typescript
import { makeAutoObservable, reaction } from "mobx";

export interface SpaceConfig {
  storageKey: string;
}

interface PersistedData {
  spaceId: string | null;
  accessTokenExpiresAt: number | null;
}

export class SpaceState {
  spaceId: string | null = null;
  accessTokenExpiresAt: number | null = null;
  isHydrated = false;

  constructor(private config: SpaceConfig) {
    // config는 observable에서 제외
    makeAutoObservable<this, "config">(this, {
      config: false,
    });

    this.setupAutoSave();
  }

  hydrateFromStorage(): void {
    if (this.isHydrated) return;
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

    this.isHydrated = true;
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

### 5.3.1 SSR / Hydration 하드 규칙

- 상태 constructor는 순수해야 하며 `localStorage`, `sessionStorage`, `window`, `document`를 읽지 않습니다.
- 브라우저 저장소 hydrate는 Provider 또는 Hook의 `useEffect`에서 명시적으로 호출합니다.
- `isHydrated` 같은 플래그로 guard가 hydration 완료 후에만 동작하도록 설계합니다.
- 첫 렌더 구조를 바꾸는 상태는 서버가 아는 snapshot이 아니면 render 단계에서 사용하지 않습니다.

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

### 5.5 AppStore 등록

```typescript
// packages/fe-store/src/stores/appStore.ts
import { makeAutoObservable } from "mobx";
import { NewState } from "./newState";

export class AppStore {
  // 기존 상태들...
  newState?: NewState;

  constructor() {
    makeAutoObservable(this);
  }
}
```

### 5.6 useApp 경로 확인

```typescript
// packages/fe-store/src/stores/useApp.ts

/**
 * 앱 전역 상태 컨테이너를 가져오는 단일 hook
 */
export const useApp = () => {
  const app = useContext(AppContext);
  if (!app) {
    throw new Error("useApp must be used within AppProvider");
  }
  return app;
};
```

### 5.7 Export 추가

```typescript
// packages/fe-store/src/stores/index.ts
export { NewState } from "./newState";
```

---

## 6. 체크리스트

- [ ] `makeAutoObservable(this)` 호출 확인
- [ ] 앱 종속적 이름 없음 확인 (Admin, Coin 등)
- [ ] AppStore 주입 필요시 `readonly app: AppStore` 선언
- [ ] computed getter는 순수 함수로 작성
- [ ] action 메서드는 상태 변경만 담당
- [ ] API 직접 호출 없음 확인
- [ ] AppStore에 의미 기반 상태 경로 추가
- [ ] selector hook을 만들지 않고 `useApp()`에서 시작하는 접근 경로 확인
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
| technical-designer | 상태 설계 정의 |
| be-entity-builder | Domain Model 기반이 되는 Entity 정의 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-feature-agent** | app 상태를 연결하여 Feature 컴포넌트 생성 |
| fe-route-agent | 통합 훅에서 app 상태 사용 |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| fe-widget-agent | Widget이 상태 타입을 참조하여 Props 정의 |

---

## 8. 프로젝트별 참고사항

### 상태 설계 원칙

1. **상태 객체는 여러 Domain Model을 조합하여 비즈니스 로직 수행**
   ```typescript
   class Navigation {
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

3. **상태 간 상호작용은 AppStore를 통해**
   ```typescript
   class SessionState {
     logout(): void {
       this.app.space?.clear();
     }
   }
   ```

### 페이지 레벨 공용 상태 금지 (Critical)

```
❌ 안티패턴
apps/admin/web/src/app/(admin)/users/
├── _stores/
│   └── UserListState.ts   ← 금지!
└── page.tsx

✅ 공용 상태는 packages/fe-store에만
packages/fe-store/src/stores/
├── navigation.ts          ← 전역 상태
├── session.ts             ← 전역 상태
└── ...
```

**페이지 상태는 URL 기반으로 관리:**

| 상태 유형 | 관리 방법 | 예시 |
|----------|----------|------|
| 필터/검색 | `queryParams` | `?search=kim&status=active` |
| 리소스 식별 | `pathParams` | `/users/123` |
| 임시 전달 데이터 | `router.push({ state })` | 이전 페이지에서 전달 |

### 상태 객체에서 API 호출 금지

```typescript
// ❌ 금지
export class UserState {
  async fetchUsers() {
    const users = await getUsers();  // 직접 API 호출
    this.users = users;
  }
}

// ✅ 권장 - 외부에서 API 호출 후 결과 전달
export class UserState {
  setUsers(users: User[]): void {
    this.users = users;
  }
}

// 컴포넌트에서
const { data } = useGetUsers();
useEffect(() => {
  if (data) userState.setUsers(data);
}, [data]);
```

### 관련 파일

- AppStore: `packages/fe-store/src/stores/appStore.ts`
- useApp hook: `packages/fe-store/src/stores/useApp.ts`
- Export: `packages/fe-store/src/stores/index.ts`


- shared 상태를 신규 생성하거나 수정하면 같은 작업에서 단위 테스트를 작성/갱신합니다.
- 상태 객체가 UI 상태 분기를 새로 만들면 담당 스펙의 `단위 테스트 인벤토리`에 state test 행을 기록하고, consuming component 단위 테스트 행은 해당 component 소스 담당 agent가 담당하도록 분리합니다.
- route-local 상태는 `fe-store-agent`가 아니라 `fe-route-agent`의 route-local implementation 또는 해당 route test로 검증합니다.
