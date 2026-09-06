# @cocrepo/constant

프로젝트 전반에서 사용하는 공통 상수 및 설정 값을 제공하는 패키지입니다.

## 개요

`@cocrepo/constant`는 모든 애플리케이션과 패키지에서 사용하는 상수 값, 설정 옵션, 공유 상수를 제공합니다. 이를 통해 일관성을 유지하고 한 곳에서 값을 쉽게 업데이트할 수 있습니다.

## 디렉토리 구조

```
src/
├── routing/              # 프론트엔드 라우팅 상수
│   ├── endpoints.ts      # API 엔드포인트 경로
│   ├── route-names.ts    # 라우트 이름 상수
│   └── index.ts
├── schema/               # 백엔드 스키마 상수
│   ├── api-description.constant.ts   # API 문서 설명
│   ├── default-object.constant.ts    # 기본값 객체
│   ├── entity-common-fields.ts       # 엔티티 공통 필드
│   ├── language-code.constant.ts     # 언어 코드
│   ├── order.constant.ts             # 정렬 순서
│   ├── role-type.constant.ts         # 역할 타입
│   ├── token.constant.ts             # 토큰 상수
│   ├── token-types.constant.ts       # 토큰 타입
│   ├── types.ts                      # 유틸리티 타입
│   └── index.ts
└── index.ts
```

## 라우팅 상수 사용

```typescript
// 프론트엔드 라우팅
import { ROUTE_ENDPOINTS, ROUTE_NAMES } from "@cocrepo/constant/routing";

// 관리자 대시보드 경로
const dashboardPath = ROUTE_ENDPOINTS.ADMIN.DASHBOARD;
const dashboardName = ROUTE_NAMES.ADMIN.DASHBOARD;
```

## 스키마 상수 사용

```typescript
// 백엔드 스키마 상수
import {
  API_DESCRIPTIONS,
  DEFAULT_OBJECTS,
  LANGUAGE_CODES,
} from "@cocrepo/constant/schema";

// API 설명문
const userDescription = API_DESCRIPTIONS.USER.CREATE;

// 기본값 객체
const defaultPagination = DEFAULT_OBJECTS.PAGINATION;
```

## Features

- 🎯 **중앙화된 상수** - 공유 값의 단일 기준
- 🔒 **Type-Safe** - Full TypeScript support
- 📦 **Tree-Shakeable** - Import only what you need
- ⚙️ **Environment-Aware** - Different values for dev/staging/production
- 🎨 **Theme Constants** - Colors, spacing, breakpoints

## Installation

```bash
pnpm add @cocrepo/constant
```

## Usage

### API Configuration

```tsx
import { API_BASE_URL, API_TIMEOUT, API_ENDPOINTS } from "@cocrepo/constant";

const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`, {
    timeout: API_TIMEOUT,
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
  SUPPORTED_LOCALES,
} from "@cocrepo/constant";

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
  Z_INDEX,
} from "@cocrepo/constant";

const styles = {
  padding: SPACING.md,
  color: COLORS.primary[500],
  fontSize: FONT_SIZES.lg,
  zIndex: Z_INDEX.modal,
};
```

### Validation Constants

```tsx
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_PATTERN,
  EMAIL_PATTERN,
  MAX_FILE_SIZE,
} from "@cocrepo/constant";

const validatePassword = (password: string) => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
};
```

### Route Constants

```tsx
import { ROUTES, ADMIN_ROUTES, API_ROUTES } from "@cocrepo/constant";

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
import { API_BASE_URL } from "@cocrepo/constant";

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
import { FEATURES } from "@cocrepo/constant";

function FeatureComponent() {
  if (!FEATURES.NEW_DASHBOARD) {
    return <LegacyDashboard />;
  }

  return <NewDashboard />;
}
```

### Example: Responsive Design

```tsx
import { BREAKPOINTS } from "@cocrepo/constant";

const mediaQueries = {
  mobile: `@media (max-width: ${BREAKPOINTS.sm})`,
  tablet: `@media (max-width: ${BREAKPOINTS.md})`,
  desktop: `@media (min-width: ${BREAKPOINTS.lg})`,
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
import type { ColorPalette, Spacing, Breakpoint } from "@cocrepo/constant";

const customColors: ColorPalette = {
  primary: { 500: "#3b82f6" },
  secondary: { 500: "#8b5cf6" },
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
import { OLD_CONSTANT } from "@cocrepo/constant";

// After
import { NEW_CONSTANT } from "@cocrepo/constant";

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

## 역할·공간 분류 기준

`src/reference-enum`은 Prisma enum이 아닌 역할·공간 분류의 코드와 한글 이름을
소유합니다. `RoleCategoryName`, `RoleGroupName`, `SpaceCategoryName`,
`SpaceGroupName`과 공통 `BaseEnum`을 공개합니다. Prisma 기준 데이터는 이 패키지를
직접 사용하고, 기존 UI 소비를 위해 `@cocrepo/enum`에서도 분류 이름을 재export합니다.
