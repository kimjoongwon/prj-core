# @cocrepo/hooks

Shared React hooks library for the Cocrepo monorepo.

## Overview

`@cocrepo/hooks` provides a collection of reusable React hooks for common patterns like data fetching, state management, form handling, and MobX integration.

## Features

- 🎣 **Custom React Hooks** - Reusable logic across applications
- 📊 **MobX Integration** - Hooks for working with MobX stores
- 🔄 **Data Fetching** - Simplified API integration patterns
- 📝 **Form Handling** - Form state and validation utilities
- 🎯 **Type-Safe** - Full TypeScript support

## Installation

```bash
pnpm add @cocrepo/hooks
```

## Usage

### Basic Hook Example

```tsx
import { useBoolean, useDebounce } from '@cocrepo/hooks';

function SearchComponent() {
  const [isOpen, { toggle, setTrue, setFalse }] = useBoolean(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Search with debounced value
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={toggle}>
        {isOpen ? 'Close' : 'Open'}
      </button>
    </div>
  );
}
```

### MobX Store Hooks

```tsx
import { useStore, useObserver } from '@cocrepo/hooks';
import { observer } from 'mobx-react-lite';

const MyComponent = observer(() => {
  const store = useStore();

  return (
    <div>
      {store.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
});
```

### Form Hooks

```tsx
import { useForm, useFormField } from '@cocrepo/hooks';

function LoginForm() {
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      await login(values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
      />
      <input
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Data Fetching Hooks

```tsx
import { useAsync, useAsyncFn } from '@cocrepo/hooks';

function UserProfile({ userId }) {
  const { data: user, loading, error } = useAsync(
    () => fetchUser(userId),
    [userId]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
}
```

## Available Hooks

### State Management
- `useBoolean` - Boolean state with helpers
- `useCounter` - Counter with increment/decrement
- `useToggle` - Toggle between values
- `usePrevious` - Access previous value
- `useLocalStorage` - Sync state with localStorage
- `useSessionStorage` - Sync state with sessionStorage

### Effects & Lifecycle
- `useDebounce` - Debounce value changes
- `useThrottle` - Throttle function calls
- `useInterval` - Declarative interval
- `useTimeout` - Declarative timeout
- `useUpdateEffect` - Skip first render effect
- `useMount` - Run effect on mount only
- `useUnmount` - Cleanup on unmount

### MobX Integration
- `useStore` - Access MobX root store
- `useObserver` - Observe MobX observables
- `useComputed` - Computed values from stores

### Forms & Validation
- `useForm` - Complete form management
- `useFormField` - Individual field management
- `useValidation` - Form validation utilities

### Data & Async
- `useAsync` - Async operations
- `useAsyncFn` - Async function wrapper
- `useFetch` - Simplified fetch wrapper

### DOM & Browser
- `useClickOutside` - Detect clicks outside element
- `useEventListener` - Add event listeners
- `useMediaQuery` - Responsive media queries
- `useWindowSize` - Window dimensions
- `useScroll` - Scroll position tracking

## Best Practices

1. **Composition** - Combine simple hooks for complex behavior
2. **Memoization** - Use `useMemo` and `useCallback` appropriately
3. **Dependencies** - Always specify correct dependency arrays
4. **Cleanup** - Return cleanup functions from effects
5. **Type Safety** - Leverage TypeScript for better DX

### Example: Complex Hook Composition

```tsx
import {
  useBoolean,
  useDebounce,
  useAsync,
  useLocalStorage
} from '@cocrepo/hooks';

function useSearchWithHistory(searchFn) {
  const [query, setQuery] = useLocalStorage('search-query', '');
  const [isSearching, { setTrue, setFalse }] = useBoolean(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data: results, error } = useAsync(async () => {
    if (!debouncedQuery) return [];
    setTrue();
    try {
      return await searchFn(debouncedQuery);
    } finally {
      setFalse();
    }
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error
  };
}
```

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## TypeScript Support

All hooks are fully typed:

```tsx
import type { UseFormReturn, UseBooleanReturn } from '@cocrepo/hooks';

const form: UseFormReturn<LoginFormValues> = useForm({
  initialValues: { email: '', password: '' }
});

const [isOpen, actions]: UseBooleanReturn = useBoolean(false);
```

## Dependencies

- `react` - React library
- `mobx` - MobX state management
- `mobx-react-lite` - React bindings for MobX
- `lodash-es` - Utility functions

## Peer Dependencies

Make sure these are installed in your app:
- `react` ^19.0.0
- `mobx` ^6.13.0
- `mobx-react-lite` ^4.1.0

## Contributing

When adding new hooks:
1. Follow the existing naming convention
2. Add TypeScript types
3. Write tests
4. Update documentation
5. Add usage examples

## License

ISC
