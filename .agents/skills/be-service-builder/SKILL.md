---
name: "be-service-builder"
description: "이 skill은 `be-service-builder` 역할로 일할 때 사용합니다. NestJS Service 로직을 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-service-builder

# Service 빌더

NestJS Service 레이어를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| Aggregate root service 구현 | ❌ 미사용 | `be-aggregate-builder` 사용 |
| 단일 도메인 support/helper service 구현 | ✅ 사용 | Service 생성 |
| 외부 연동 조합 support service 구현 | ✅ 사용 | Client 조합이나 helper service |
| 여러 Service 조합 | ❌ 미사용 | 작업 흐름면 `be-usecase-builder` 사용 |
| Controller 생성 | ❌ 미사용 | controller-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Repository 클래스 | `@cocrepo/repository` |
| | 비즈니스 요구사항 | 도메인 로직 |
| **출력** | Service 클래스 | `packages/be-service/src/{domain}/{domain}.service.ts` |
| | index.ts 업데이트 | export 추가 |

---

## 핵심 규칙

- 서비스는 aggregate root service가 아닌 support/domain helper 단위로 구성한다.
- aggregate root service provider는 `be-aggregate-builder`가 `@cocrepo/aggregate`에 `{Domain}AggregateRoot`로 생성한다.
- 호출할 Repository/Integration이 `Repository 인벤토리` 또는 관련 백엔드 인벤토리에 없으면 구현하지 말고 `계약-gap`으로 보고한다.
- 동일 Aggregate Root 내부의 종속 모델이나 명시적 관계 모델 변경은 `@cocrepo/aggregate`의 root aggregate service를 통해서만 수행한다.
- Controller가 하나의 aggregate root에 대해 pass-through할 때도 service 책임 범위를 벗어나지 않는다.
- 여러 출처의 값을 repository input이나 aggregate method input으로 매핑하는 코드가 반복되면 `const input = commandInput`처럼 출처명 alias까지만 사용한다.
- Service support input은 `SendEmailInput`, `PutObjectInput`처럼 capability 중심 이름을 사용하고, 메서드 인자명은 기본적으로 `input`을 사용한다.
- Service는 DTO, Command/Query class를 public method 입력 타입으로 받지 않는다.
- Service class는 class당 하나의 파일을 가진다.
- Service class 파일에는 top-level type/helper/mapper/constant를 함께 두지 않는다. 입력/Result/Options/Provider interface/helper는 같은 domain 폴더의 별도 파일로 분리한다.
- Service class가 이미 public method 타입을 제공하면 그 메서드 목록을 복제한 `*Port` interface/type/file을 만들지 않는다. DI token은 런타임 provider 선택만 담당하고, TypeScript 계약은 owner package가 export하는 실제 Service/Client/Aggregate class 타입을 직접 사용한다.
- Service DI 계약 이름에 `Port` 접미사를 새로 붙이지 않는다. 정말 별도 추상 계약이 필요하면 승인된 spec에 이유, owner, 소비 범위가 명시되어야 하며 기존 class 타입을 재사용할 수 없는지 먼저 증명한다.
- `packages/be-service/src`에는 service behavior를 담은 `export function` 또는 exported arrow helper를 새로 만들지 않는다. DI provider, `ConfigService`/env, Repository/Client, time/random, 외부 protocol에 닿는 로직은 반드시 `@Injectable()` service class로 만든다.
- 순수 runtime helper가 필요하면 먼저 `@cocrepo/toolkit` 재사용/이동을 검토한다. service-local mapper/normalizer/parser 예외는 필수 skill이 허용한 별도 파일에서만 두고, provider 의존성이나 환경 의존성이 생기면 즉시 service class로 승격한다.

### ✅ 권장

```typescript
// Query는 Repository 위임
getByIdWithTenants(id: string) {
  return this.repository.findByIdWithTenantsAndProfiles(id);
}

// Aggregate Root 기준 command 수행
async submitOrder(orderId: string) {
  const order = await this.repository.findById(orderId);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  order.submit();
  return this.repository.save(order);
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

### ❌ 금지

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

// Aggregate Root 내부 종속 모델을 독립 command 진입점으로 직접 수정 금지
async updateOrderItem(itemId: string, quantity: number) {
  return this.repository.updateItemById(itemId, { quantity });
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

### 2단계: Service 메서드 작성 (Aggregate Root/도메인 목적 표현)

### 3단계: Context 기반 로직 추가 (필요시)

### 4단계: index.ts 등록

### 파일 배치 규칙

- Service 구현 파일은 `packages/be-service/src/{domain}/{domain}.service.ts` 파일로 생성합니다.
- `packages/be-service/src/*.service.ts`처럼 루트에 flat Service 파일을 생성하지 않습니다.
- 폴더형 Service(예: `xxx.service` 디렉터리 안의 `index.ts`) 생성은 금지합니다.
- 같은 도메인 안의 보조 provider/module은 해당 domain 폴더에 함께 두되 파일별 단일 책임을 유지합니다. 예: `email/email.service.ts`, `email/email.module.ts`, `email/email-provider.ts`, `email/send-email.input.ts`.
- 배럴 export는 `packages/be-service/src/index.ts`에서 유지

---

## 템플릿

### 기본 템플릿

```typescript
import { {Entity} } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import { {Entity}sRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class {Entity}Service {
  private readonly logger = new Logger({Entity}Service.name);

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
   * 생성 (DTO 금지)
   */
  create(data: Prisma.{Entity}UncheckedCreateInput): Promise<{Entity}> {
    return this.repository.create(data);
  }

  /**
   * 업데이트 (DTO 금지)
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
export class UserService {
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
export class CategoryService {
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

### Aggregate Root 내부 종속 모델 변경

```typescript
@Injectable()
export class OrderService {
  constructor(private readonly repository: OrdersRepository) {}

  async changeItemQuantity(orderId: string, itemId: string, quantity: number) {
    const order = await this.repository.findById(orderId);
    if (!order) {
      throw new Error("주문을 찾을 수 없습니다");
    }

    order.changeItemQuantity(itemId, quantity);
    return this.repository.save(order);
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
- [ ] Aggregate Root 메서드와 Repository만 사용
- [ ] Aggregate Root 내부 종속 모델의 쓰기 로직이 Aggregate Root를 통해 수행되는지 확인
- [ ] 비즈니스 로직만 Service에 작성
- [ ] 메서드명이 도메인 목적을 표현
- [ ] Service class와 같은 메서드 목록을 복제한 `*Port` interface/type/file/export가 없음
- [ ] 변경 범위에 DI/config/repository/client/external protocol에 닿는 exported free function/helper가 남아 있지 않음
- [ ] index.ts에 export 추가

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | repository-builder | Repository 레이어 생성 |
| **후행** | be-usecase-builder | Controller 경계용 UseCase handler 레이어 생성 |
| | controller-builder | Controller 레이어 생성 |
| **관련** | - | - |

---

## 프로젝트별 참고사항

### 파일 위치

```
packages/be-service/src/{domain}/{domain}.service.ts
```

### 네이밍 규칙 상세

#### 왜 목적 중심 네이밍인가?

```typescript
// 이 함수는 뭘 하는 건가요?
getFitnessCenterBySpaceId(spaceId: string)
// → "Space의 fitness center를 가져온다"... 목적이 빠져 있습니다.

// 이 함수는 명확합니다
getMySpaceFitnessCenter(spaceId: string)
// → "내가 접근 가능한 Space의 fitness center" - 목적이 드러납니다.
```

**핵심 질문: "함수명만 보고 5초 안에 이해되는가?"**

#### 패턴별 비교표

| 상황 | 데이터 중심 (모호함) | 목적 중심 (명확함) |
|------|------------------------|---------------------|
| 내 데이터 조회 | `getBySpaceId()`, `getFitnessCenterBySpaceId()` | `getMySpaceFitnessCenter()` |
| Aggregate Root와 종속 모델 조회 | `getExercisesByTaskId()` | `getTaskExercisePlan()` |
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

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
