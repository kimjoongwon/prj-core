# 🚀 Prisma 7 마이그레이션 계획서

> **현재 버전**: Prisma 6.11.1 → **목표 버전**: Prisma 7.x
>
> **작성일**: 2025-12-06
>
> **프로젝트**: @cocrepo monorepo

## 📊 현재 상태 분석

### 패키지 구조
```
packages/schema/
├── prisma/
│   ├── schema.prisma           # ⚠️ datasource 설정 변경 필요
│   ├── models/                 # 모델 파일들 (변경 불필요)
│   ├── migrations/             # 기존 마이그레이션 유지
│   └── seed.ts                 # ✅ PrismaClient 사용 - 수정 필요
├── src/
│   ├── index.ts                # ✅ PrismaClient export
│   └── entity/                 # ✅ @prisma/client import
└── package.json                # ⚠️ Prisma 버전 업데이트 필요
```

### PrismaClient 사용처
1. **`apps/server/src/shared/service/utils/prisma.service.ts`** ⭐
   - NestJS PrismaService (extends PrismaClient)
   - **영향도**: 🔴 높음 - 핵심 서비스

2. **`packages/schema/prisma/seed.ts`**
   - DB 시딩 스크립트
   - **영향도**: 🟡 중간

3. **`packages/schema/src/__tests__/prisma.test.ts`**
   - 테스트 코드
   - **영향도**: 🟢 낮음

4. **`apps/server/src/shared/test/test-database.ts`**
   - 테스트 데이터베이스
   - **영향도**: 🟢 낮음

### 현재 설정
```prisma
// packages/schema/prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        # ⚠️ Prisma 7에서 deprecated
  directUrl = env("DIRECT_URL")          # ⚠️ Prisma 7에서 deprecated
}
```

---

## 🎯 Prisma 7 주요 변경사항

### 1. **데이터소스 설정 분리** (Breaking Change)

**Before (Prisma 6)**:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**After (Prisma 7)**:
```prisma
datasource db {
  provider = "postgresql"
  // url과 directUrl 제거
}
```

```typescript
// prisma.config.ts (새로 생성)
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'packages/schema/prisma/schema.prisma',
  migrations: {
    path: 'packages/schema/prisma/migrations',
    seed: 'tsx packages/schema/prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
})
```

### 2. **PrismaClient Adapter 필수** (Breaking Change)

**Before (Prisma 6)**:
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

**After (Prisma 7)**:
```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

### 3. **환경변수 자동 로딩 제거** (Breaking Change)

**Before (Prisma 6)**: 자동으로 `.env` 파일 로딩

**After (Prisma 7)**: 명시적으로 로딩 필요
```typescript
import 'dotenv/config'  // 또는 dotenv.config()
```

### 4. **생성 경로 변경** (선택적)

**Before (Prisma 6)**: `node_modules/.prisma/client`

**After (Prisma 7)**: 프로젝트 소스 내 (예: `packages/schema/generated`)

---

## ⚠️ Breaking Changes 영향도 분석

| 변경사항 | 영향받는 파일 | 영향도 | 조치 필요 |
|---------|-------------|--------|----------|
| **datasource 설정** | `schema.prisma` | 🔴 높음 | `prisma.config.ts` 생성 |
| **PrismaClient Adapter** | `prisma.service.ts`, `seed.ts`, 테스트 파일 | 🔴 높음 | Adapter 추가 |
| **환경변수 로딩** | 모든 PrismaClient 사용처 | 🟡 중간 | `dotenv/config` import |
| **생성 경로** | `tsconfig.json`, import 경로 | 🟢 낮음 | 선택적 |
| **타입 생성** | TypeScript 설정 | 🟢 낮음 | `prisma generate` 재실행 |

### NestJS 통합 이슈

**특별 주의**: NestJS + Prisma 7 조합에서 알려진 이슈 존재
- [GitHub Issue #28573](https://github.com/prisma/prisma/issues/28573)
- [Stack Overflow](https://stackoverflow.com/questions/79827833/stuck-with-prisma-error-after-updating-to-v7)

**해결 방법**: Adapter를 NestJS 의존성 주입과 통합 필요

---

## 📋 마이그레이션 단계별 계획

### Phase 0: 준비 단계 (사전 작업)

#### 0-1. 백업 및 브랜치 생성
```bash
# 새 브랜치 생성
git checkout -b feature/prisma-7-migration

# 현재 상태 커밋
git add .
git commit -m "chore: backup before Prisma 7 migration"
```

#### 0-2. 의존성 버전 확인
```bash
# 현재 Prisma 버전 확인
pnpm list prisma @prisma/client

# Node.js 버전 확인 (Prisma 7 요구사항: Node 18+)
node --version
```

#### 0-3. 테스트 실행 (현재 상태 기록)
```bash
# 전체 테스트 실행
pnpm test

# 서버 빌드 테스트
pnpm build:server
```

---

### Phase 1: 패키지 업그레이드

#### 1-1. Prisma 및 Adapter 패키지 설치

**catalog 업데이트**:
```yaml
# pnpm-workspace.yaml
catalog:
  '@prisma/client': ^7.0.0
  prisma: 7.0.0
```

**schema 패키지 의존성 추가**:
```bash
cd packages/schema
pnpm add @prisma/adapter-pg pg
pnpm add -D dotenv
```

**서버 앱 의존성 추가**:
```bash
cd apps/server
pnpm add @prisma/adapter-pg pg
```

#### 1-2. 버전 확인
```bash
pnpm install
pnpm list prisma @prisma/client @prisma/adapter-pg
```

---

### Phase 2: 설정 파일 마이그레이션

#### 2-1. `prisma.config.ts` 생성

**위치**: `packages/schema/prisma.config.ts`

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // 스키마 경로 (monorepo 고려)
  schema: './prisma/schema.prisma',

  // 마이그레이션 설정
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx ./prisma/seed.ts',
  },

  // 데이터소스 설정
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
})
```

#### 2-2. `schema.prisma` 수정

**Before**:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**After**:
```prisma
datasource db {
  provider = "postgresql"
  // url과 directUrl 제거
}
```

#### 2-3. Generator 설정 확인 (선택적)

생성 경로를 명시하려면:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"  // 선택적
}
```

---

### Phase 3: PrismaClient 코드 마이그레이션

#### 3-1. NestJS PrismaService 수정 ⭐ (가장 중요)

**파일**: `apps/server/src/shared/service/utils/prisma.service.ts`

**Before**:
```typescript
import { PrismaClient } from '@cocrepo/schema'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

**After (Option 1 - Composition 패턴, 권장)**:
```typescript
import { PrismaClient } from '@cocrepo/schema'
import { PrismaPg } from '@prisma/adapter-pg'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import pg from 'pg'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public client: PrismaClient

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('DATABASE_URL')

    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    this.client = new PrismaClient({ adapter })
  }

  async onModuleInit() {
    await this.client.$connect()
  }

  async onModuleDestroy() {
    await this.client.$disconnect()
  }

  // Proxy methods for backward compatibility
  get user() { return this.client.user }
  get task() { return this.client.task }
  // ... 모든 모델에 대한 getter 추가
}
```

**After (Option 2 - Factory 패턴)**:
```typescript
import { PrismaClient } from '@cocrepo/schema'
import { PrismaPg } from '@prisma/adapter-pg'
import { ConfigService } from '@nestjs/config'
import pg from 'pg'

export function createPrismaClient(configService: ConfigService): PrismaClient {
  const connectionString = configService.get<string>('DATABASE_URL')

  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

// prisma.module.ts에서 사용
{
  provide: PrismaClient,
  useFactory: createPrismaClient,
  inject: [ConfigService],
}
```

#### 3-2. Seed Script 수정

**파일**: `packages/schema/prisma/seed.ts`

**Before**:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

**After**:
```typescript
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

#### 3-3. 테스트 파일 수정

**파일**: `packages/schema/src/__tests__/prisma.test.ts`

```typescript
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

describe('PrismaClient', () => {
  it('should create PrismaClient instance with adapter', () => {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const client = new PrismaClient({ adapter })

    expect(client).toBeDefined()
  })
})
```

---

### Phase 4: 빌드 및 타입 생성

#### 4-1. Prisma Client 재생성
```bash
cd packages/schema
pnpm prisma generate
```

#### 4-2. 타입 체크
```bash
pnpm type-check
```

#### 4-3. 빌드 테스트
```bash
# schema 패키지 빌드
pnpm build:pkg @cocrepo/schema

# 서버 앱 빌드
pnpm build:server
```

---

### Phase 5: 마이그레이션 및 데이터베이스 테스트

#### 5-1. 마이그레이션 검증
```bash
# 마이그레이션 상태 확인
cd packages/schema
pnpm prisma migrate status

# 필요시 새 마이그레이션 생성 (스키마 변경 없으면 불필요)
pnpm prisma migrate dev --name prisma-7-upgrade
```

#### 5-2. 데이터베이스 연결 테스트
```bash
# Prisma Studio로 연결 테스트
pnpm prisma studio
```

#### 5-3. Seed 테스트
```bash
pnpm prisma db seed
```

---

### Phase 6: 애플리케이션 테스트

#### 6-1. 단위 테스트
```bash
# schema 패키지 테스트
pnpm --filter @cocrepo/schema test

# 서버 테스트
pnpm --filter server test
```

#### 6-2. E2E 테스트
```bash
pnpm --filter server test:e2e
```

#### 6-3. 로컬 서버 실행 테스트
```bash
pnpm start:server
```

**테스트 체크리스트**:
- [ ] 서버 정상 시작
- [ ] 데이터베이스 연결 성공
- [ ] API 엔드포인트 정상 작동
- [ ] CRUD 작업 정상 동작
- [ ] 에러 핸들링 정상

---

### Phase 7: Docker 빌드 테스트

#### 7-1. Docker 이미지 빌드
```bash
docker build -f devops/Dockerfile.server -t server:prisma-7 .
```

#### 7-2. Docker 컨테이너 실행 테스트
```bash
docker run --env-file .env -p 3006:3006 server:prisma-7
```

---

### Phase 8: 문서화 및 배포 준비

#### 8-1. CHANGELOG 작성
```markdown
## [0.4.0] - 2025-12-06

### Changed
- ⬆️ Prisma 6.11.1 → 7.0.0 업그레이드
- 🔧 `prisma.config.ts` 도입으로 설정 분리
- 🔌 PostgreSQL Adapter (@prisma/adapter-pg) 통합
- 🏗️ NestJS PrismaService 리팩토링 (Composition 패턴)

### Migration Guide
- [Prisma 7 마이그레이션 가이드](./docs/PRISMA-7-MIGRATION.md) 참조
```

#### 8-2. README 업데이트
```markdown
## 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- PostgreSQL 14+
- Prisma 7.x
```

#### 8-3. 팀원 가이드 작성
- 로컬 개발 환경 업데이트 절차
- 트러블슈팅 가이드

---

## 🚨 주의사항 및 리스크

### 높은 리스크 항목

1. **NestJS 통합 이슈** 🔴
   - **문제**: extends PrismaClient 패턴 사용 불가
   - **해결**: Composition 패턴으로 전환
   - **테스트**: 모든 Repository와 Service 동작 확인

2. **환경변수 로딩** 🟡
   - **문제**: 자동 로딩 제거됨
   - **해결**: 모든 진입점에 `dotenv/config` 추가
   - **확인**: 배포 환경별 테스트 필수

3. **Turbo 캐싱** 🟡
   - **문제**: 생성 경로 변경 시 캐시 무효화 필요
   - **해결**: `turbo.json`의 inputs/outputs 확인
   - **대응**: 필요시 캐시 초기화

### 롤백 계획

#### 즉시 롤백 조건
- [ ] 데이터베이스 연결 실패
- [ ] 마이그레이션 실패
- [ ] 서버 시작 실패
- [ ] 주요 기능 작동 불가

#### 롤백 절차
```bash
# 1. 브랜치 전환
git checkout main

# 2. 의존성 복원
pnpm install

# 3. Prisma Client 재생성
cd packages/schema && pnpm prisma generate

# 4. 서버 재시작
pnpm start:server
```

---

## 📊 진행 체크리스트

### Phase 0: 준비 (완료 시 ✅)
- [ ] 백업 브랜치 생성
- [ ] 현재 테스트 성공 확인
- [ ] 의존성 버전 문서화

### Phase 1: 패키지 업그레이드
- [ ] catalog 업데이트 (Prisma 7.x)
- [ ] @prisma/adapter-pg 설치
- [ ] pg 설치
- [ ] dotenv 설치

### Phase 2: 설정 파일
- [ ] prisma.config.ts 생성
- [ ] schema.prisma 수정 (url/directUrl 제거)
- [ ] generator 설정 확인

### Phase 3: 코드 마이그레이션
- [ ] PrismaService 리팩토링 (NestJS)
- [ ] seed.ts 수정
- [ ] 테스트 파일 수정
- [ ] 모든 PrismaClient 사용처 확인

### Phase 4: 빌드
- [ ] prisma generate 성공
- [ ] 타입 체크 통과
- [ ] schema 패키지 빌드 성공
- [ ] server 앱 빌드 성공

### Phase 5: 데이터베이스
- [ ] 마이그레이션 상태 확인
- [ ] Prisma Studio 연결 테스트
- [ ] Seed 실행 성공

### Phase 6: 테스트
- [ ] 단위 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 로컬 서버 실행 성공
- [ ] API 동작 확인

### Phase 7: Docker
- [ ] Docker 빌드 성공
- [ ] 컨테이너 실행 성공

### Phase 8: 문서화
- [ ] CHANGELOG 작성
- [ ] README 업데이트
- [ ] 마이그레이션 가이드 완료

---

## 🔗 참고 자료

### 공식 문서
- [Prisma 7 업그레이드 가이드](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma 7 Release Notes](https://www.prisma.io/blog/announcing-prisma-orm-7-0-0)
- [PostgreSQL Adapter 문서](https://www.prisma.io/docs/orm/overview/databases/postgresql)

### 커뮤니티 리소스
- [GitHub Issue #28573 - Prisma 7 Config Changes](https://github.com/prisma/prisma/issues/28573)
- [DEV Community - Prisma v7 Upgrade Guide](https://dev.to/manujdixit/how-to-upgrade-to-prisma-v7-zero-confusion-guide-2ljd)
- [Stack Overflow - Prisma 7 NestJS Integration](https://stackoverflow.com/questions/79827833/stuck-with-prisma-error-after-updating-to-v7)

### 내부 문서
- [packages/schema/README.md](../packages/schema/README.md)
- [scripts/README.md](../scripts/README.md)

---

## 📝 예상 작업 시간

| Phase | 예상 시간 | 복잡도 |
|-------|----------|--------|
| Phase 0: 준비 | 30분 | ⭐ |
| Phase 1: 패키지 업그레이드 | 15분 | ⭐ |
| Phase 2: 설정 파일 | 30분 | ⭐⭐ |
| Phase 3: 코드 마이그레이션 | 2시간 | ⭐⭐⭐⭐ |
| Phase 4: 빌드 | 30분 | ⭐⭐ |
| Phase 5: 데이터베이스 | 30분 | ⭐⭐ |
| Phase 6: 테스트 | 1시간 | ⭐⭐⭐ |
| Phase 7: Docker | 45분 | ⭐⭐⭐ |
| Phase 8: 문서화 | 45분 | ⭐⭐ |
| **총 예상 시간** | **약 6-7시간** | |

**권장 접근법**:
- Day 1: Phase 0-2 (준비 및 설정)
- Day 2: Phase 3-5 (코드 및 DB)
- Day 3: Phase 6-8 (테스트 및 문서화)

---

## 💬 문제 발생 시 대응

### 일반적인 문제

#### 1. "Cannot find module 'prisma/config'"
```bash
# Prisma 7 패키지 제대로 설치되었는지 확인
pnpm list prisma
# 7.x 버전이 아니면 재설치
pnpm add -D prisma@latest
```

#### 2. "Adapter is required"
```typescript
// PrismaClient 생성 시 adapter 누락 확인
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter }) // adapter 필수!
```

#### 3. Environment variables not loaded
```typescript
// 파일 최상단에 추가
import 'dotenv/config'
```

#### 4. NestJS DI 문제
```typescript
// @Injectable() 데코레이터 확인
// ConfigService 주입 확인
// Provider 등록 확인 (app.module.ts)
```

### 긴급 연락처
- **Prisma Discord**: https://pris.ly/discord
- **GitHub Issues**: https://github.com/prisma/prisma/issues
- **팀 Slack**: #dev-backend 채널

---

**마지막 업데이트**: 2025-12-06
**작성자**: Claude Code
**검토자**: (검토 필요)
