---
name: 파사드-빌더
description: NestJS Facade 레이어를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# Facade Builder

NestJS Facade 레이어를 생성하는 전문가입니다.

## Facade란?

Facade 패턴은 복잡한 서브시스템에 대한 단순화된 인터페이스를 제공합니다.
여러 Service를 조합하여 하나의 비즈니스 흐름을 구현합니다.

```
Controller → Facade → Service(s) → Repository → Prisma
```

---

## 핵심 원칙

### ✅ 반드시 지켜야 할 규칙

1. **Prisma 직접 호출 금지**
   - 모든 데이터 접근은 Service Layer를 통해서만
   - Facade는 비즈니스 흐름 조합에 집중

   ```typescript
   // ❌ 금지 - Facade에서 Prisma 직접 호출
   @Inject(PRISMA_SERVICE_TOKEN) private prisma: PrismaService

   async signUp(params: SignUpParams) {
     const role = await this.prisma.role.findFirst({
       where: { name: "USER" },
     });
     const space = await this.prisma.space.create({ data: {} });
     const user = await this.prisma.user.create({ data: { ... } });
   }

   // ✅ 권장 - Service Layer를 통한 데이터 접근
   constructor(
     private usersService: UsersService,
     private rolesService: RolesService,
     private spacesService: SpacesService,
   ) {}

   async signUp(params: SignUpParams) {
     const role = await this.rolesService.getDefaultUserRole();
     const space = await this.spacesService.createPersonalSpace();
     const user = await this.usersService.createUserForSignUp({ ... });
   }
   ```

2. **여러 Service 조합**
   - 단일 Service 호출만 필요하면 Controller에서 직접 호출
   - Facade는 여러 Service를 조합하는 복잡한 비즈니스 흐름에 사용

   ```typescript
   // 회원가입 흐름: Role 조회 → Space 생성 → User 생성 → Token 발급
   async signUp(params: SignUpParams) {
     const role = await this.rolesService.getDefaultUserRole();
     const space = await this.spacesService.createPersonalSpace();
     const user = await this.usersService.createUserForSignUp({
       ...params,
       roleId: role.id,
       spaceId: space.id,
     });
     return this.tokenService.generateTokens({ userId: user.id });
   }
   ```

3. **도메인별 Facade 분리**
   - 인증: `AuthFacade`
   - 주문: `OrderFacade`
   - 결제: `PaymentFacade`

4. **Facade 메서드명은 비즈니스 흐름을 표현**

   ```typescript
   // ❌ 금지 - 데이터 중심 메서드명
   createUserWithRoleAndSpace()

   // ✅ 권장 - 비즈니스 흐름 메서드명
   signUp()
   login()
   checkout()
   processPayment()
   ```

---

## 파일 위치

```
packages/facade/src/{domain}.facade.ts
```

---

## 기본 템플릿

```typescript
import {
  {Entity}sService,
  TokenService,
  // 필요한 Service들
} from "@cocrepo/service";
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";

/**
 * {Domain} Facade
 * {도메인} 관련 비즈니스 흐름 처리
 *
 * ✅ Service Layer를 통해 데이터 접근
 * ❌ Prisma 직접 호출 금지
 */
@Injectable()
export class {Domain}Facade {
  private readonly logger = new Logger({Domain}Facade.name);

  constructor(
    private {entity}sService: {Entity}sService,
    private tokenService: TokenService,
    // 필요한 Service들 주입
  ) {}

  /**
   * 비즈니스 흐름 1
   */
  async businessFlow1(params: BusinessFlow1Params) {
    // 1. 첫 번째 Service 호출
    const result1 = await this.service1.method1();

    // 2. 두 번째 Service 호출
    const result2 = await this.service2.method2(result1.id);

    // 3. 결과 조합 및 반환
    return { result1, result2 };
  }
}
```

---

## 사용 시나리오

### 1. 인증 Facade (AuthFacade)

```typescript
@Injectable()
export class AuthFacade {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private spacesService: SpacesService,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  /**
   * 회원가입
   * 흐름: 역할 조회 → Space 생성 → 사용자 생성 → 토큰 발급
   */
  async signUp(params: SignUpParams) {
    // 1. 기본 사용자 역할 조회
    const role = await this.rolesService.getDefaultUserRole();
    if (!role) {
      throw new BadRequestException("유저 역할이 존재하지 않습니다.");
    }

    // 2. 개인 Space 생성
    const space = await this.spacesService.createPersonalSpace();

    // 3. 비밀번호 해싱
    const hashedPassword = await this.hashPassword(params.password);

    // 4. 사용자 생성
    const user = await this.usersService.createUserForSignUp({
      ...params,
      password: hashedPassword,
      spaceId: space.id,
      roleId: role.id,
    });

    // 5. 토큰 생성
    return this.tokenService.generateTokens({ userId: user.id });
  }

  /**
   * 로그인
   * 흐름: 사용자 조회 → 비밀번호 검증 → 토큰 발급
   */
  async login(params: LoginParams) {
    const user = await this.usersService.findUserForAuth(params.email);
    if (!user) {
      throw new UnauthorizedException("유저가 존재하지 않습니다.");
    }

    const isValid = await this.verifyPassword(params.password, user.password);
    if (!isValid) {
      throw new BadRequestException("비밀번호가 일치하지 않습니다.");
    }

    return this.tokenService.generateTokensWithStorage({ userId: user.id });
  }
}
```

### 2. 주문 Facade (OrderFacade)

```typescript
@Injectable()
export class OrderFacade {
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private paymentsService: PaymentsService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * 주문 생성
   * 흐름: 상품 확인 → 재고 검증 → 주문 생성 → 결제 처리 → 알림 발송
   */
  async createOrder(params: CreateOrderParams) {
    // 1. 상품 존재 확인
    const product = await this.productsService.getById(params.productId);
    if (!product) {
      throw new NotFoundException("상품을 찾을 수 없습니다.");
    }

    // 2. 재고 검증
    const hasStock = await this.productsService.checkStock(
      params.productId,
      params.quantity,
    );
    if (!hasStock) {
      throw new BadRequestException("재고가 부족합니다.");
    }

    // 3. 주문 생성
    const order = await this.ordersService.create({
      userId: params.userId,
      productId: params.productId,
      quantity: params.quantity,
    });

    // 4. 결제 처리
    await this.paymentsService.process(order.id, params.paymentInfo);

    // 5. 알림 발송
    await this.notificationsService.sendOrderConfirmation(order);

    return order;
  }
}
```

---

## Facade vs Service 구분

| 구분 | Facade | Service |
|------|--------|---------|
| **역할** | 비즈니스 흐름 조합 | 단일 도메인 로직 |
| **Service 호출** | 여러 Service 조합 | 단일 Repository 호출 |
| **데이터 접근** | Service를 통해서만 | Repository를 통해서만 |
| **예시** | 회원가입, 주문 처리, 결제 | 사용자 CRUD, 상품 조회 |

### 언제 Facade를 사용하나?

```typescript
// ✅ 복잡한 비즈니스 흐름 - Facade 사용
async signUp(params: SignUpParams) {
  // Role 조회 → Space 생성 → User 생성 → Token 발급
  // 4개의 Service를 조합하는 복잡한 흐름
}
```

### 언제 Facade 없이 Service만 사용하나?

**Facade가 필요 없는 도메인** (모든 API가 단순 CRUD인 경우):

```typescript
// Controller에서 Service 직접 사용 (Facade 없는 도메인)
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  async getProduct(id: string) {
    return this.productsService.getById(id);
  }
}
```

**중요**: Facade가 있는 도메인에서는 Controller가 Facade만 사용해야 합니다. 단순 조회도 Facade를 통해 위임해야 Controller의 일관성이 유지됩니다.

---

## ❌ 하지 말아야 할 것

### 1. Prisma 직접 호출

```typescript
// ❌ 금지
constructor(
  @Inject(PRISMA_SERVICE_TOKEN) private prisma: PrismaService,
) {}

async signUp() {
  return this.prisma.user.create({ data: { ... } });
}
```

### 2. Repository 직접 호출

```typescript
// ❌ 금지
constructor(
  private usersRepository: UsersRepository,
) {}

async signUp() {
  return this.usersRepository.create({ ... });
}
```

### 3. 단순 위임만 하는 Facade (조건부 허용)

```typescript
// ⚠️ 조건부 허용 - Controller의 일관성을 위해 필요한 경우
async getUser(id: string) {
  return this.usersService.getById(id);
}
```

**주의**: 단순 위임 메서드는 일반적으로 불필요하지만, **Controller에서 Facade를 사용하는 경우** 일관성을 위해 허용됩니다.

- Controller는 Facade **또는** Service 중 하나만 사용해야 함
- Facade가 있는 도메인의 Controller는 Facade만 사용
- 따라서 단순 조회도 Facade를 통해 위임해야 함

```typescript
// ✅ 허용 - Controller 일관성을 위해 단순 위임도 Facade에 추가
@Injectable()
export class AbilitiesFacade {
  // 복잡한 비즈니스 로직
  async getMyAbilities(userId: string) {
    const user = await this.usersService.getById(userId);
    const roleId = user.tenants[0].roleId;
    return this.abilitiesService.getAbilitiesByRoleId(roleId);
  }

  // 단순 위임 - Controller 일관성을 위해 허용
  async getAbilitiesByRoleId(roleId: string) {
    return this.abilitiesService.getAbilitiesByRoleId(roleId);
  }
}
```

---

## 체크리스트

- [ ] `@Injectable()` 데코레이터 추가
- [ ] **Prisma 직접 호출 없음 확인**
- [ ] **Repository 직접 호출 없음 확인**
- [ ] Service Layer만 주입
- [ ] 여러 Service를 조합하는 비즈니스 흐름
- [ ] 메서드명이 비즈니스 흐름을 표현
- [ ] Logger 초기화
- [ ] **Controller 일관성**: Facade가 있으면 모든 Controller 메서드가 Facade만 사용

---

## Export 등록

```typescript
// packages/facade/src/index.ts
export { {Domain}Facade } from "./{domain}.facade";
```

---

## 관련 파일

- Service: `packages/service/src/{entity}.service.ts`
- Controller: `apps/server/src/module/{domain}/{domain}.controller.ts`
- Repository: `packages/repository/src/{entity}.repository.ts`
