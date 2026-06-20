# @cocrepo/db

Prisma 스키마 및 데이터베이스 클라이언트를 제공하는 패키지입니다.

> **중요**: 이 패키지는 리팩토링되어 **Prisma 전용** 패키지가 되었습니다.
> DTO, Entity, Enum, Decorator는 별도 패키지로 분리되었습니다.
>
> **스키마 변경 가이드**: [docs/schema-change-playbook.md](./docs/schema-change-playbook.md)

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
- `pnpm schema:check` - Validate strict schema file ownership/conventions
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

#### DB Seed (레거시 alias)

```bash
pnpm db:seed          # 개발 환경 bootstrap alias
pnpm db:seed:stg      # 스테이징 bootstrap alias
# ⚠️ prod alias는 제공하지 않음
```

관련 운영 원칙 문서:

- `docs/seed-data-governance.md` - seed/reference/bootstrap/demo 분류 기준과 운영 반영 전략
- `docs/schema-change-playbook.md` - 운영 중 필드 추가, schema migration, reference-data migration, backfill 실무 절차

#### DB Bootstrap (초기 구조 + 기본값 + 샘플 데이터)

```bash
pnpm db:bootstrap      # 개발 환경 bootstrap
pnpm db:bootstrap:stg  # 스테이징 bootstrap
```

`db:seed`는 `db:bootstrap`의 별칭입니다. 실제 bootstrap orchestration은 `seed.ts`가 아니라 `src/bootstrap/run-bootstrap.ts`에 있습니다.

#### DB Data Migrate (운영 기준 데이터)

```bash
pnpm db:data:migrate       # 개발 환경 reference data migration
pnpm db:data:migrate:stg   # 스테이징 environment reference data migration
pnpm db:data:migrate:prod  # 프로덕션 environment reference data migration
```

운영 자동 반영 경로는 `db:data:migrate[:env]`입니다. 이 경로는 code-owned reference data만 이력과 함께 반영합니다.

## Multi-File Schema Architecture (Prisma Official)

This project uses **Prisma's official multi-file schema support** (GA since Prisma 6.7.0) to organize models into separate domain files:

```text
packages/be-prisma/
├── schema/                 # Prisma multi-file schema source
├── migrations/             # Prisma schema migration SQL
├── src/
│   ├── bootstrap/
│   │   ├── data/           # Bootstrap default definitions
│   │   └── *.ts            # Bootstrap runtime orchestration
│   ├── demo-data/          # Dev/stg demo definitions
│   ├── generated/          # Generated Prisma client
│   ├── reference-data/
│   │   ├── definitions/    # Code-owned reference-data definitions
│   │   ├── migrations/     # Versioned reference-data migrations
│   │   └── *.ts            # Reference-data sync / runner
│   └── prisma-client.ts    # Shared Prisma client factory
├── data-migrate.ts         # Reference-data migration CLI entrypoint
└── seed.ts                 # Bootstrap CLI entrypoint
```

### Terminology

- `reference-data`: 운영에서도 코드가 기준이어야 하는 카탈로그/계약 row
- `bootstrap default`: 처음 환경을 세울 때 넣는 기본값. 보통 create-only
- `demo data`: dev/stg 화면 확인과 샘플 시나리오용 데이터
- `seed.ts`: bootstrap CLI 진입점
- `data-migrate.ts`: reference-data migration CLI 진입점

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

- **56 models** across 29 domain files (`_base.prisma` excluded)
- **25 enums** for type safety
- Automatic cross-file model referencing (no imports needed)

## Environment Variables

### 환경 설정

환경별로 데이터베이스에 연결하려면 `.env` 파일을 생성하고 다음 변수들을 설정하세요.

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

1. `.env.example` 파일을 `.env`로 복사:
   ```bash
   cp .env.example .env
   ```

2. `.env` 파일의 값을 실제 데이터베이스 정보로 변경

3. ⚠️ **절대 `.env` 파일을 커밋하지 마세요!**

#### 동작 방식

- `pnpm db:pull` → `DATABASE_URL` 사용 (기본값)
- `pnpm db:pull:stg` → `DATABASE_URL_STG`를 `DATABASE_URL`로 매핑하여 사용
- `pnpm db:pull:prod` → `DATABASE_URL_PROD`를 `DATABASE_URL`로 매핑하여 사용

내부적으로 `cross-env` 패키지를 사용하여 크로스 플랫폼 호환성을 보장합니다.
