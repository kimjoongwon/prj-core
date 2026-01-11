---
name: 리포지토리-빌더
description: Prisma 기반 Repository 레이어를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# Repository Builder

Prisma 기반 Repository 레이어를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 새로운 모델의 데이터 접근 레이어 필요 | ✅ 사용 | Repository 생성 |
| 복잡한 Prisma 쿼리 추가 | ✅ 사용 | 쿼리 메서드 추가 |
| 비즈니스 로직 추가 | ❌ 미사용 | service-builder 사용 |
| Controller 생성 | ❌ 미사용 | controller-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Entity 클래스 | `@cocrepo/entity` |
| | 필요한 쿼리 패턴 | CRUD, 관계 포함 조회 등 |
| **출력** | Repository 클래스 | `packages/repository/src/{entity}.repository.ts` |
| | index.ts 업데이트 | export 추가 |

---

## 핵심 규칙

### ✅ Do

```typescript
// 모든 Prisma 쿼리는 Repository에서만 작성
await this.txHost.tx.user.findUnique(...)

// txHost.tx 직접 사용
await this.txHost.tx.user.findUnique(...)

// 메서드명은 어떤 데이터를 가져오는지 표현
findByIdWithTenantsAndProfiles(id: string)
findByEmailWithTenantsAndProfiles(email: string)

// Prisma 타입 활용
async create(data: Prisma.UserUncheckedCreateInput): Promise<User>
async update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>

// plainToInstance로 Entity 변환
return result ? plainToInstance(User, result) : null;
```

### ❌ Don't

```typescript
// 범용 메서드에 Prisma Args 전달 금지
findUnique(args: Prisma.UserFindUniqueArgs)

// 도메인 목적을 표현하면 안 됨 (Service 역할)
findByEmailForAuth(email: string)

// private getter 금지
private get prisma() { return this.txHost.tx; }

// 커스텀 타입 선언 금지
export interface CreateUserParams {
  name: string;
  email: string;
}
```

---

## 프로세스

### 1단계: Entity 및 Prisma 타입 import

```typescript
import { {Entity} } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
```

### 2단계: Repository 클래스 작성

### 3단계: 기본 CRUD 메서드 구현

### 4단계: 관계 포함 조회 메서드 구현

### 5단계: index.ts 등록

---

## 템플릿

### 기본 템플릿

```typescript
import { {Entity} } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class {Entity}sRepository {
  private readonly logger: Logger;

  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {
    this.logger = new Logger("{Entity}sRepository");
  }

  /**
   * ID로 조회
   */
  async findById(id: string): Promise<{Entity} | null> {
    this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

    const result = await this.txHost.tx.{entity}.findUnique({
      where: { id },
    });

    return result ? plainToInstance({Entity}, result) : null;
  }

  /**
   * 생성 (Prisma 타입 사용)
   */
  async create(
    data: Prisma.{Entity}UncheckedCreateInput,
  ): Promise<{Entity}> {
    this.logger.debug(`생성 중...`);

    const result = await this.txHost.tx.{entity}.create({
      data,
    });

    return plainToInstance({Entity}, result);
  }

  /**
   * 업데이트 (Prisma 타입 사용)
   */
  async updateById(
    id: string,
    data: Prisma.{Entity}UncheckedUpdateInput,
  ): Promise<{Entity}> {
    this.logger.debug(`업데이트 중: ${id.slice(-8)}`);

    const result = await this.txHost.tx.{entity}.update({
      where: { id },
      data,
    });

    return plainToInstance({Entity}, result);
  }

  /**
   * 소프트 삭제
   */
  async removeById(id: string): Promise<{Entity}> {
    this.logger.debug(`소프트 삭제 중: ${id.slice(-8)}`);

    const result = await this.txHost.tx.{entity}.update({
      where: { id },
      data: { removedAt: new Date() },
    });

    return plainToInstance({Entity}, result);
  }

  /**
   * 물리 삭제
   */
  async deleteById(id: string): Promise<{Entity}> {
    this.logger.debug(`삭제 중: ${id.slice(-8)}`);

    const result = await this.txHost.tx.{entity}.delete({
      where: { id },
    });

    return plainToInstance({Entity}, result);
  }

  /**
   * 다중 생성 (Prisma 타입 사용)
   */
  async createMany(
    data: Prisma.{Entity}CreateManyInput[],
  ): Promise<number> {
    this.logger.debug(`다중 생성: count=${data.length}`);

    const result = await this.txHost.tx.{entity}.createMany({
      data,
      skipDuplicates: true,
    });

    return result.count;
  }
}
```

### 관계 포함 조회

```typescript
/**
 * ID로 사용자 조회 (Tenant, Profile 정보 포함)
 * - 메서드명에 주요 관계를 나열
 */
async findByIdWithTenantsAndProfiles(id: string): Promise<User | null> {
  this.logger.debug(`ID로 사용자 조회: ${id.slice(-8)}`);

  const result = await this.txHost.tx.user.findUnique({
    where: { id },
    include: {
      tenants: {
        include: {
          role: true,
          space: true,
        },
      },
      profiles: true,
    },
  });

  return result ? plainToInstance(User, result) : null;
}
```

### 페이지네이션 목록 조회

```typescript
/**
 * Space별 카테고리 목록 조회
 */
async findManyBySpaceId(params: {
  spaceId: string;
  skip?: number;
  take?: number;
}): Promise<{ items: Category[]; count: number }> {
  const { spaceId, skip, take } = params;

  const where = {
    removedAt: null,
    tenant: { spaceId },
  };

  const [items, count] = await Promise.all([
    this.txHost.tx.category.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    this.txHost.tx.category.count({ where }),
  ]);

  return {
    items: items.map((item) => plainToInstance(Category, item)),
    count,
  };
}
```

---

## 체크리스트

- [ ] `@Injectable()` 데코레이터 추가
- [ ] `TransactionHost` 주입
- [ ] `txHost.tx` 직접 사용 (getter 금지)
- [ ] 메서드명이 어떤 데이터를 가져오는지 표현
- [ ] **Prisma 타입 사용** (커스텀 타입 선언 금지)
  - [ ] `Prisma.{Model}UncheckedCreateInput` (생성)
  - [ ] `Prisma.{Model}UncheckedUpdateInput` (수정)
  - [ ] `Prisma.{Model}CreateManyInput` (다중 생성)
- [ ] 조회 메서드는 필요한 원시 타입만 받음
- [ ] `plainToInstance()` 로 Entity 변환
- [ ] Logger 초기화
- [ ] index.ts에 export 추가

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | entity-builder | Entity 클래스 생성 |
| | schema-builder | Prisma 스키마 생성 |
| **후행** | service-builder | Service 레이어 생성 |
| **관련** | facade-builder | Facade 레이어 (Repository 직접 호출 금지) |

---

## 프로젝트별 참고사항

### 파일 위치

```
packages/repository/src/{entity}.repository.ts
```

### 메서드 명명 규칙

> **핵심**: Repository 메서드명은 "어떤 데이터를 가져오는지" 표현
> - 도메인 목적(ForAuth, ForLogin 등)은 Service에서 표현
> - **최상위 관계만 나열** (중첩 관계는 생략)

| 패턴 | 설명 | 예시 |
|------|------|------|
| `findById` | ID로 단일 조회 | `findById(id)` |
| `findBy{Condition}` | 조건으로 단일 조회 | `findByEmail(email)` |
| `findBy{Key}With{Relations}` | 관계 포함 조회 (주요 관계 나열) | `findByIdWithTenantsAndProfiles(id)` |
| `findManyBy{Condition}` | 조건으로 목록 조회 | `findManyBySpaceId(spaceId)` |
| `create` | 생성 | `create(data)` |
| `updateById` | ID로 수정 | `updateById(id, data)` |
| `removeById` | 소프트 삭제 | `removeById(id)` |
| `deleteById` | 물리 삭제 | `deleteById(id)` |

### Prisma 타입 종류

| 타입 | 용도 | 특징 |
|------|------|------|
| `{Model}UncheckedCreateInput` | 생성 | FK ID를 직접 전달 |
| `{Model}UncheckedUpdateInput` | 수정 | FK ID를 직접 전달 |
| `{Model}CreateManyInput` | 다중 생성 | Bulk insert용 |
| `{Model}CreateInput` | 생성 | 관계를 통한 연결 (connect 등) |
| `{Model}UpdateInput` | 수정 | 관계를 통한 연결 (connect 등) |

> **Unchecked vs Checked**: Repository에서는 FK ID를 직접 다루므로 `Unchecked*` 타입 권장

### Export 등록

```typescript
// packages/repository/src/index.ts
export { {Entity}sRepository } from "./{entity}.repository";
```

### 관련 파일

- Service: `packages/service/src/{entity}.service.ts`
- Entity: `packages/entity/src/{entity}.ts`
- Prisma Schema: `packages/prisma/prisma/schema.prisma`
