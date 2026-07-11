# @cocrepo/store

코크리포 모노레포에서 사용하는 MobX 기반 애플리케이션 상태 라이브러리입니다.

## 개요

`@cocrepo/store`는 공용 애플리케이션 상태와 하나의 React Context 진입점을 제공합니다.
저장소의 모든 Next.js 앱은 같은 `AppContext`, `AppProvider`, `useApp`을 사용합니다.

## 공개 API

- 런타임 루트: `RootStore`, `root.app`
- 앱 상태: `AppStore`, `AccountStore`, `AccessControlStore`, `LanguageStore`, `NavigationStore`
- 공개 경로: `app.account.authSession`, `app.account`, `app.language`, `app.accessControl`, `app.navigation`
- Context와 hook: `AppContext`, `useApp`
- Provider: `AppProvider`

## 설치

```bash
pnpm add @cocrepo/store
```

## 앱 composition root에서 Provider 사용

각 앱의 composition root가 완성된 설정을 소유하고 공용 `AppProvider`의 `config` prop으로
직접 전달합니다. store 패키지는 앱별 설정이나 preset Provider를 소유하지 않습니다.

```tsx
import { ADMIN_NAV_ITEMS } from "@cocrepo/constant";
import { AppProvider } from "@cocrepo/store";
import type { ReactNode } from "react";

const ADMIN_APP_CONFIG = {
  appName: "ADMIN",
  navItems: ADMIN_NAV_ITEMS,
  persistStorageKey: "admin-persist",
};

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppProvider config={ADMIN_APP_CONFIG}>{children}</AppProvider>;
}
```

하위 컴포넌트는 같은 `AppContext`를 참조하는 공용 `useApp`에서 상태 탐색을 시작합니다.

```tsx
import { useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";

const AuthSessionState = observer(() => {
  const app = useApp();
  return <div>{app.account.authSession.isAuthenticated ? "Active" : "Expired"}</div>;
});
```

## 앱 상태 트리 예시

```ts
import { useApp } from "@cocrepo/store";

const app = useApp();

app.account.authSession.isAuthenticated;
app.account.currentTenantId;
app.language.languageCode;
app.accessControl.can("view", "menu:dashboard");
app.navigation.items;
app.navigation.selectNavItem("dashboard");
```

내부적으로 `AppProvider`는 `RootStore`를 소유합니다. `RootStore`는 실행할 `AppStore`를
조립하고 다음 세 단계로 시작합니다.

1. `constructor`: 플랫폼 상태를 읽지 않고 상태 그래프를 조립합니다.
2. `initialize(bindings)`: store 사이의 관계와 런타임 binder를 한 번 연결합니다.
3. `start()`: 브라우저가 마운트된 뒤 영속 상태를 hydrate합니다.

조립 과정에서 `RootStore`는 앱 단위 `PersistStorage` 하나를 생성해 `AuthSession`,
`AccountStore`, `LanguageStore`와 공유합니다. 각 상태는 별도 localStorage key가 아니라
영속 앱 문서 내부의 자기 section만 소유합니다. 조립 설정은 누락 없이 전달해야 하며,
constructor fallback은 빠진 앱 설정이 아니라 런타임 불확실성을 처리할 때만 사용합니다.

`AppProvider`는 React, router, DOM, API 런타임 값만 공급합니다. 초기화 순서와 중복 실행
방지는 `RootStore`가 소유합니다.

```text
RootStore
└── app: AppStore
    ├── account
    │   └── authSession
    ├── accessControl
    ├── language
    └── navigation
```

## 참고

- `RootStore`는 시작과 조립을, `AppStore`는 실행 중인 앱의 공개 상태를 소유합니다.
- `AppStore`의 직접 하위 namespace owner는 class/file에 `Store` 접미사를 사용하지만 공개 경로에는 노출하지 않습니다.
- 상태 파일은 일반적인 `domains`나 `models` 계층 대신 가장 가까운 owner(`account/*`, `navigation/*`) 아래에 둡니다.
- 모든 컴포넌트는 공용 `useApp`에서 시작하며 앱 전용 Context나 hook 별칭은 공개하지 않습니다.
- 앱별 composition root가 공용 `AppProvider`에 완성된 `config`를 직접 전달합니다.
