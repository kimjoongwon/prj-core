# @cocrepo/store

Global state management library using MobX for the Cocrepo monorepo.

## Overview

`@cocrepo/store` provides centralized state management for authentication, navigation, routing, and application-wide state using MobX observables and reactions.

## Features

- 🔐 **Authentication Store** - User authentication state and token management
- 🧭 **Navigation Store** - Route navigation and history management
- 🍪 **Cookie Store** - Cookie-based state persistence
- 💾 **Storage Store** - LocalStorage/SessionStorage abstraction
- 🎯 **Plate Store** - Root store composition and initialization
- 🚀 **Token Store** - JWT token lifecycle management

## Installation

```bash
pnpm add @cocrepo/store
```

## Usage

### Basic Setup

```tsx
import { PlateStore } from '@cocrepo/store';
import { observer } from 'mobx-react-lite';

// Create root store instance
const plateStore = new PlateStore();

// Use in React components
const MyComponent = observer(() => {
  const { authStore, navigation } = plateStore;

  return (
    <div>
      {authStore?.isLoggingOut ? 'Logging out...' : 'Active'}
    </div>
  );
});
```

### Store Providers

```tsx
import { AppProviders } from '@cocrepo/store';

function App() {
  return (
    <AppProviders>
      <YourApp />
    </AppProviders>
  );
}
```

### Using Individual Stores

```tsx
import { AuthStore, NavigationStore } from '@cocrepo/store';
import { observer } from 'mobx-react-lite';

const LoginPage = observer(() => {
  const handleLogin = async () => {
    // AuthStore handles authentication logic
  };

  return <button onClick={handleLogin}>Login</button>;
});
```

## Store Architecture

```
PlateStore (Root)
├── AuthStore - Authentication & session management
├── NavigationStore - Route & navigation state
│   ├── NavigatorStore - Navigation actions
│   └── RouteStore - Route definitions
├── TokenStore - JWT token handling
├── CookieStore - Cookie operations
└── StorageStore - Persistent storage
```

## API Reference

### PlateStore

Root store that initializes and composes all child stores.

```typescript
class PlateStore {
  name: string;
  navigation?: NavigationStore;
  tokenStore?: TokenStore;
  authStore?: AuthStore;
  cookieStore?: CookieStore;
}
```

### AuthStore

Manages authentication state and HTTP interceptors.

```typescript
class AuthStore {
  isLoggingOut: boolean;
  handleAuthError(error: unknown): void;
}
```

### NavigationStore

Handles routing and navigation state.

```typescript
class NavigationStore {
  routes: RouteStore[];
  currentRoute?: RouteDto;
  setCurrentRoute(route: RouteDto): void;
}
```

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## Dependencies

- `mobx` - Reactive state management
- `mobx-react-lite` - React bindings for MobX
- `@cocrepo/api` - API client utilities
- `@cocrepo/toolkit` - Shared utility functions

## Best Practices

1. **Always use `observer`** - Wrap components that consume store state with `observer` HOC
2. **Avoid direct mutations** - Use MobX actions for state changes
3. **Initialize once** - Create `PlateStore` instance at app root
4. **Use reactions wisely** - Leverage MobX reactions for side effects

## Migration from @cocrepo/frontend

If you're migrating from `@cocrepo/frontend`:

```tsx
// Before
import { PlateStore, useAuth } from '@cocrepo/frontend';

// After
import { PlateStore, useAuth } from '@cocrepo/store';
```

## License

ISC
