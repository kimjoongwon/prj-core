# @cocrepo/service

Cocrepo backend support service package.

Aggregate service providers are promoted to `@cocrepo/aggregate` and named
`{Domain}Aggregate`. This package keeps infrastructure/support providers such
as token, Redis, Prisma, email, object storage, masking, template, i18n, and user
lookup services.

## 설치

이 패키지는 모노레포 내부 패키지이므로 별도 설치가 필요 없습니다.

```bash
pnpm install
```

## 사용법

### Service Import

```typescript
import { PrismaService, TokenService, UserService } from "@cocrepo/service";
```

### NestJS 모듈에서 사용

```typescript
import { UsersRepository } from "@cocrepo/repository";
import { UserService } from "@cocrepo/service";
import { Module } from "@nestjs/common";

@Module({
	providers: [UserService, UsersRepository],
})
export class UsersModule {}
```

## 구조

- **src/auth/**: auth cache, token, token storage
- **src/email/**: email sender and template rendering integration
- **src/i18n/**: i18n module and translation support
- **src/object-storage/**: object storage integration
- **src/prisma/**: Prisma client wrapper and factory
- **src/redis/**: Redis connection management
- **src/template/**: template rendering support
- **src/user/**: user lookup support used by auth strategy

> **참고**: 도메인 aggregate service는 `@cocrepo/aggregate`, 사용자 과업 중심 workflow 조합은 `@cocrepo/usecase`가 담당합니다.

## 의존성

### Dependencies
- @cocrepo/context - 요청/공간 context
- @cocrepo/entity - Entity 클래스
- @cocrepo/prisma - Prisma 클라이언트
- @cocrepo/repository - Repository 레이어
- @cocrepo/type - 공통 타입 정의

### Peer Dependencies
- @nestjs/common
- @nestjs/config
- @nestjs/jwt
- bcrypt
- ioredis

## 개발

```bash
# 타입 체크
pnpm type-check

# 빌드
pnpm build

# Watch 모드
pnpm start:dev

# 테스트
pnpm test

# 포맷팅
pnpm format
```

## 주의사항

- Aggregate service를 새로 만들 때는 이 패키지가 아니라 `@cocrepo/aggregate`에 `{Domain}Aggregate`로 추가합니다
- Repository는 `@cocrepo/repository` 패키지에서 import해야 합니다
- Config 타입은 `@cocrepo/type` 패키지에서 import됩니다
- NestJS의 Dependency Injection을 사용하여 서비스를 주입받습니다
