# @cocrepo/providers

React Provider components for context management and library integrations.

## Overview

`@cocrepo/providers` provides a centralized collection of Provider components that wrap your application with necessary context and library configurations. This ensures consistent setup across all apps in the monorepo.

## Features

- 🎯 **QueryProvider** - React Query configuration and setup
- 📚 **LibProvider** - External library integrations (HeroUI, Nuqs)
- 🔄 **Composable** - Mix and match providers as needed
- 🎨 **Zero Config** - Sensible defaults out of the box

## Installation

```bash
pnpm add @cocrepo/providers
```

## Providers

### QueryProvider

Configures React Query for data fetching and caching.

```tsx
import { QueryProvider } from '@cocrepo/providers';

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

**Features**:
- Pre-configured QueryClient with optimal defaults
- React Query Devtools in development
- Automatic query invalidation
- Global error handling

### LibProvider

Integrates external UI and state libraries.

```tsx
import { LibProvider } from '@cocrepo/providers';

function App() {
  return (
    <LibProvider>
      <YourApp />
    </LibProvider>
  );
}
```

**Includes**:
- **NuqsAdapter**: URL state synchronization
- **ToastProvider**: HeroUI toast notifications

## Usage Patterns

### Basic Setup

```tsx
import { QueryProvider, LibProvider } from '@cocrepo/providers';

function App() {
  return (
    <QueryProvider>
      <LibProvider>
        <YourApp />
      </LibProvider>
    </QueryProvider>
  );
}
```

### Storybook Integration

```tsx
// .storybook/preview.jsx
import { QueryProvider, LibProvider } from '@cocrepo/providers';

export const decorators = [
  (Story) => (
    <QueryProvider>
      <LibProvider>
        <Story />
      </LibProvider>
    </QueryProvider>
  ),
];
```

### Testing

```tsx
import { QueryProvider, LibProvider } from '@cocrepo/providers';
import { render } from '@testing-library/react';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryProvider>
      <LibProvider>
        {ui}
      </LibProvider>
    </QueryProvider>
  );
}

test('component renders', () => {
  renderWithProviders(<MyComponent />);
});
```

## Provider Details

### QueryProvider Props

```tsx
interface QueryProviderProps {
  children: React.ReactNode;
}
```

**Default Configuration**:
- Retry failed queries 3 times
- Cache time: 5 minutes
- Stale time: 0 (immediate refetch)
- Refetch on window focus: enabled

### LibProvider Props

```tsx
interface LibProviderProps {
  children: React.ReactNode;
}
```

**Configured Libraries**:
- **Nuqs**: URL search params management
- **HeroUI Toast**: Bottom-center placement by default

## Best Practices

1. **Wrap at App Root**: Place providers at the highest level
2. **Order Matters**: QueryProvider → LibProvider → App
3. **Minimal Nesting**: Only use providers you need
4. **Test Isolation**: Wrap test components with required providers

### Recommended Order

```tsx
<QueryProvider>        {/* Data layer */}
  <LibProvider>        {/* UI libraries */}
    <YourApp />        {/* Application */}
  </LibProvider>
</QueryProvider>
```

## Customization

### Custom QueryClient

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

### Selective Providers

Only use what you need:

```tsx
// Component library only (no data fetching)
<LibProvider>
  <YourApp />
</LibProvider>

// Data fetching only (no UI libraries)
<QueryProvider>
  <YourApp />
</QueryProvider>
```

## Migration Guide

### From @cocrepo/ui

```tsx
// Before
import { QueryProvider, UIProviders } from '@cocrepo/ui';

// After
import { QueryProvider, LibProvider } from '@cocrepo/providers';
```

### From @cocrepo/store

```tsx
// Before
import { AppProviders } from '@cocrepo/store';

<AppProviders>
  <App />
</AppProviders>

// After
import { QueryProvider, LibProvider } from '@cocrepo/providers';

<QueryProvider>
  <LibProvider>
    <App />
  </LibProvider>
</QueryProvider>
```

## Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `@heroui/react` - UI component library
- `nuqs` - URL state management

## Peer Dependencies

- `react` ^19.0.0
- `react-dom` ^19.0.0

## TypeScript Support

Full TypeScript support with type definitions:

```tsx
import type { QueryClient } from '@tanstack/react-query';
import { QueryProvider } from '@cocrepo/providers';
```

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## Contributing

When adding new providers:
1. Keep them focused and single-purpose
2. Provide sensible defaults
3. Document all props and behavior
4. Add tests
5. Update this README

## License

ISC
