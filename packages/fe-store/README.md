# @cocrepo/store

MobX-based application state library for the Cocrepo monorepo.

## Overview

`@cocrepo/store` provides shared application state, app provider factories, and the single `useApp` entry point used by the Next.js apps in this repository.

## Public API

- App state: `AppStore`, `Navigation`, `app.session`, `app.space`, `app.locale`, `app.ability`, `app.ui`
- Hooks: `useApp`
- Providers: `createAppProvider`, `consoleAppProvider`, `ConsoleAppProvider`

## Installation

```bash
pnpm add @cocrepo/store
```

## Provider Example

```tsx
import { ConsoleAppProvider, useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";

const SessionState = observer(() => {
  const app = useApp();
  return <div>{app.session?.isAuthenticated ? "Active" : "Expired"}</div>;
});

export function App() {
  return (
    <ConsoleAppProvider>
      <SessionState />
    </ConsoleAppProvider>
  );
}
```

## App State Tree Example

```ts
import { useApp } from "@cocrepo/store";

const app = useApp();

app.session?.isAuthenticated;
app.space?.tenantId;
app.locale?.languageCode;
app.ability?.can("view", "menu:dashboard");
app.ui.footer.mobileBottomNavigation.items;
```

## Notes

- The root class is `AppStore`, not app-specific brand names.
- Components start from `useApp`; selector hooks such as `useNavigation` or `useSpace` are not part of the current package surface.
- App-wide providers are created via `createAppProvider`; there is no `AppProviders` export in the current package surface.
