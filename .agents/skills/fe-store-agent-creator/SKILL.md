---
name: "fe-store-agent-creator"
description: "이 skill은 `fe-store-agent` 역할로 일할 때 사용합니다. 공용 MobX store를 만드는 방법을 쉽게 안내합니다."
---

# fe-store-agent-creator

`fe-store-agent`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/25-fe-store-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

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
| 여러 페이지에서 공유되는 전역 상태 | ✅ | account, navigation |
| 앱 전체에서 접근해야 하는 설정 | ✅ | account, language |
| 복잡한 상태 머신 | ✅ | 멀티스텝 프로세스 |
| owner 내부 하위 상태 | ✅ | AccountStore의 AuthSession, NavigationStore의 NavItem |
| 페이지 레벨 상태 | ❌ | 페이지 로컬 상태(`useState`/`useLocalObservable`) 사용 |
| 컴포넌트 로컬 상태 | ❌ | useLocalObservable 사용 |
| API 캐싱 | ❌ | React Query 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 상태명 | ✅ | AppStore 직속 namespace owner는 `Store` 접미사를 사용하고 public property는 의미 이름을 유지 |
| 소유자 | ✅ | RootStore / AppStore / 가장 가까운 하위 상태 중 생명주기 owner 지정 |
| 상태 목록 | ✅ | observable 필드 정의 |
| 액션 목록 | ⚪ | 상태 변경 메서드 |
| computed 목록 | ⚪ | 파생 상태 getter |

### 출력

| 항목 | 경로 |
|------|------|
| App 시작과 조립 | `packages/fe-store/src/stores/rootStore.ts` |
| 실행 중 앱 상태 root | `packages/fe-store/src/stores/appStore.ts` |
| 상태와 전용 하위 객체 | `packages/fe-store/src/stores/[owner]/[name].ts` |
| Persistence helper | `packages/fe-store/src/stores/persistence/[name].ts` |
| App hook | `packages/fe-store/src/stores/useApp.ts`의 `useApp` 단일 진입점과 `AppStore` 하위 경로 |
| 상태 조립 | `packages/fe-store/src/stores/rootStore.ts`와 `appStore.ts` (수정) |
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
| **ownership 배치** | 상태와 전용 하위 객체를 가장 가까운 생명주기 owner 폴더에 함께 배치 |
| **app 참조 패턴** | 소비자는 AppStore의 의미 경로를 통해 상태에 접근 |
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

상태 파일은 `domain`이나 `model` 같은 종류가 아니라 **생명주기 소유 관계**로 배치합니다.

| 상태 위치 | 책임 |
|-----------|------|
| `RootStore` | AppStore와 모든 생성자 의존성 조립, cross-store/runtime binding 초기화, persisted state 시작, 런타임 adapter 연결 |
| `AppStore` | 실행 중인 앱의 public 상태 트리 |
| `stores/[owner]/*` | 해당 owner가 public subtree로 소유하거나 전용으로 사용하는 상태와 adapter |
| `stores/persistence/*` | 여러 상태가 사용하는 저장소 기술 경계 |

> `RootStore`, `AppStore`와 AppStore가 직접 소유하는 `AccountStore`, `AccessControlStore`, `LanguageStore`, `NavigationStore`에는 `Store` 접미사를 사용합니다.
> public property에는 접미사를 노출하지 않고 `app.account`, `app.accessControl`, `app.language`, `app.navigation`을 유지합니다.
> `AuthSession`, `NavItem` 같은 하위 상태와 `Navigator`, `PersistStorage` 같은 adapter/port에는 `Store` 접미사를 붙이지 않습니다.
> `AuthSession`은 `AccountStore`가 소유하므로 `account/`에, `NavItem`과 `Navigator`는 `NavigationStore` 전용이므로 `navigation/`에 둡니다.
> 상태 트리의 ownership과 객체 construction은 구분합니다. `AccountStore`가 `AuthSession`을 public subtree로 소유해도 인스턴스 생성과 주입은 composition root인 `RootStore`가 담당합니다.
> 생성자 의존성 계약은 `AccountStoreDependencies`, 실제 설정값 계약은 `NavigationStoreOptions`처럼 역할을 드러내고 해당 Store와 함께 export합니다.
> 여러 owner가 공유하지 않는 객체를 공용 `models/`, `domains/`, `adapters/` 폴더로 분산하지 않습니다.

RootStore 생명주기는 다음 순서를 강제합니다.

1. constructor: 저장소와 platform runtime을 읽지 않고 상태 그래프만 조립
2. `initialize(bindings)`: cross-store 관계와 session scope/language runtime binder를 한 번 연결
3. `start()`: 브라우저 mount 이후 persisted state를 hydrate

조립 단계에서 확정 가능한 `appName`, App storage key, storage adapter, runtime binder 배열은 필수 계약으로 받습니다. RootStore와 Store constructor에서 `??` fallback으로 누락을 보정하지 않습니다. SSR, 외부 persisted data, 생명주기 중복처럼 런타임에만 판별 가능한 조건에는 guard를 유지합니다.

React, Next.js router, DOM, API client는 RootStore가 직접 import하지 않습니다. Provider는 값을 공급하고 lifecycle method를 호출하는 runtime bridge만 담당합니다. React Query 기반 account/ability/i18n bootstrap은 post-root runtime 단계로 유지합니다.

### 4.2 상태 유형 결정

| 유형 | 사용 시점 |
|------|----------|
| RootStore 조립형 | AppStore의 직접 하위 상태와 그 생성자 의존성 |
| owner 전용 참조형 | 특정 Store의 public subtree 또는 전용 adapter |
| 독립형 상태 | 다른 상태와 상호작용하지 않는 공유 상태 |
| 설정 주입형 상태 | 앱별 설정이나 기술 포트가 필요한 경우 |

> 생성 전 게이트: 단일 페이지에서만 쓰이는 상태라면 공용 상태를 만들지 않고 페이지 로컬 상태로 구현합니다.

### 4.3 파일 구조

```
packages/fe-store/src/stores/
├── rootStore.ts            # 앱 상태 조립과 시작 생명주기
├── appStore.ts             # 실행 중인 앱 public 상태 root
├── useApp.ts               # useApp 단일 진입점
├── index.ts                # barrel export
├── account/
│   ├── accountStore.ts     # app.account namespace owner
│   └── authSession.ts      # AccountStore가 소유하는 인증 세션
├── accessControl/
│   └── accessControlStore.ts # app.accessControl namespace owner
├── navigation/
│   ├── navigationStore.ts # app.navigation namespace owner
│   ├── navItem.ts         # NavigationStore가 소유하는 하위 상태
│   └── navigator.ts       # NavigationStore 전용 router adapter
├── language/
│   └── languageStore.ts   # app.language namespace owner
└── persistence/
    └── persistStorage.ts  # 브라우저 저장소 접근 포트
```

### 4.4 등록 절차

1. 상태의 가장 가까운 생명주기 owner를 결정
2. owner 폴더에 상태 클래스 생성
3. RootStore에서 필요한 adapter, persistence, 하위 상태를 먼저 생성
4. 완성된 의존성을 Store constructor에 전달하고 AppStore를 조립
5. `useApp()`에서 시작하는 의미 경로 확인
6. index.ts에 export 추가

### 4.5 App 진입점 원칙

- 컴포넌트와 공용 hook은 `useApp()` 하나로 앱 상태 컨테이너를 가져옵니다.
- `useNavigation`처럼 하위 상태 하나를 직접 반환하는 selector hook을 새로 만들거나 사용하지 않습니다.
- 레이아웃과 Feature도 UI 위치별 중간 상태 계층을 추가하지 않고 `app.account`, `app.account.authSession`, `app.accessControl`, `app.navigation`, `app.language`처럼 app의 의미 상태를 직접 참조합니다.
- 네비게이션 UI는 `app.navigation.items`, `app.navigation.selectedNavItem`, `app.navigation.selectedSubNavItem`, `app.navigation.expandedNavItemIds`를 읽고 `selectNavItem`, `selectSubNavItem`, `toggleNavItem`을 직접 호출합니다.

---

## 5. 템플릿

### 5.1 RootStore 의존성 주입형 (권장)

```typescript
import { makeAutoObservable } from "mobx";
import type { PersistStorage } from "../persistence/persistStorage";

/**
 * 현재 인증 세션 상태입니다.
 */
export class AuthSession {
  isLoggingOut = false;

  constructor(private readonly persistStorage: PersistStorage) {
    makeAutoObservable(this);
  }

  get isAuthenticated(): boolean {
    return !this.isAccessTokenExpired;
  }
}

/**
 * AccountStore는 RootStore가 생성한 AuthSession 참조를 public subtree로 소유합니다.
 */
export interface AccountStoreDependencies {
  authSession: AuthSession;
  persistStorage: PersistStorage;
}

export class AccountStore {
  readonly authSession: AuthSession;
  private readonly persistStorage: PersistStorage;

  constructor({ authSession, persistStorage }: AccountStoreDependencies) {
    this.authSession = authSession;
    this.persistStorage = persistStorage;
    makeAutoObservable(this, { authSession: false, persistStorage: false });
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

### 5.3 App-level persistence 공유형 상태

```typescript
import { makeAutoObservable, reaction } from "mobx";
import type { PersistStorage } from "../persistence/persistStorage";

const LANGUAGE_PERSIST_SECTION = "language";

interface PersistedData {
  languageCode: string | null;
}

export class LanguageStore {
  languageCode: string | null = null;
  isHydrated = false;

  constructor(private readonly persistStorage: PersistStorage) {
    makeAutoObservable<this, "persistStorage">(this, {
      persistStorage: false,
    });

    this.setupAutoSave();
  }

  hydrateFromStorage(): void {
    if (this.isHydrated) return;

    const data = this.persistStorage.read<Partial<PersistedData>>(
      LANGUAGE_PERSIST_SECTION,
    );
    if (data) {
      this.languageCode = data.languageCode ?? null;
    }

    this.isHydrated = true;
  }

  private setupAutoSave(): void {
    reaction(
      () => ({
        languageCode: this.languageCode,
      }),
      (data) => {
        this.persistStorage.write(LANGUAGE_PERSIST_SECTION, data);
      },
    );
  }

  clear(): void {
    this.languageCode = null;
    this.persistStorage.remove(LANGUAGE_PERSIST_SECTION);
  }
}
```

### 5.3.1 SSR / Hydration 하드 규칙

- 상태 constructor는 순수해야 하며 `localStorage`, `sessionStorage`, `window`, `document`를 읽지 않습니다.
- `RootStore`는 App storage key와 adapter를 결합한 `PersistStorage` 하나만 생성해 persisted state 전체에 공유합니다.
- 상태 객체는 localStorage key나 browser fallback을 알지 않고 자기 section 이름만 사용합니다.
- storage 가용성 확인과 App 문서 최초 1회 로드는 `PersistStorage` 내부가 담당합니다.
- 브라우저 저장소 hydrate는 Provider 또는 Hook의 `useEffect`에서 명시적으로 호출합니다.
- `isHydrated` 같은 플래그로 guard가 hydration 완료 후에만 동작하도록 설계합니다.
- 첫 렌더 구조를 바꾸는 상태는 서버가 아는 snapshot이 아니면 render 단계에서 사용하지 않습니다.

### 5.4 owner가 소유하는 하위 상태 (Store 접미사 없음)

```typescript
// stores/navigation/navItem.ts
class NavItem {
  readonly id: string;
  readonly label: string;
  readonly children: NavItem[];

  setActive(value: boolean): void { /* 자신의 상태만 변경 */ }
  findChildById(id: string): NavItem | undefined { /* 데이터 탐색 */ }
}
```

### 5.5 RootStore 조립과 AppStore 등록

```typescript
// packages/fe-store/src/stores/appStore.ts
export class AppStore {
  readonly navigation: NavigationStore;

  constructor(state: AppStoreState) {
    this.navigation = state.navigation;
  }
}

// packages/fe-store/src/stores/rootStore.ts
export class RootStore {
  readonly app: AppStore;

  constructor(config: RootStoreConfig) {
    const persistStorage = new PersistStorage(
      config.persistStorageKey,
      config.storageAdapter,
    );
    const authSession = new AuthSession(persistStorage);
    const account = new AccountStore({
      authSession,
      persistStorage,
    });
    const navigation = new NavigationStore(config.navItems);
    this.app = new AppStore({ account, navigation, name: config.appName });
  }

  initialize(bindings: RootStoreRuntimeBindings): void {
    // cross-store 관계와 runtime binder를 한 번 연결
  }

  start(): void {
    // initialize 이후 persisted state hydrate
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
export { RootStore } from "./rootStore";
export { NavigationStore } from "./navigation/navigationStore";
```

---

## 6. 체크리스트

- [ ] `makeAutoObservable(this)` 호출 확인
- [ ] 앱 종속적 이름 없음 확인 (Admin, Coin 등)
- [ ] 가장 가까운 생명주기 owner와 같은 폴더에 배치
- [ ] RootStore가 App-level PersistStorage 하나를 생성해 persisted state 전체에 공유
- [ ] Store constructor는 storage key나 browser fallback 대신 완성된 의존성을 받음
- [ ] 조립 단계에서 확정 가능한 config는 필수이며 `??` fallback으로 누락을 보정하지 않음
- [ ] RootStore는 constructor -> initialize -> start 순서를 강제
- [ ] runtime binder 등록과 중복 방지는 RootStore가 소유
- [ ] Provider는 React/router/DOM/API 값을 공급하고 lifecycle trigger만 담당
- [ ] AppStore 직접 하위 class/file과 생성자 전용 타입에 `Store` 접미사 사용
- [ ] `app.account` 같은 public property에는 `Store` 접미사를 노출하지 않음
- [ ] constructor에서 browser storage를 읽지 않음
- [ ] computed getter는 순수 함수로 작성
- [ ] action 메서드는 상태 변경만 담당
- [ ] API 직접 호출 없음 확인
- [ ] AppStore constructor에 완성된 의미 기반 상태 경로 추가
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
| be-entity-builder | 공유 상태의 원천이 되는 Entity 계약 정의 |

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

1. **RootStore는 앱 실행 전에 전체 상태 그래프를 조립**
   ```typescript
   class RootStore {
     readonly app: AppStore;

     constructor(config: RootStoreConfig) {
       const persistStorage = new PersistStorage(
         config.persistStorageKey,
         config.storageAdapter,
       );
       const authSession = new AuthSession(persistStorage);
       const account = new AccountStore({
         authSession,
         persistStorage,
       });
       const navigation = new NavigationStore(config.navItems);
       this.app = new AppStore({
         account,
         navigation,
         name: config.appName,
       });
     }
   }
   ```

2. **전용 하위 상태는 owner 폴더에 배치하고 RootStore가 생성하여 주입**
   ```typescript
   class AccountStore {
     readonly authSession: AuthSession;

     constructor({ authSession, persistStorage }: AccountStoreDependencies) {
       this.authSession = authSession;
       this.persistStorage = persistStorage;
     }
   }
   ```

3. **상태 간 연결은 RootStore에서 명시적으로 구성**
   ```typescript
   navigation.setAbilityChecker((action, subject) =>
     accessControl.can(action, subject),
   );
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
├── account/authSession.ts      ← AccountStore가 소유
├── navigation/navItem.ts       ← NavigationStore가 소유
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

- RootStore: `packages/fe-store/src/stores/rootStore.ts`
- AppStore: `packages/fe-store/src/stores/appStore.ts`
- useApp hook: `packages/fe-store/src/stores/useApp.ts`
- Export: `packages/fe-store/src/stores/index.ts`

- shared 상태를 신규 생성하거나 수정하면 같은 작업에서 단위 테스트를 작성/갱신합니다.
- 상태 객체가 UI 상태 분기를 새로 만들면 담당 스펙의 `단위 테스트 인벤토리`에 state test 행을 기록하고, consuming component 단위 테스트 행은 해당 component 소스 담당 agent가 담당하도록 분리합니다.
- route-local 상태는 `fe-store-agent`가 아니라 `fe-route-agent`의 route-local implementation 또는 해당 route test로 검증합니다.
