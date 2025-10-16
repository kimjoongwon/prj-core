# @cocrepo/types

Shared TypeScript types and interfaces for the Cocrepo monorepo.

## Overview

`@cocrepo/types` provides common TypeScript type definitions, interfaces, and type utilities used across all applications and packages in the monorepo.

## Features

- 📘 **Shared Types** - Common type definitions across the monorepo
- 🎯 **Type-Safe** - Strict TypeScript types for better DX
- 🔄 **Reusable** - DRY principle for type definitions
- 🧩 **Modular** - Organized by domain and purpose
- ⚡ **Zero Runtime** - Types are erased at compile time

## Installation

```bash
pnpm add @cocrepo/types
```

## Usage

### Basic Types

```tsx
import type {
  User,
  Route,
  ApiResponse,
  PaginatedResult
} from '@cocrepo/types';

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
};

const response: ApiResponse<User> = {
  data: user,
  success: true,
  message: 'User fetched successfully'
};
```

### Generic Types

```tsx
import type { Nullable, Optional, Awaited } from '@cocrepo/types';

// Nullable type
const userName: Nullable<string> = null;

// Optional type
interface Config {
  apiUrl: string;
  timeout: Optional<number>;
}

// Awaited type for promises
type UserData = Awaited<ReturnType<typeof fetchUser>>;
```

### Component Props Types

```tsx
import type { ButtonProps, InputProps, ModalProps } from '@cocrepo/types';

const MyButton: React.FC<ButtonProps> = ({ variant, size, children }) => {
  return <button className={`btn-${variant}-${size}`}>{children}</button>;
};
```

### Table & Data Grid Types

```tsx
import type { ColumnDef, TableOptions, SortingState } from '@cocrepo/types';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'email',
    header: 'Email'
  }
];
```

### Form Types

```tsx
import type { FormField, ValidationRule, FormErrors } from '@cocrepo/types';

interface LoginForm {
  email: FormField<string>;
  password: FormField<string>;
}

const validationRules: ValidationRule[] = [
  { field: 'email', rule: 'required' },
  { field: 'email', rule: 'email' },
  { field: 'password', rule: 'minLength', value: 8 }
];
```

## Type Categories

### Core Types
- `User` - User entity
- `Route` - Route definition
- `Permission` - Permission types
- `Role` - User roles

### API Types
- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResult<T>` - Paginated data structure
- `ApiError` - Error response type
- `RequestParams` - Request parameter types

### Utility Types
- `Nullable<T>` - T | null
- `Optional<T>` - T | undefined
- `Maybe<T>` - T | null | undefined
- `DeepPartial<T>` - Recursive partial
- `DeepReadonly<T>` - Recursive readonly

### Component Types
- `ButtonProps` - Button component props
- `InputProps` - Input component props
- `ModalProps` - Modal component props
- `DropdownProps` - Dropdown component props

### Data Types
- `ColumnDef<T>` - Table column definition
- `SortingState` - Sorting state
- `FilterState` - Filter state
- `PaginationState` - Pagination state

## Type Guards

```tsx
import { isUser, isApiError, isPaginatedResult } from '@cocrepo/types';

if (isUser(data)) {
  // TypeScript knows data is User
  console.log(data.email);
}

if (isApiError(error)) {
  // TypeScript knows error is ApiError
  console.error(error.message, error.code);
}
```

## Type Utilities

### Pick and Omit

```tsx
import type { User } from '@cocrepo/types';

// Pick specific fields
type UserBasic = Pick<User, 'id' | 'name' | 'email'>;

// Omit sensitive fields
type UserPublic = Omit<User, 'password' | 'token'>;
```

### Partial and Required

```tsx
// Partial user for updates
type UserUpdate = Partial<User>;

// Required fields from optional type
type RequiredConfig = Required<OptionalConfig>;
```

## Best Practices

1. **Import Types with `type`** - Use `import type` for type-only imports
2. **Extend, Don't Modify** - Extend existing types rather than duplicating
3. **Use Generic Types** - Leverage TypeScript generics for reusability
4. **Document Types** - Add JSDoc comments for complex types
5. **Organize by Domain** - Group related types together

### Example: Extending Types

```tsx
import type { User } from '@cocrepo/types';

// Extend base User type
interface AdminUser extends User {
  adminLevel: number;
  permissions: string[];
}

// Compose types
type UserWithMetadata = User & {
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
};
```

## TypeScript Configuration

This package uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## Testing

```bash
# Type checking
pnpm type-check
```

## Dependencies

- `react` - React types (peer dependency)
- `@heroui/react` - HeroUI component types
- `@tanstack/react-table` - Table types

## Peer Dependencies

Make sure these are installed in your app:
- `react` ^19.0.0
- `typescript` ^5.0.0

## Contributing

When adding new types:
1. Group by domain or purpose
2. Add JSDoc comments
3. Export from index.ts
4. Update this README
5. Run type checking

## Migration Guide

If a type is renamed or moved:

```tsx
// Before
import { OldType } from '@cocrepo/types';

// After
import { NewType } from '@cocrepo/types';

// Add type alias for backward compatibility (temporary)
type OldType = NewType;
```

## License

ISC
