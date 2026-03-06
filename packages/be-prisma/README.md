# @cocrepo/db

Prisma 스키마 및 데이터베이스 클라이언트를 제공하는 패키지입니다.

> **중요**: 이 패키지는 리팩토링되어 **Prisma 전용** 패키지가 되었습니다.
> DTO, Entity, Enum, Decorator는 별도 패키지로 분리되었습니다.
>
> **마이그레이션 가이드**: [docs/SCHEMA-REFACTORING.md](../../docs/SCHEMA-REFACTORING.md)

## 분리된 패키지

| 기능                  | 새 패키지            |
| --------------------- | -------------------- |
| Data Transfer Objects | `@cocrepo/dto`       |
| 엔티티 정의           | `@cocrepo/entity`    |
| 열거형                | `@cocrepo/enum`     |
| 데코레이터            | `@cocrepo/decorator` |
| 스키마 상수           | `@cocrepo/constant` |

## 현재 패키지 역할

- Prisma 스키마 관리
- 타입 안전 데이터베이스 클라이언트
- 마이그레이션 관리
- 시드 데이터

## 주요 기능

- Prisma 멀티 파일 스키마 지원
- 타입 안전 데이터베이스 클라이언트
- 공통 데이터베이스 유틸리티
- 백엔드 서비스 간 공유 타입

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

환경별로 실행 가능한 스크립트를 제공합니다:

#### DB Pull (스키마 역생성)

```bash
pnpm db:pull          # 개발 환경 (기본값)
pnpm db:pull:stg      # 스테이징 환경
pnpm db:pull:prod     # 프로덕션 환경
```

#### DB Push (스키마 적용 - 마이그레이션 없이)

```bash
pnpm db:push          # 개발 환경 (기본값)
pnpm db:push:stg      # 스테이징 환경
pnpm db:push:prod     # 프로덕션 환경 ⚠️ 주의
```

#### DB Studio (GUI 툴)

```bash
pnpm db:studio        # 개발 환경 (기본값)
pnpm db:studio:stg    # 스테이징 환경
pnpm db:studio:prod   # 프로덕션 환경
```

#### DB Migrate (마이그레이션)

```bash
pnpm db:migrate                # 개발 환경 (마이그레이션 생성 및 적용)
pnpm db:migrate:deploy         # 개발 환경 (마이그레이션 배포)
pnpm db:migrate:deploy:stg     # 스테이징 환경
pnpm db:migrate:deploy:prod    # 프로덕션 환경
```

#### DB Reset (데이터베이스 초기화)

```bash
pnpm db:reset         # 개발 환경 (기본값)
pnpm db:reset:stg     # 스테이징 환경
# ⚠️ prod는 위험하므로 제공하지 않음
```

#### DB Seed (시드 데이터)

```bash
pnpm db:seed          # 개발 환경 (기본값)
pnpm db:seed:stg      # 스테이징 환경
# ⚠️ prod는 시드하지 않음
```

## Multi-File Schema Architecture (Prisma Official)

This project uses **Prisma's official multi-file schema support** (GA since Prisma 6.7.0) to organize models into separate domain files:

```
packages/be-prisma/
├── schema/              # Multi-file schema directory
│   ├── _base.prisma     # Generator and datasource configuration
│   ├── core.prisma      # Core shared models (Category, Group, Tenant, etc.)
│   ├── user.prisma      # User domain
│   ├── role.prisma      # Role domain
│   ├── space.prisma     # Space domain
│   ├── asset.prisma     # Asset/media domain (replaces file domain)
│   ├── task.prisma      # Task/timeline domain
│   ├── inquiry.prisma   # Inquiry domain
│   ├── auth.prisma      # Auth/security domain
│   ├── grant.prisma     # CASL grant domain
│   ├── template.prisma  # Message template domain
│   ├── translation.prisma
│   ├── oidc.prisma
│   └── safe.prisma
├── migrations/          # Database migrations
└── seed.ts              # Database seeding script
```

### How It Works

Prisma automatically combines all `.prisma` files in the `schema/` directory:

1. **Edit any schema file**: Make changes to files in `schema/`
2. **Generate client**: Run `pnpm generate`
3. **Create migrations**: Run `pnpm db:migrate`

✅ **No merge script needed** - Prisma handles it natively!

### Configuration

The multi-file schema is configured in `prisma.config.ts`:

```typescript
export default defineConfig({
  schema: "./schema", // Points to directory, not file
  // ...
});
```

### Schema Statistics

Current schema contains:

- **56 models** across 13 domain files (`_base.prisma` excluded)
- **30 enums** for type safety
- Automatic cross-file model referencing (no imports needed)

## Environment Variables

### 환경 설정

환경별로 데이터베이스에 연결하려면 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요.

#### 필수 환경 변수

```env
# Development Environment (기본값)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Staging Environment
DATABASE_URL_STG="postgresql://user:password@stg-host:5432/dbname?schema=public"
DIRECT_URL_STG="postgresql://user:password@stg-host:5432/dbname?schema=public"

# Production Environment
DATABASE_URL_PROD="postgresql://user:password@prod-host:5432/dbname?schema=public"
DIRECT_URL_PROD="postgresql://user:password@prod-host:5432/dbname?schema=public"
```

#### 환경 파일 설정

1. `.env.example` 파일을 `.env.local`로 복사:
   ```bash
   cp .env.example .env.local
   ```

2. `.env.local` 파일의 값을 실제 데이터베이스 정보로 변경

3. ⚠️ **절대 `.env.local` 파일을 커밋하지 마세요!**

#### 동작 방식

- `pnpm db:pull` → `DATABASE_URL` 사용 (기본값)
- `pnpm db:pull:stg` → `DATABASE_URL_STG`를 `DATABASE_URL`로 매핑하여 사용
- `pnpm db:pull:prod` → `DATABASE_URL_PROD`를 `DATABASE_URL`로 매핑하여 사용

내부적으로 `cross-env` 패키지를 사용하여 크로스 플랫폼 호환성을 보장합니다.
