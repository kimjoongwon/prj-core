# @cocrepo/service

Cocrepo 프로젝트의 비즈니스 로직 및 서비스 레이어 패키지입니다.

## 설치

이 패키지는 모노레포 내부 패키지이므로 별도 설치가 필요 없습니다.

```bash
pnpm install
```

## 사용법

### Service Import
```typescript
import { UsersService, AuthFacade } from '@cocrepo/service';
```

### NestJS 모듈에서 사용
```typescript
import { Module } from '@nestjs/common';
import { UsersService } from '@cocrepo/service';
import { UsersRepository } from '@cocrepo/repository';

@Module({
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
```

## 구조

- **facade/**: Facade 패턴으로 구현된 서비스
  - AuthFacade: 인증 관련 비즈니스 로직 통합
- **service/**: 리소스별 CRUD 서비스
  - UsersService: 사용자 관리
- **utils/**: 기반 시설 서비스
  - PrismaService: Prisma 클라이언트 래퍼
  - TokenService: JWT 토큰 생성/검증
  - TokenStorageService: Redis 기반 토큰 저장소
  - RedisService: Redis 연결 관리
  - AwsService: AWS S3 연동

## 의존성

### Dependencies
- @cocrepo/dto - DTO 클래스
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

# 포맷팅
pnpm format
```

## 주의사항

- Repository는 `@cocrepo/repository` 패키지에서 import해야 합니다
- Config 타입은 `@cocrepo/type` 패키지에서 import됩니다
- NestJS의 Dependency Injection을 사용하여 서비스를 주입받습니다
