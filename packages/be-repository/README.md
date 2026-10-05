# @cocrepo/repository

Prisma 조회·저장과 도메인 객체 복원을 담당하는 Repository 패키지입니다.

## 설치

```bash
pnpm add @cocrepo/repository
```

## 사용법

### Provider 등록

Prisma token 등록 예시입니다. 애플리케이션의 기존 CLS/TransactionHost 구성을 함께 사용합니다.

```typescript
import { Module } from "@nestjs/common";
import { PRISMA_SERVICE_TOKEN } from "@cocrepo/repository";
import { PrismaService } from "./prisma.service";

@Module({
  providers: [
    PrismaService,
    {
      provide: PRISMA_SERVICE_TOKEN,
      useExisting: PrismaService,
    },
  ],
  exports: [PRISMA_SERVICE_TOKEN],
})
export class DatabaseModule {}
```

### Repository 사용

```typescript
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "@cocrepo/repository";

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findUserById(id: bigint) {
    return this.repository.findById(id);
  }
}
```

## 포함된 Repository

- `UsersRepository`, `SpacesRepository`, `RolesRepository`
- `TasksRepository`, `RoutinesRepository`, `TimelinesRepository`
- `AssetsRepository`, `FoldersRepository`, `AlbumsRepository`
- `PoliciesRepository`, `RoleAssignmentsRepository`, `TemplatesRepository`

실제 공개 목록은 [src/index.ts](src/index.ts)를 기준으로 확인합니다. 종속 모델을
조회하려고 새 Repository를 일괄 생성하지 않습니다.

## Entity 복원

Repository 내부에서는 [to-domain-entity.ts](src/to-domain-entity.ts)를 사용합니다.
이 함수는 패키지 루트의 공개 export가 아니며 각 Repository에서 상대 경로로 가져옵니다.

```typescript
import { User } from "@cocrepo/entity";
import { toDomainEntity } from "./to-domain-entity";

// DB 조회 결과가 존재하는 경로에서 단일 객체 또는 배열을 복원합니다.
const user = toDomainEntity(User, persistedUser);
```

`toDomainEntity`는 `toDomainData`를 거쳐 `@cocrepo/entity`에서 공개하는 `hydrateEntity`를
호출합니다. `toDomainData`는 별도 클래스가 필요 없는 projection의 타입 경계이며
값을 변환하지 않습니다. 복원 중 API의 이메일 정규화·secret 제외·중첩 `Type`
데코레이터를 실행하지 않아 bigint·Date·저장 비밀번호·ULID를 보존합니다.

네 권한 관계와 공유·순환 객체의 복원 정책은 [Entity README](../be-entity/README.md#내부-객체-복원)를
따릅니다. DTO의 검증이나 응답 직렬화는 이 경계에서 수행하지 않습니다.

## 검증

```bash
pnpm --filter @cocrepo/repository type-check
pnpm --filter @cocrepo/repository exec jest --runInBand to-domain-entity
pnpm --filter @cocrepo/repository lint
```

## 의존성

- @cocrepo/prisma
- @cocrepo/entity
- @nestjs/common (peer)
- class-transformer - 기존 타입·변환 소비 의존성; 내부 Entity 복원에는 사용하지 않음
