# @cocrepo/constants

Shared constants and configuration values for the Cocrepo monorepo.

## Overview

`@cocrepo/constants` provides centralized constant values, configuration options, and shared constants used across all applications and packages. This ensures consistency and makes it easy to update values in one place.

## Features

- 🎯 **Centralized Constants** - Single source of truth for shared values
- 🔒 **Type-Safe** - Full TypeScript support
- 📦 **Tree-Shakeable** - Import only what you need
- ⚙️ **Environment-Aware** - Different values for dev/staging/production
- 🎨 **Theme Constants** - Colors, spacing, breakpoints

## Installation

```bash
pnpm add @cocrepo/constants
```

## Usage

### API Configuration

```tsx
import { API_BASE_URL, API_TIMEOUT, API_ENDPOINTS } from '@cocrepo/constants';

const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`, {
    timeout: API_TIMEOUT
  });
  return response.json();
};
```

### Application Constants

```tsx
import {
  APP_NAME,
  APP_VERSION,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES
} from '@cocrepo/constants';

function AppHeader() {
  return (
    <header>
      <h1>{APP_NAME}</h1>
      <span>v{APP_VERSION}</span>
    </header>
  );
}
```

### Theme & Design Tokens

```tsx
import {
  COLORS,
  SPACING,
  BREAKPOINTS,
  FONT_SIZES,
  Z_INDEX
} from '@cocrepo/constants';

const styles = {
  padding: SPACING.md,
  color: COLORS.primary[500],
  fontSize: FONT_SIZES.lg,
  zIndex: Z_INDEX.modal
};
```

### Validation Constants

```tsx
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_PATTERN,
  EMAIL_PATTERN,
  MAX_FILE_SIZE
} from '@cocrepo/constants';

const validatePassword = (password: string) => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
};
```

### Route Constants

```tsx
import { ROUTES, ADMIN_ROUTES, API_ROUTES } from '@cocrepo/constants';

function Navigation() {
  return (
    <nav>
      <Link to={ROUTES.HOME}>Home</Link>
      <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
      <Link to={ADMIN_ROUTES.USERS}>Users</Link>
    </nav>
  );
}
```

## Available Constants

### Application
- `APP_NAME` - Application name
- `APP_VERSION` - Current version
- `APP_DESCRIPTION` - Application description
- `DEFAULT_LOCALE` - Default language
- `SUPPORTED_LOCALES` - Supported languages

### API Configuration
- `API_BASE_URL` - Base API URL
- `API_TIMEOUT` - Request timeout (ms)
- `API_RETRY_COUNT` - Retry attempts
- `API_ENDPOINTS` - Endpoint paths

### Theme & Design
- `COLORS` - Color palette
- `SPACING` - Spacing scale (xs, sm, md, lg, xl)
- `BREAKPOINTS` - Responsive breakpoints
- `FONT_SIZES` - Font size scale
- `FONT_WEIGHTS` - Font weight values
- `BORDER_RADIUS` - Border radius values
- `SHADOWS` - Box shadow presets
- `Z_INDEX` - Z-index layers

### Validation
- `PASSWORD_MIN_LENGTH` - Minimum password length
- `PASSWORD_MAX_LENGTH` - Maximum password length
- `USERNAME_MIN_LENGTH` - Minimum username length
- `USERNAME_PATTERN` - Username regex pattern
- `EMAIL_PATTERN` - Email regex pattern
- `PHONE_PATTERN` - Phone number regex pattern
- `MAX_FILE_SIZE` - Maximum file upload size
- `ALLOWED_FILE_TYPES` - Permitted file types

### Routes
- `ROUTES` - Public route paths
- `ADMIN_ROUTES` - Admin route paths
- `AUTH_ROUTES` - Authentication route paths
- `API_ROUTES` - API endpoint paths

### Feature Flags
- `FEATURES` - Enabled/disabled features
- `FEATURE_FLAGS` - Environment-specific flags

### Pagination
- `DEFAULT_PAGE_SIZE` - Default items per page
- `MAX_PAGE_SIZE` - Maximum items per page
- `PAGE_SIZE_OPTIONS` - Available page sizes

### Date & Time
- `DATE_FORMAT` - Default date format
- `TIME_FORMAT` - Default time format
- `DATETIME_FORMAT` - Default datetime format
- `TIMEZONE` - Default timezone

## Environment-Specific Values

Values can change based on environment:

```tsx
import { API_BASE_URL } from '@cocrepo/constants';

// Development: http://localhost:3006
// Staging: https://stg.cocdev.co.kr
// Production: https://cocdev.co.kr
console.log(API_BASE_URL);
```

## Best Practices

1. **Use Constants** - Avoid magic numbers and strings
2. **Centralize Values** - Don't duplicate constants across files
3. **Name Clearly** - Use descriptive, uppercase names
4. **Group Logically** - Organize by domain or purpose
5. **Document Usage** - Add comments for complex values

### Example: Feature Flag Pattern

```tsx
import { FEATURES } from '@cocrepo/constants';

function FeatureComponent() {
  if (!FEATURES.NEW_DASHBOARD) {
    return <LegacyDashboard />;
  }

  return <NewDashboard />;
}
```

### Example: Responsive Design

```tsx
import { BREAKPOINTS } from '@cocrepo/constants';

const mediaQueries = {
  mobile: `@media (max-width: ${BREAKPOINTS.sm})`,
  tablet: `@media (max-width: ${BREAKPOINTS.md})`,
  desktop: `@media (min-width: ${BREAKPOINTS.lg})`
};
```

## Build

```bash
# Build the package
pnpm build

# Development mode with watch
pnpm start:dev
```

## TypeScript Support

All constants are fully typed:

```tsx
import type { ColorPalette, Spacing, Breakpoint } from '@cocrepo/constants';

const customColors: ColorPalette = {
  primary: { 500: '#3b82f6' },
  secondary: { 500: '#8b5cf6' }
};
```

## Adding New Constants

When adding new constants:

1. **Choose appropriate category** - Add to existing or create new
2. **Use TypeScript** - Define types for complex constants
3. **Document usage** - Add JSDoc comments
4. **Export properly** - Export from index
5. **Update README** - Document the new constant

Example:

```tsx
/**
 * Maximum number of items to display in search results
 * @default 50
 */
export const MAX_SEARCH_RESULTS = 50;

/**
 * Debounce delay for search input in milliseconds
 * @default 300
 */
export const SEARCH_DEBOUNCE_DELAY = 300;
```

## Testing

When changing constants, verify:
- [ ] No breaking changes in consuming apps
- [ ] Environment-specific values are correct
- [ ] TypeScript types are accurate
- [ ] Documentation is updated

## Migration Guide

If a constant is renamed:

```tsx
// Before
import { OLD_CONSTANT } from '@cocrepo/constants';

// After
import { NEW_CONSTANT } from '@cocrepo/constants';

// Deprecated (add temporary alias)
export const OLD_CONSTANT = NEW_CONSTANT;
```

## Performance

- ✅ Zero runtime overhead for most constants
- ✅ Tree-shakeable exports
- ✅ Optimized bundle size
- ✅ No circular dependencies

## Contributing

Follow these guidelines:
1. Constants should be truly shared (used in 2+ packages)
2. Avoid package-specific values
3. Use uppercase with underscores
4. Group related constants
5. Add types for complex structures

## License

ISC
