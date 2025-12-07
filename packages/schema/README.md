# @shared/prisma

Shared Prisma schema and types for the core project.

## Features

- Centralized Prisma schema management
- Type-safe database client
- Common database utilities
- Shared database types across backend services

## Installation

This package is part of the workspace and is automatically available to other packages.

## Usage

### Basic Usage

```typescript
import { PrismaClient, prisma } from "@shared/prisma";

// Use the default instance
const users = await prisma.user.findMany();

// Or create your own instance
const customClient = new PrismaClient();
```

### Type Exports

```typescript
import type { User, CreateInput, UpdateInput } from "@shared/prisma";

// Use generated Prisma types
type UserData = User;

// Use utility types
type CreateUserInput = CreateInput<User>;
type UpdateUserInput = UpdateInput<User>;
```

## Scripts

### Development
- `pnpm generate` - Generate Prisma client from multi-file schema
- `pnpm build` - Build the package
- `pnpm start:dev` - Build in watch mode

### Database Operations
- `pnpm db:push` - Push schema to database
- `pnpm db:pull` - Pull schema from database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:migrate:deploy` - Deploy migrations to production
- `pnpm db:reset` - Reset database and re-run migrations
- `pnpm db:seed` - Seed the database

## Multi-File Schema Architecture (Prisma Official)

This project uses **Prisma's official multi-file schema support** (GA since Prisma 6.7.0) to organize models into separate domain files:

```
prisma/
├── schema/              # Multi-file schema directory
│   ├── _base.prisma     # Generator and datasource configuration
│   ├── core.prisma      # Core business models (Tenant, Category, etc.)
│   ├── user.prisma      # User and authentication models
│   ├── role.prisma      # Role-based access control models
│   ├── space.prisma     # Space management models
│   ├── file.prisma      # File management models
│   └── task.prisma      # Task and timeline models
├── migrations/          # Database migrations
└── seed.ts             # Database seeding script
```

### How It Works

Prisma automatically combines all `.prisma` files in the `prisma/schema/` directory:

1. **Edit any schema file**: Make changes to files in `prisma/schema/`
2. **Generate client**: Run `pnpm generate`
3. **Create migrations**: Run `pnpm db:migrate`

✅ **No merge script needed** - Prisma handles it natively!

### Configuration

The multi-file schema is configured in `prisma.config.ts`:

```typescript
export default defineConfig({
  schema: "./prisma/schema",  // Points to directory, not file
  // ...
})
```

### Schema Statistics

Current schema contains:
- **30 models** across 6 domain files
- **14 enums** for type safety
- Automatic cross-file model referencing (no imports needed)

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection string (optional)
