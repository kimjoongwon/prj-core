---
name: "be-service-builder-creator"
description: "이 skill은 `be-service-builder` 역할로 일할 때 사용합니다. NestJS Service 로직을 만드는 방법을 쉽게 안내합니다."
---

# be-service-builder-creator

`be-service-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/17-be-service-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


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
| | Service 인벤토리 | 담당 스펙의 `백엔드 / API 계약` 아래 service 행 |
| | 비즈니스 요구사항 | 도메인 로직 |
| **출력** | Service 클래스 | `packages/be-service/src/{domain}/{domain}.service.ts` |
| | Service 계약 | 담당 스펙의 `Service 인벤토리` 행 |
| | index.ts 업데이트 | export 추가 |

---

## 핵심 규칙

- 서비스는 aggregate root service가 아닌 support/domain helper 단위로 구성한다.
- aggregate root service provider는 `be-aggregate-builder`가 `@cocrepo/aggregate`에 `{Domain}AggregateRoot`로 생성한다.
- 담당 스펙의 `Service 인벤토리`에 명시된 domain capability/method만 생성/수정하고, 행의 `재사용/신규`, `소스/대상`, `의존 요소`, 소스 담당 `agent_type`, 소비 `agent_type` 계약을 벗어나지 않는다.
- 호출할 Repository/Integration이 `Repository 인벤토리` 또는 관련 백엔드 인벤토리에 없으면 구현하지 말고 `계약-gap`으로 보고한다.
- 동일 Aggregate Root 내부의 종속 모델이나 명시적 관계 모델 변경은 `@cocrepo/aggregate`의 root aggregate service를 통해서만 수행한다.
- Controller가 하나의 aggregate root에 대해 pass-through할 때도 service 책임 범위를 벗어나지 않는다.
- 여러 출처의 값을 repository input이나 aggregate method input으로 매핑할 때는 `input.xxx`, `context.userId`, `aggregate.id`처럼 원천을 보존한다. 반복이 길면 `const input = commandInput`처럼 출처명 alias까지만 사용한다.
- Service support input은 `SendEmailInput`, `PutObjectInput`처럼 capability 중심 이름을 사용하고, 메서드 인자명은 기본적으로 `input`을 사용한다.
- Service는 DTO, Command/Query class를 public method 입력 타입으로 받지 않는다.
- Service class는 class당 하나의 파일을 가진다.
- Service class 파일에는 top-level type/helper/mapper/constant를 함께 두지 않는다. 입력/Result/Options/Provider interface/helper는 같은 domain 폴더의 별도 파일로 분리한다.
- Service class가 이미 public method 타입을 제공하면 그 메서드 목록을 복제한 `*Port` interface/type/file을 만들지 않는다. DI token은 런타임 provider 선택만 담당하고, TypeScript 계약은 owner package가 export하는 실제 Service/Client/Aggregate class 타입을 직접 사용한다.
- Service DI 계약 이름에 `Port` 접미사를 새로 붙이지 않는다. 정말 별도 추상 계약이 필요하면 승인된 spec에 이유, owner, 소비 범위가 명시되어야 하며 기존 class 타입을 재사용할 수 없는지 먼저 증명한다.
- `packages/be-service/src`에는 service behavior를 담은 `export function` 또는 exported arrow helper를 새로 만들지 않는다. DI provider, `ConfigService`/env, Repository/Client, time/random, 외부 protocol에 닿는 로직은 반드시 `@Injectable()` service class로 만든다.
- 순수 runtime helper가 필요하면 먼저 `@cocrepo/toolkit` 재사용/이동을 검토한다. service-local mapper/normalizer/parser 예외는 creator skill이 허용한 별도 파일에서만 두고, provider 의존성이나 환경 의존성이 생기면 즉시 service class로 승격한다.

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
- 별도 Service spec은 만들지 않고 route `page.spec.md` 또는 담당 스펙의 Service 계약 섹션을 갱신
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
