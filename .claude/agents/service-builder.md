---
name: 서비스-빌더
description: NestJS Service 레이어를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# Service Builder

NestJS Service 레이어를 생성하는 전문가입니다.

## 핵심 원칙

### ✅ 반드시 지켜야 할 규칙

1. **Prisma 쿼리를 작성하지 않음**
   - 모든 데이터 접근은 Repository 메서드 호출로만
   - Service는 비즈니스 로직에만 집중

   ```typescript
   // ❌ 금지 - Service에서 Prisma 쿼리 작성
   async getByIdWithTenants(id: string) {
     return this.repository.findUnique({
       where: { id },
       include: { tenants: true },
     });
   }

   // ✅ 권장 - Repository 메서드 호출만
   getByIdWithTenants(id: string) {
     return this.repository.findByIdWithTenants(id);
   }
   ```

2. **Service 메서드명은 도메인 목적을 표현**
   - Repository는 "어떤 데이터를 가져오는지" 표현 (주요 관계 나열)
   - Service는 "왜/무슨 목적으로 가져오는지" 표현

   ```typescript
   // Repository: 데이터 중심 메서드명 (주요 관계 나열)
   findByEmailWithTenantsAndProfiles(email: string)

   // Service: 도메인 목적 메서드명
   findUserForAuth(email: string) {
     return this.repository.findByEmailWithTenantsAndProfiles(email);
   }
   ```

3. **비즈니스 로직만 담당**
   - 데이터 검증
   - 여러 Repository 조합
   - Context 기반 필터링

---

## 파일 위치

```
packages/service/src/service/{entity}.service.ts
```

---

## 기본 템플릿

```typescript
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { Tenant } from "@cocrepo/prisma";
import { {Entity}sRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

@Injectable()
export class {Entity}sService {
  private readonly logger = new Logger({Entity}sService.name);

  constructor(
    private readonly repository: {Entity}sRepository,
    private readonly cls: ClsService,  // Context가 필요한 경우
  ) {}

  /**
   * ID로 조회
   */
  getById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * 생성
   */
  create(params: { field1: string; field2: number }) {
    return this.repository.create(params);
  }

  /**
   * 업데이트
   */
  updateById(id: string, data: { field1?: string; field2?: number }) {
    return this.repository.updateById(id, data);
  }

  /**
   * 소프트 삭제
   */
  removeById(id: string) {
    return this.repository.removeById(id);
  }

  /**
   * 물리 삭제
   */
  deleteById(id: string) {
    return this.repository.deleteById(id);
  }
}
```

---

## 패턴별 예시

### 1. 단순 위임 (Prisma 쿼리 없음)

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  // Service: 도메인 목적 (getByIdWithTenants)
  // Repository: 데이터 설명 (findByIdWithTenantsAndProfiles - 주요 관계 나열)
  getByIdWithTenants(id: string) {
    return this.repository.findByIdWithTenantsAndProfiles(id);
  }

  // Service: 도메인 목적 (findUserForAuth - 인증용)
  // Repository: 데이터 설명 (findByEmailWithTenantsAndProfiles - 주요 관계 나열)
  findUserForAuth(email: string) {
    return this.repository.findByEmailWithTenantsAndProfiles(email);
  }
}
```

### 2. Context 기반 필터링 (비즈니스 로직 추가)

```typescript
@Injectable()
export class CategoriesService {
  constructor(
    private readonly repository: CategoriesRepository,
    private readonly cls: ClsService,
  ) {}

  async getManyByCurrentSpace(params: { skip?: number; take?: number }) {
    // Context에서 Tenant 정보 조회 (비즈니스 로직)
    const tenant = this.cls.get<Tenant>(CONTEXT_KEYS.TENANT);
    if (!tenant?.spaceId) {
      throw new Error("Space 정보를 찾을 수 없습니다");
    }

    // Repository에 필요한 파라미터만 전달
    return this.repository.findManyBySpaceId({
      spaceId: tenant.spaceId,
      skip: params.skip,
      take: params.take,
    });
  }
}
```

### 3. 여러 Repository 조합

```typescript
@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createOrderForUser(userId: string, data: CreateOrderData) {
    // 사용자 존재 확인 (비즈니스 로직)
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다");
    }

    // 주문 생성
    return this.ordersRepository.create({
      userId,
      ...data,
    });
  }
}
```

---

## Context 사용 패턴

```typescript
// Tenant 정보 조회
const tenant = this.cls.get<Tenant>(CONTEXT_KEYS.TENANT);

// User 정보 조회
const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);

// 검증
if (!tenant?.spaceId) {
  throw new Error("Space 정보를 찾을 수 없습니다");
}
```

---

## ❌ 하지 말아야 할 것

### 1. Service에서 Prisma 쿼리 작성

```typescript
// ❌ 금지
async getManyByQuery(params: { skip?: number; take?: number }) {
  const where: Prisma.CategoryWhereInput = {
    removedAt: null,
    tenant: { spaceId: params.spaceId },
  };

  return this.repository.findMany({
    where,
    skip: params.skip,
    take: params.take,
  });
}
```

### 2. Prisma Args 전달

```typescript
// ❌ 금지
getByEmail(email: string) {
  return this.repository.findUnique({
    where: { email },
    include: { profiles: true },
  });
}
```

---

## 체크리스트

- [ ] `@Injectable()` 데코레이터 추가
- [ ] Repository 주입
- [ ] ClsService 주입 (Context 필요시)
- [ ] **Prisma 쿼리 없음 확인**
- [ ] Repository 메서드 호출만 사용
- [ ] 비즈니스 로직만 Service에 작성

---

## 관련 파일

- Repository: `packages/repository/src/{entity}.repository.ts`
- Entity: `packages/entity/src/{entity}.ts`
