# @cocrepo/store

MobX-based application state library for the Cocrepo monorepo.

## Overview

`@cocrepo/store` provides the shared root store, app store provider factories, and selector hooks used by the Next.js apps in this repository.

## Public API

- Stores: `RootStore`, `AuthStore`, `NavigationStore`, `PersistStore`, `TokenStore`, `AbilityStore`, `BottomTabStore`, `FABStore`
- Hooks: `useStore`, `useRootStore`, `useAuthStore`, `useNavigationStore`, `usePersistStore`
- Providers: `createAppStoreProvider`, `consoleAppStoreProvider`, `ConsoleAppStoreProvider`

## Installation

```bash
pnpm add @cocrepo/store
```

## Provider Example

```tsx
import { ConsoleAppStoreProvider, useAuthStore } from "@cocrepo/store";
import { observer } from "mobx-react-lite";

const SessionState = observer(() => {
  const authStore = useAuthStore();
  return <div>{authStore.isAuthenticated ? "Active" : "Expired"}</div>;
});

export function App() {
  return (
    <ConsoleAppStoreProvider>
      <SessionState />
    </ConsoleAppStoreProvider>
  );
}
```

## Root Store Example

```ts
import { AuthStore, PersistStore, RootStore, TokenStore } from "@cocrepo/store";

const rootStore = new RootStore();
rootStore.tokenStore = new TokenStore(rootStore);
rootStore.persistStore = new PersistStore({ storageKey: "example-persist" });
rootStore.authStore = new AuthStore(rootStore);
```

## Notes

- The root class is `RootStore`, not `PlateStore`.
- The auth selector hook is `useAuthStore`, not `useAuth`.
- App-wide providers are created via `createAppStoreProvider`; there is no `AppProviders` export in the current package surface.
