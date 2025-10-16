# @cocrepo/utils

Shared utility functions and helpers for the Cocrepo monorepo.

## Overview

`@cocrepo/utils` provides a comprehensive collection of utility functions for common tasks including data transformation, validation, date manipulation, logging, and type conversion.

## Features

- 🛠️ **Utility Functions** - Common data manipulation and transformation
- 📅 **Date Utilities** - Date formatting and manipulation with dayjs
- 🔍 **Validation** - Class-validator based validation utilities
- 🎯 **Type Transformation** - Class-transformer for DTO/model conversion
- 📝 **Logging** - Structured logging utilities
- 🔄 **Data Parsing** - Path parsing and route matching

## Installation

```bash
pnpm add @cocrepo/utils
```

## Usage

### Data Transformation

```tsx
import { transformToDto, transformFromDto } from '@cocrepo/utils';

// Transform plain object to DTO instance
const userDto = transformToDto(UserDto, plainObject);

// Transform DTO to plain object
const plainUser = transformFromDto(userDto);
```

### Validation

```tsx
import { validateDto, isValid } from '@cocrepo/utils';

async function createUser(data: CreateUserDto) {
  const errors = await validateDto(data);

  if (errors.length > 0) {
    throw new ValidationError('Invalid user data', errors);
  }

  // Proceed with valid data
}
```

### Date Utilities

```tsx
import {
  formatDate,
  parseDate,
  isAfter,
  isBefore,
  addDays
} from '@cocrepo/utils';

// Format dates
const formatted = formatDate(new Date(), 'YYYY-MM-DD');

// Parse dates
const date = parseDate('2024-01-15');

// Date comparisons
if (isAfter(date1, date2)) {
  // date1 is after date2
}

// Date arithmetic
const futureDate = addDays(new Date(), 7);
```

### Logging

```tsx
import { createLogger, logger } from '@cocrepo/utils';

// Create namespaced logger
const log = createLogger('[MyComponent]');

log.info('User logged in', { userId: 123 });
log.warn('Rate limit approaching');
log.error('Failed to fetch data', error);

// Use global logger
logger.debug('Debug information');
```

### Navigation Utilities

```tsx
import { navigateTo, parseRoute } from '@cocrepo/utils';

// Programmatic navigation
navigateTo('/users/123');

// Parse route with parameters
const { params } = parseRoute('/users/:id', '/users/123');
console.log(params.id); // '123'
```

### Array Utilities

```tsx
import {
  chunk,
  unique,
  groupBy,
  sortBy,
  flattenDeep
} from '@cocrepo/utils';

// Chunk array into smaller arrays
const chunks = chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]

// Get unique values
const uniqueValues = unique([1, 2, 2, 3, 3, 3]);
// [1, 2, 3]

// Group by property
const grouped = groupBy(users, 'role');
// { admin: [...], user: [...] }

// Sort by property
const sorted = sortBy(users, 'name');
```

### Object Utilities

```tsx
import {
  pick,
  omit,
  merge,
  cloneDeep,
  isEmpty
} from '@cocrepo/utils';

// Pick specific properties
const subset = pick(user, ['id', 'name', 'email']);

// Omit specific properties
const safe = omit(user, ['password', 'token']);

// Deep merge objects
const merged = merge(defaults, options);

// Deep clone
const clone = cloneDeep(original);

// Check if empty
if (isEmpty(obj)) {
  // Object is empty
}
```

### String Utilities

```tsx
import {
  capitalize,
  camelCase,
  snakeCase,
  kebabCase,
  truncate
} from '@cocrepo/utils';

// Capitalize first letter
const title = capitalize('hello world'); // 'Hello world'

// Case transformations
const camel = camelCase('hello-world'); // 'helloWorld'
const snake = snakeCase('helloWorld'); // 'hello_world'
const kebab = kebabCase('helloWorld'); // 'hello-world'

// Truncate strings
const short = truncate('Long text here...', 10); // 'Long text...'
```

### Type Guards

```tsx
import {
  isString,
  isNumber,
  isArray,
  isObject,
  isFunction,
  isNil
} from '@cocrepo/utils';

if (isString(value)) {
  // TypeScript knows value is string
  console.log(value.toUpperCase());
}

if (isArray(value)) {
  // TypeScript knows value is array
  value.forEach(item => console.log(item));
}
```

## API Reference

### Transformation
- `transformToDto<T>(cls: Class<T>, plain: any): T`
- `transformFromDto<T>(dto: T): any`
- `transformArray<T>(cls: Class<T>, array: any[]): T[]`

### Validation
- `validateDto<T>(dto: T): Promise<ValidationError[]>`
- `isValid<T>(dto: T): Promise<boolean>`

### Date & Time
- `formatDate(date: Date, format: string): string`
- `parseDate(dateString: string): Date`
- `addDays(date: Date, days: number): Date`
- `addMonths(date: Date, months: number): Date`
- `isAfter(date1: Date, date2: Date): boolean`
- `isBefore(date1: Date, date2: Date): boolean`

### Logging
- `createLogger(namespace: string): Logger`
- `logger.info/warn/error/debug(message: string, ...args: any[])`

### Navigation
- `navigateTo(path: string): void`
- `parseRoute(pattern: string, path: string): RouteMatch`

### Collections (from remeda & lodash)
- Array: `chunk`, `unique`, `flatten`, `groupBy`, `sortBy`
- Object: `pick`, `omit`, `merge`, `clone`, `isEmpty`
- String: `capitalize`, `camelCase`, `snakeCase`, `kebabCase`

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# UI mode
pnpm test:ui
```

## Build

```bash
# Build the package
pnpm build

# Development mode with watch
pnpm start:dev
```

## TypeScript Support

Full TypeScript support with type definitions:

```tsx
import type { Logger, ValidationError, RouteMatch } from '@cocrepo/utils';

const logger: Logger = createLogger('[App]');

function handleValidation(errors: ValidationError[]) {
  errors.forEach(error => {
    console.log(error.property, error.constraints);
  });
}
```

## Dependencies

### Core Dependencies
- `lodash-es` - Utility functions

### Peer Dependencies
- `class-transformer` - Object transformation
- `class-validator` - Validation
- `dayjs` - Date manipulation
- `path-parser` - Route parsing
- `reflect-metadata` - Metadata reflection
- `remeda` - Functional utilities

## Best Practices

1. **Import Selectively** - Tree-shaking optimizes bundle size
2. **Use Type Guards** - Leverage TypeScript narrowing
3. **Validate Early** - Validate at boundaries (API, forms)
4. **Log Strategically** - Use namespaced loggers for context
5. **Immutable Operations** - Prefer immutable transformations

### Example: Complete Validation Flow

```tsx
import {
  transformToDto,
  validateDto,
  createLogger
} from '@cocrepo/utils';

const logger = createLogger('[UserService]');

async function createUser(data: unknown) {
  // Transform to DTO
  const userDto = transformToDto(CreateUserDto, data);

  // Validate
  const errors = await validateDto(userDto);
  if (errors.length > 0) {
    logger.error('Validation failed', { errors });
    throw new ValidationError('Invalid user data', errors);
  }

  // Process valid data
  logger.info('Creating user', { email: userDto.email });
  return await saveUser(userDto);
}
```

## Performance

- ✅ Tree-shakeable exports
- ✅ ESM and CommonJS builds
- ✅ Optimized bundle size
- ✅ No runtime overhead for type guards

## Contributing

When adding new utilities:
1. Group related functions logically
2. Add JSDoc comments
3. Write unit tests
4. Update documentation
5. Consider tree-shaking impact

## License

ISC
