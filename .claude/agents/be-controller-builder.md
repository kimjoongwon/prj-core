---
name: 컨트롤러-빌더
description: NestJS REST Controller를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# Controller Builder

NestJS REST Controller를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| REST API 엔드포인트 생성 | ✅ 사용 | Controller 생성 |
| DTO 검증 및 변환 | ✅ 사용 | Request DTO 처리 |
| 비즈니스 로직 구현 | ❌ 미사용 | service-builder 또는 facade-builder 사용 |
| 데이터 접근 로직 | ❌ 미사용 | repository-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Service 또는 Facade | 비즈니스 로직 레이어 |
| | DTO 클래스 | `@cocrepo/dto` |
| | API 요구사항 | 엔드포인트 정의 |
| **출력** | Controller 클래스 | `apps/server/src/shared/controller/resources/{entity}.controller.ts` |
| | Module 파일 | `apps/server/src/module/{entity}.module.ts` |
| | app.module.ts 업데이트 | 라우팅 등록 |

---

## 핵심 규칙

### ⚠️ operationId 필수 및 메서드명 일치 (Critical)

**모든 API 엔드포인트에 `operationId`를 반드시 지정하고, 메서드명과 일치시켜야 합니다.**

```typescript
// ✅ 올바른 예시 - operationId와 메서드명 일치
@Get()
@ApiOperation({
  operationId: "getUsers",  // 필수!
  summary: "회원 목록 조회",
  description: "현재 Space 내의 회원 목록을 조회합니다.",
})
async getUsers() { }  // operationId와 동일!

@Get(":id")
@ApiOperation({
  operationId: "getUserById",  // 필수!
  summary: "회원 상세 조회",
})
async getUserById(@Param("id") id: string) { }  // operationId와 동일!

// ❌ 잘못된 예시 - operationId 누락
@Get()
@ApiOperation({
  summary: "회원 목록 조회",  // operationId 없음 → orval 오류 발생!
})
async getAll() { }

// ❌ 잘못된 예시 - operationId와 메서드명 불일치
@Get()
@ApiOperation({
  operationId: "getUsers",
  summary: "회원 목록 조회",
})
async getAll() { }  // 불일치! → getUsers()로 변경 필요
```

**operationId 네이밍 규칙:**

| HTTP 메서드 | 패턴 | 예시 |
|------------|------|------|
| `GET` (목록) | `get{Entity}s` | `getUsers`, `getAbilities` |
| `GET` (단일) | `get{Entity}ById` | `getUserById`, `getAbilityById` |
| `POST` | `create{Entity}` | `createUser`, `createAbility` |
| `PATCH` | `update{Entity}` | `updateUser`, `updateAbility` |
| `DELETE` | `delete{Entity}` | `deleteUser`, `deleteAbility` |
| `PUT` | `set{Entity}` / `replace{Entity}` | `setRoleAbilities` |

**이유:**
- operationId가 없으면 NestJS Swagger가 메서드명 기반으로 자동 생성
- 여러 컨트롤러에 `getAll()`, `getById()` 같은 동일한 메서드명이 있으면 **orval codegen 중복 스키마 오류 발생**
- 예: `Duplicate schema names detected: 4x GetAll200AllOf`
- **operationId와 메서드명 일치 규칙:**
  - 코드 가독성 향상 - operationId만 보고 해당 메서드를 쉽게 찾을 수 있음
  - 일관성 유지 - API 문서와 코드베이스 간 네이밍 통일
  - 디버깅 용이 - 에러 로그에서 메서드명으로 추적 가능

---

### ⚠️ URL 경로 파라미터 네이밍 (Critical)

**URL 경로 파라미터는 `:{entity}Id` 형식으로 명시적으로 작성합니다.**

| 패턴 | 예시 | 설명 |
|------|------|------|
| `:{entity}Id` | `:userId`, `:orderId` | 리소스 ID 파라미터 |
| `:{parent}Id/{children}/:{child}Id` | `:userId/orders/:orderId` | 중첩 라우트 |

```typescript
// ✅ 올바른 예시 - 명시적 파라미터명
@Get(":userId")
async getUserById(@Param("userId") userId: string) { }

@Get(":userId/orders/:orderId")
async getOrder(
  @Param("userId") userId: string,
  @Param("orderId") orderId: string,
) { }

// ❌ 잘못된 예시 - 모호한 파라미터명
@Get(":id")
async getUserById(@Param("id") id: string) { }

@Get(":id/orders/:id")  // 어떤 id인지 불명확
async getOrder(...) { }
```

**이유:**
- 중첩 라우트에서 어떤 리소스의 ID인지 명확히 구분
- React Query 캐시 키 설계 시 파라미터 의미 명확
- 권한 검증 코드에서 리소스 소유권 확인 용이
- 디버깅/로깅 시 파라미터 의미 파악 용이

---

### ✅ Do

```typescript
// Entity 직접 반환 (DtoTransformInterceptor가 자동 변환)
@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
async getMyAbilities(): Promise<Ability[]> {
  return this.service.getAbilitiesByRoleId(roleId);
}

// Facade 또는 Service 중 하나만 사용
@Controller()
export class AbilitiesController {
  constructor(
    private readonly abilitiesFacade: AbilitiesFacade,
  ) {}
}

// 메서드 내 직접 작성 (private 헬퍼 분리 금지)
async getMyAbilities() {
  const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
  if (!user?.id) {
    throw new UnauthorizedException("사용자를 찾을 수 없습니다");
  }
  return this.facade.getMyAbilities(user.id);
}

// DTO는 @cocrepo/dto에서 import
import { CreateAbilityDto, AbilityResponseDto } from "@cocrepo/dto";
```

### ❌ Don't

```typescript
// 수동 DTO 변환 금지 (DtoTransformInterceptor 사용)
async getMyAbilities(): Promise<AbilityResponseDto[]> {
  const abilities = await this.service.getAbilitiesByRoleId(roleId);
  return abilities.map((ability) =>
    plainToInstance(AbilityResponseDto, ability, {
      excludeExtraneousValues: true,
    }),
  );
}

// Facade와 Service 혼용 금지
constructor(
  private readonly abilitiesFacade: AbilitiesFacade,
  private readonly abilitiesService: AbilitiesService,  // 혼용 금지
) {}

// private 헬퍼 메서드 분리 금지
private getCurrentUser(): User {
  const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
  if (!user?.id) {
    throw new UnauthorizedException("사용자를 찾을 수 없습니다");
  }
  return user;
}

// 서버 모듈 내 DTO import 금지
import { CreateAbilityDto } from "./dto";
```

---

## 프로세스

### 1단계: Service 또는 Facade 주입 결정

- 여러 Service 조합 필요 → Facade 사용
- 단순 CRUD → Service 직접 사용

### 2단계: Controller 클래스 작성

### 3단계: Module 파일 생성

### 4단계: app.module.ts에 라우팅 등록

---

## 템플릿

### Controller 기본 템플릿

```typescript
import { ApiResponseEntity } from "@cocrepo/decorator";
import {
  Create{Entity}Dto,
  Query{Entity}Dto,
  Update{Entity}Dto,
  {Entity}Dto,
} from "@cocrepo/dto";
import { {Entity} } from "@cocrepo/entity";
import { {Entity}sService } from "@cocrepo/service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { wrapResponse } from "../../util/response.util";

@ApiTags("{ENTITY}S")
@Controller()
export class {Entity}sController {
  private readonly logger = new Logger({Entity}sController.name);

  constructor(private readonly service: {Entity}sService) {}

  /**
   * 생성
   * POST /api/v1/{entities}
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "create{Entity}",
    summary: "{Entity} 생성",
  })
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async create(@Body() dto: Create{Entity}Dto) {
    // DTO → params 변환
    const params = {
      field1: dto.field1,
      field2: dto.field2,
    };
    const result = await this.service.create(params);
    return result;
  }

  /**
   * 단일 조회
   * GET /api/v1/{entities}/:{entity}Id
   */
  @Get(":{entity}Id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "get{Entity}ById",
    summary: "{Entity} 상세 조회",
  })
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async getById(@Param("{entity}Id") {entity}Id: string) {
    const result = await this.service.getById({entity}Id);
    return result;
  }

  /**
   * 수정
   * PATCH /api/v1/{entities}/:{entity}Id
   */
  @Patch(":{entity}Id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "update{Entity}",
    summary: "{Entity} 수정",
  })
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async updateById(
    @Param("{entity}Id") {entity}Id: string,
    @Body() dto: Update{Entity}Dto,
  ) {
    const data = {
      ...(dto.field1 !== undefined && { field1: dto.field1 }),
      ...(dto.field2 !== undefined && { field2: dto.field2 }),
    };
    const result = await this.service.updateById({entity}Id, data);
    return result;
  }

  /**
   * 소프트 삭제
   * PATCH /api/v1/{entities}/:{entity}Id/removedAt
   */
  @Patch(":{entity}Id/removedAt")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "remove{Entity}",
    summary: "{Entity} 소프트 삭제",
  })
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async removeById(@Param("{entity}Id") {entity}Id: string) {
    const result = await this.service.removeById({entity}Id);
    return result;
  }

  /**
   * 물리 삭제
   * DELETE /api/v1/{entities}/:{entity}Id
   */
  @Delete(":{entity}Id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "delete{Entity}",
    summary: "{Entity} 삭제",
  })
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async deleteById(@Param("{entity}Id") {entity}Id: string) {
    const result = await this.service.deleteById({entity}Id);
    return result;
  }

  /**
   * 목록 조회
   * GET /api/v1/{entities}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "get{Entity}s",
    summary: "{Entity} 목록 조회",
  })
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK, { isArray: true })
  async getMany(@Query() query: Query{Entity}Dto) {
    const params = {
      skip: query.skip,
      take: query.take,
      field1: query.field1,
    };
    const { items, count } = await this.service.getManyByQuery(params);

    return wrapResponse(items, {
      message: "success",
      meta: query.toPageMetaDto(count),
    });
  }
}
```

### Module 템플릿

```typescript
import { {Entity}sController } from "../shared/controller/resources/{entity}.controller";
import { {Entity}sService } from "@cocrepo/service";
import { {Entity}sRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";

@Module({
  controllers: [{Entity}sController],
  providers: [{Entity}sService, {Entity}sRepository],
})
export class {Entity}sModule {}
```

### 라우팅 등록 (app.module.ts)

```typescript
// imports 배열에 추가
imports: [
  // ... 기존 모듈들
  {Entity}sModule,

  RouterModule.register([
    {
      path: "api",
      children: [
        {
          path: "v1",
          children: [
            // 새 경로 추가
            {
              path: "{entities}",
              module: {Entity}sModule,
            },
          ],
        },
      ],
    },
  ]),
],
```

---

## 체크리스트

- [ ] `@ApiTags()` 데코레이터 추가
- [ ] `@Controller()` 데코레이터 추가
- [ ] **각 메서드에 `@ApiOperation({ operationId: "..." })` 추가 (필수!)**
- [ ] **operationId와 메서드명 일치 확인 (예: operationId: "getUsers" → async getUsers())**
- [ ] **URL 파라미터명이 `:{entity}Id` 형식인지 확인 (예: `:userId`, `:orderId`)**
- [ ] Service 또는 Facade 주입 (하나만)
- [ ] Logger 초기화
- [ ] 각 메서드에 `@HttpCode(HttpStatus.OK)` 추가
- [ ] 각 메서드에 `@ApiResponseEntity()` 추가
- [ ] **Entity 직접 반환** (plainToInstance 사용 금지, DtoTransformInterceptor가 자동 변환)
- [ ] **private 헬퍼 메서드 없음** (메서드 내 직접 작성)
- [ ] Module 파일 생성
- [ ] `app.module.ts`에 Module import
- [ ] RouterModule에 경로 등록

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | service-builder | Service 레이어 생성 |
| | facade-builder | Facade 레이어 생성 |
| | dto-builder | DTO 클래스 생성 |
| **후행** | - | - |
| **관련** | - | - |

---

## 프로젝트별 참고사항

### 파일 위치

```
apps/server/src/shared/controller/resources/{entity}.controller.ts
apps/server/src/module/{entity}.module.ts
```

### REST API 패턴

| HTTP 메서드 | 경로 | 설명 |
|------------|------|------|
| `POST` | `/api/v1/{entities}` | 생성 |
| `GET` | `/api/v1/{entities}` | 목록 조회 |
| `GET` | `/api/v1/{entities}/:{entity}Id` | 단일 조회 |
| `PATCH` | `/api/v1/{entities}/:{entity}Id` | 수정 |
| `PATCH` | `/api/v1/{entities}/:{entity}Id/removedAt` | 소프트 삭제 |
| `DELETE` | `/api/v1/{entities}/:{entity}Id` | 물리 삭제 |

### 핵심 데코레이터

#### 클래스 레벨

```typescript
@ApiTags("USERS")           // Swagger 그룹화
@Controller()               // 라우트 기본 경로 (RouterModule에서 설정)
```

#### 메서드 레벨

```typescript
@Post()                     // POST 요청
@Get()                      // GET 요청
@Get(":{entity}Id")         // GET 요청 (경로 파라미터)
@Patch(":{entity}Id")       // PATCH 요청
@Delete(":{entity}Id")      // DELETE 요청

@HttpCode(HttpStatus.OK)    // 응답 상태 코드 (200)
@ApiResponseEntity(Dto, Status)  // Swagger 응답 문서
```

#### 파라미터 레벨

```typescript
@Body() dto: CreateDto              // 요청 본문
@Param("{entity}Id") {entity}Id: string  // URL 파라미터 (명시적 네이밍)
@Query() query: QueryDto            // 쿼리 스트링
@Req() req: Request                 // Express Request 객체
```

### DTO → Service 파라미터 변환

#### Create DTO 변환

```typescript
@Post()
async create(@Body() dto: CreateUserDto) {
  const params = {
    email: dto.email,
    name: dto.name,
    password: dto.password,
  };
  return this.service.create(params);
}
```

#### Update DTO 변환

```typescript
@Patch(":userId")
async updateById(@Param("userId") userId: string, @Body() dto: UpdateUserDto) {
  const data = {
    ...(dto.name !== undefined && { name: dto.name }),
    ...(dto.email !== undefined && { email: dto.email }),
  };
  return this.service.updateById(userId, data);
}
```

#### Query DTO 변환

```typescript
@Get()
async getMany(@Query() query: QueryUserDto) {
  const params = {
    skip: query.skip,
    take: query.take,
    name: query.name,
  };
  const { items, count } = await this.service.getManyByQuery(params);

  return wrapResponse(items, {
    message: "success",
    meta: query.toPageMetaDto(count),
  });
}
```

### 응답 래핑

```typescript
import { wrapResponse } from "../../util/response.util";

// 목록 조회 응답
return wrapResponse(items, {
  message: "success",
  meta: query.toPageMetaDto(count),
});

// 단일 응답은 직접 반환
return result;
```

### 관련 파일

- Service: `packages/service/src/{entity}.service.ts`
- Repository: `packages/repository/src/{entity}.repository.ts`
- DTO: `packages/dto/src/{entity}.dto.ts`
- Module: `apps/server/src/module/{entity}.module.ts`
- App Module: `apps/server/src/module/app.module.ts`
