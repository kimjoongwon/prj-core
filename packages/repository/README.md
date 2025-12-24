# @cocrepo/repository

Repository 패턴 구현 패키지

## 설치

```bash
pnpm add @cocrepo/repository
```

## 사용법

### Provider 등록

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
import { UsersRepository } from "@cocrepo/repository";

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getUser(id: string) {
    return this.repository.findUnique({ where: { id } });
  }
}
```

## 포함된 Repository

- AssignmentsRepository
- CategoriesRepository
- ExercisesRepository
- FilesRepository
- UsersRepository
- ... 등 25개 Repository

## 의존성

- @cocrepo/prisma
- @cocrepo/entity
- @nestjs/common (peer)
- class-transformer
