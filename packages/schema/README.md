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

- `pnpm run build` - Build the package
- `pnpm run dev` - Build in watch mode
- `pnpm run generate` - Generate Prisma client
- `pnpm run db:push` - Push schema to database
- `pnpm run db:studio` - Open Prisma Studio
- `pnpm run db:migrate` - Create and apply migrations
- `pnpm run db:seed` - Seed the database

## Schema Organization

The Prisma schema is organized into multiple files:

- `schema/schema.prisma` - Main configuration
- `schema/user.prisma` - User-related models
- `schema/role.prisma` - Role and permission models
- `schema/space.prisma` - Space-related models
- `schema/file.prisma` - File management models
- `schema/core.prisma` - Core business models

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection string (optional)
