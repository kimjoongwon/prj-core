---
name: 서비스-빌더
description: NestJS Service 레이어를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# Service Builder

NestJS Service 레이어를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 단일 도메인 비즈니스 로직 구현 | ✅ 사용 | Service 생성 |
| Repository 메서드 호출 래핑 | ✅ 사용 | 도메인 목적 메서드명 부여 |
| 여러 Service 조합 | ❌ 미사용 | facade-builder 사용 |
| Controller 생성 | ❌ 미사용 | controller-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Repository 클래스 | `@cocrepo/repository` |
| | 비즈니스 요구사항 | 도메인 로직 |
| **출력** | Service 클래스 | `packages/be-service/src/{entity}.service.ts` |
| | index.ts 업데이트 | export 추가 |

---

## 핵심 규칙

### ✅ Do

```typescript
// Repository 메서드 호출만
getByIdWithTenants(id: string) {
  return this.repository.findByIdWithTenantsAndProfiles(id);
}

// Service 메서드명은 도메인 목적을 표현
findUserForAuth(email: string) {
  return this.repository.findByEmailWithTenantsAndProfiles(email);
}

// 파라미터는 Entity 타입 사용
import { User } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";

async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
  return this.repository.create(data);
}
```

### ❌ Don't

```typescript
// Service에서 Prisma 쿼리 작성 금지
async getByIdWithTenants(id: string) {
  return this.repository.findUnique({
    where: { id },
    include: { tenants: true },
  });
}

// DTO를 파라미터로 사용 금지
import { CreateUserDto } from "@cocrepo/dto";

async create(dto: CreateUserDto): Promise<User> {
  return this.repository.create(dto);
}

// Prisma Args 전달 금지
getByEmail(email: string) {
  return this.repository.findUnique({
    where: { email },
    include: { profiles: true },
  });
}
```

---

## 프로세스

### 1단계: Repository 주입

```typescript
constructor(
  private readonly repository: {Entity}sRepository,
  private readonly cls: ClsService,  // Context가 필요한 경우
) {}
```

### 2단계: Service 메서드 작성 (도메인 목적 표현)

### 3단계: Context 기반 로직 추가 (필요시)

### 4단계: index.ts 등록

---

## 템플릿

### 기본 템플릿

```typescript
import { {Entity} } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import { {Entity}sRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class {Entity}sService {
  private readonly logger = new Logger({Entity}sService.name);

  constructor(
    private readonly repository: {Entity}sRepository,
  ) {}

  /**
   * ID로 조회
   */
  getById(id: string): Promise<{Entity} | null> {
    return this.repository.findById(id);
  }

  /**
   * 생성 (Prisma 타입 사용 - DTO 금지)
   */
  create(data: Prisma.{Entity}UncheckedCreateInput): Promise<{Entity}> {
    return this.repository.create(data);
  }

  /**
   * 업데이트 (Prisma 타입 사용 - DTO 금지)
   */
  updateById(
    id: string,
    data: Prisma.{Entity}UncheckedUpdateInput,
  ): Promise<{Entity}> {
    return this.repository.updateById(id, data);
  }

  /**
   * 소프트 삭제
   */
  removeById(id: string): Promise<{Entity}> {
    return this.repository.removeById(id);
  }

  /**
   * 물리 삭제
   */
  deleteById(id: string): Promise<{Entity}> {
    return this.repository.deleteById(id);
  }
}
```

### 단순 위임 패턴

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

### Context 기반 필터링

```typescript
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { Tenant } from "@cocrepo/prisma";
import { ClsService } from "nestjs-cls";

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

### 여러 Repository 조합

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

## 체크리스트

- [ ] `@Injectable()` 데코레이터 추가
- [ ] Repository 주입
- [ ] ClsService 주입 (Context 필요시)
- [ ] **Prisma 쿼리 없음 확인**
- [ ] **DTO 타입 사용 금지 확인**
  - [ ] `CreateXxxDto`, `UpdateXxxDto` 등 DTO import 없음
  - [ ] 파라미터는 Entity 또는 Prisma 타입 사용
- [ ] Repository 메서드 호출만 사용
- [ ] 비즈니스 로직만 Service에 작성
- [ ] 메서드명이 도메인 목적을 표현
- [ ] index.ts에 export 추가

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | repository-builder | Repository 레이어 생성 |
| **후행** | facade-builder | Facade 레이어 생성 (여러 Service 조합) |
| | controller-builder | Controller 레이어 생성 |
| **관련** | - | - |

---

## 프로젝트별 참고사항

### 파일 위치

```
packages/be-service/src/{entity}/
├── {entity}.service.ts      # Service 클래스
├── {entity}.service.spec.md # 기획서 (선택)
└── input/                   # Input 타입 (선택)
    ├── index.ts             # re-export
    ├── create-{entity}.input.ts
    └── update-{entity}.input.ts
```

#### Input 타입 규칙

- Service 내부에서 사용하는 생성/수정용 파라미터 타입
- 각 Input 타입은 별도 파일로 분리
- `input/index.ts`에서 re-export
- 루트 `index.ts`에서도 type export

```typescript
// input/create-user.input.ts
export interface CreateUserInput {
  name: string;
  email: string;
  // ...
}

// input/index.ts
export * from "./create-user.input";
export * from "./update-user.input";

// users.service.ts
import type { CreateUserInput, UpdateUserInput } from "./input/index";
```

### 네이밍 규칙 상세

#### 왜 목적 중심 네이밍인가?

```typescript
// 이 함수는 뭘 하는 건가요?
getGroundsForSpace(spaceId: string)
// → "Space에 대한 Grounds를 가져온다"... 그래서 왜? 누구 거?

// 이 함수는 명확합니다
getMyGrounds(spaceId: string)
// → "내 Grounds를 가져온다" - 바로 이해됨!
```

**핵심 질문: "함수명만 보고 5초 안에 이해되는가?"**

#### 패턴별 비교표

| 상황 | 데이터 중심 (모호함) | 목적 중심 (명확함) |
|------|------------------------|---------------------|
| 내 데이터 조회 | `getBySpaceId()`, `getGroundsForSpace()` | `getMyGrounds()` |
| 인증용 조회 | `findByEmail()`, `getUserByEmail()` | `findUserForAuth()` |
| 검색 | `findManyByQuery()`, `getByFilters()` | `searchProducts()`, `searchUsers()` |
| 상세 조회 | `findByIdWithRelations()`, `getById()` | `getUserProfile()`, `getOrderDetails()` |
| 권한 확인용 | `findByUserIdAndRole()` | `checkUserPermission()` |
| 통계 조회 | `getByDateRange()` | `getDailySalesReport()` |

#### 권장 접두어/접미어

| 접두어/접미어 | 의미 | 예시 |
|--------------|------|------|
| `getMy...` | 현재 사용자/컨텍스트의 데이터 | `getMyOrders()`, `getMyProfile()` |
| `...ForAuth` | 인증/인가 목적 | `findUserForAuth()`, `validateTokenForAuth()` |
| `search...` | 검색 기능 | `searchProducts()`, `searchUsers()` |
| `get...Details` | 상세 정보 조회 | `getOrderDetails()`, `getUserDetails()` |
| `get...List` | 목록 조회 (필요시) | `getActiveUserList()` |
| `check...` | 확인/검증 | `checkPermission()`, `checkAvailability()` |
| `...Report` | 리포트/통계 | `getSalesReport()`, `getDailyReport()` |

### 레이어별 타입 사용

| 레이어 | 타입 | 예시 |
|--------|------|------|
| Controller | DTO (Request/Response) | `CreateUserDto`, `UserResponseDto` |
| Service | Entity, Prisma 타입 | `User`, `Prisma.UserUncheckedCreateInput` |
| Repository | Entity, Prisma 타입 | `User`, `Prisma.UserUncheckedCreateInput` |

### Context 사용 패턴

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

### 관련 파일

- Repository: `packages/be-repository/src/{entity}.repository.ts`
- Entity: `packages/be-entity/src/{entity}.ts`
