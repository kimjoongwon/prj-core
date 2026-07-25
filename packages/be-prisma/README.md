# @cocrepo/db

Prisma 스키마 및 데이터베이스 클라이언트를 제공하는 패키지입니다.

> **중요**: 이 패키지는 리팩토링되어 **Prisma 전용** 패키지가 되었습니다.
> DTO, Entity, Enum, Decorator는 별도 패키지로 분리되었습니다.
>
> **스키마 파일 규칙**: [docs/schema-file-conventions.md](./docs/schema-file-conventions.md)
>
> **스키마 메타데이터 학습 가이드**: [docs/schema-metadata-guide.md](./docs/schema-metadata-guide.md)
>
> **스키마 변경 가이드**: [docs/schema-change-playbook.md](./docs/schema-change-playbook.md)
>
> **Seed 데이터 운영 가이드**: [docs/seed-data-governance.md](./docs/seed-data-governance.md)

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
- `pnpm schema:check` - 단일 폴더, 모델당 한 파일, 파일명과 메타데이터 계약 검사
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

이 패키지는 Prisma의 공식 multi-file schema 기능을 사용합니다. 파일은 도메인별 하위 폴더로 나누지 않고, `schema/` 루트에 모델당 하나씩 둡니다.

```text
packages/be-prisma/
├── schema/                 # 하위 디렉터리가 없는 Prisma schema source
│   ├── _base.prisma       # generator와 datasource
│   ├── _enums.prisma      # 모든 enum, 이름순
│   ├── ability.prisma     # model Ability 하나
│   ├── ai-agent-log.prisma
│   ├── user.prisma        # model User 하나
│   └── ...                # model 이름에서 파일명을 계산
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
- Prisma model 분류: [`docs/schema-metadata-guide.md`](./docs/schema-metadata-guide.md)가 정의하며 `reference-data` row 운영 정책과는 별도 판단
- `bootstrap default`: 처음 환경을 세울 때 넣는 기본값. 보통 create-only
- `demo data`: dev/stg 화면 확인과 샘플 시나리오용 데이터
- `seed.ts`: bootstrap CLI 진입점
- `data-migrate.ts`: reference-data migration CLI 진입점

### How It Works

Prisma는 `schema/`의 모든 `.prisma` 파일을 자동으로 하나의 스키마처럼 읽습니다.

1. model 이름을 kebab-case로 바꾼 루트 파일을 수정합니다.
2. 새 model은 계산된 파일에 하나만 선언합니다.
3. enum은 `_enums.prisma`에 이름순으로 추가합니다.
4. 모든 model에 메타데이터 가이드의 모델 계약을 적용합니다.
5. `pnpm schema:check`로 구조를 검사합니다.
6. `pnpm generate`로 client를 생성하고, 필요하면 `pnpm db:migrate`로 migration을 만듭니다.

별도 merge script는 필요하지 않습니다. Prisma가 multi-file schema를 직접 처리합니다.

### 모델 메타데이터 계약

메타데이터 종류와 형식, 데이터 타입, Aggregate Root, Prisma 문서 주석과 기본 속성의 구분은 [`docs/schema-metadata-guide.md`](./docs/schema-metadata-guide.md)가 단독으로 소유합니다. 모든 model 파일은 이 계약을 따릅니다.

파일 이름은 아래 규칙으로만 계산합니다.

```ts
name
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
  .toLowerCase();
```

예를 들어 `OidcClient`는 `schema/oidc-client.prisma`, `AIAgentLog`는 `schema/ai-agent-log.prisma`입니다. 전체 모델 경로 목록은 따로 관리하지 않으며 실제 schema가 단일 기준입니다.

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

- **66 schema files**: 64 model files + `_base.prisma` + `_enums.prisma`
- **64 models**: one model per root file
- **32 enums**: all declared in `_enums.prisma`
- **96 declarations**: 64 models + 32 enums
- **0 schema subdirectories**
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
