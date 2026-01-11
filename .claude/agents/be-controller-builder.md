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
import { ApiTags } from "@nestjs/swagger";
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
   * GET /api/v1/{entities}/:id
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async getById(@Param("id") id: string) {
    const result = await this.service.getById(id);
    return result;
  }

  /**
   * 수정
   * PATCH /api/v1/{entities}/:id
   */
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async updateById(
    @Param("id") id: string,
    @Body() dto: Update{Entity}Dto,
  ) {
    const data = {
      ...(dto.field1 !== undefined && { field1: dto.field1 }),
      ...(dto.field2 !== undefined && { field2: dto.field2 }),
    };
    const result = await this.service.updateById(id, data);
    return result;
  }

  /**
   * 소프트 삭제
   * PATCH /api/v1/{entities}/:id/removedAt
   */
  @Patch(":id/removedAt")
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async removeById(@Param("id") id: string) {
    const result = await this.service.removeById(id);
    return result;
  }

  /**
   * 물리 삭제
   * DELETE /api/v1/{entities}/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity({Entity}Dto, HttpStatus.OK)
  async deleteById(@Param("id") id: string) {
    const result = await this.service.deleteById(id);
    return result;
  }

  /**
   * 목록 조회
   * GET /api/v1/{entities}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
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
| `GET` | `/api/v1/{entities}/:id` | 단일 조회 |
| `PATCH` | `/api/v1/{entities}/:id` | 수정 |
| `PATCH` | `/api/v1/{entities}/:id/removedAt` | 소프트 삭제 |
| `DELETE` | `/api/v1/{entities}/:id` | 물리 삭제 |

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
@Get(":id")                 // GET 요청 (경로 파라미터)
@Patch(":id")               // PATCH 요청
@Delete(":id")              // DELETE 요청

@HttpCode(HttpStatus.OK)    // 응답 상태 코드 (200)
@ApiResponseEntity(Dto, Status)  // Swagger 응답 문서
```

#### 파라미터 레벨

```typescript
@Body() dto: CreateDto      // 요청 본문
@Param("id") id: string     // URL 파라미터
@Query() query: QueryDto    // 쿼리 스트링
@Req() req: Request         // Express Request 객체
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
@Patch(":id")
async updateById(@Param("id") id: string, @Body() dto: UpdateUserDto) {
  const data = {
    ...(dto.name !== undefined && { name: dto.name }),
    ...(dto.email !== undefined && { email: dto.email }),
  };
  return this.service.updateById(id, data);
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
