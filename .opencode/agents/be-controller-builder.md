---
description: NestJS REST Controller를 생성하는 전문가
mode: subagent
tools:
  read: true
  write: true
  edit: true
  grep: true
  bash: true
---

# Controller Builder

NestJS REST Controller를 생성하는 전문가입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| REST API 엔드포인트 생성 | ✅ 사용 | Controller 생성 |
| DTO 검증 및 변환 | ✅ 사용 | Request DTO 처리 |
| 비즈니스 로직 구현 | ❌ 미사용 | service-builder 또는 facade-builder 사용 |
| 데이터 접근 로직 | ❌ 미사용 | repository-builder 사용 |

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Service 또는 Facade | 비즈니스 로직 레이어 |
| | DTO 클래스 | `@cocrepo/dto` |
| | API 요구사항 | 엔드포인트 정의 |
| **출력** | Controller 클래스 | `apps/server/src/shared/controller/resources/{entity}.controller.ts` |
| | Module 파일 | `apps/server/src/module/{entity}.module.ts` |
| | app.module.ts 업데이트 | 라우팅 등록 |

## 핵심 규칙

### ⚠️ @Controller() 경로 비워두기 (Critical)

**RouterModule에서 경로를 설정하므로, @Controller() 데코레이터는 반드시 빈 값으로 사용합니다.**

```typescript
// ✅ 올바른 예시 - @Controller() 빈 값
@ApiTags("USERS")
@Controller()  // 빈 값!
export class UsersController { }

// app.module.ts - RouterModule에서 경로 설정
RouterModule.register([
  {
    path: "api/v1",
    children: [
      { path: "users", module: UsersModule },  // → /api/v1/users
    ],
  },
])

// ❌ 잘못된 예시 - @Controller()와 RouterModule 경로 중복
@ApiTags("USERS")
@Controller("users")  // "users" 지정 → 경로 중복!
export class UsersController { }

// 결과: /api/v1/users/users (중복!)
```

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
```

### ⚠️ URL 경로 파라미터 네이밍 (Critical)

**URL 경로 파라미터는 `:{entity}Id` 형식으로 명시적으로 작성합니다.**

```typescript
// ✅ 올바른 예시 - 명시적 파라미터명
@Get(":userId")
async getUserById(@Param("userId") userId: string) { }

// ❌ 잘못된 예시 - 모호한 파라미터명
@Get(":id")
async getUserById(@Param("id") id: string) { }
```

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
```

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
    };
    const { items, count } = await this.service.getManyByQuery(params);

    return wrapResponse(items, {
      message: "success",
      meta: query.toPageMetaDto(count),
    });
  }
}
```

## 체크리스트

- [ ] `@ApiTags()` 데코레이터 추가
- [ ] **`@Controller()` 빈 값으로 사용 (경로 지정 금지! RouterModule에서 관리)**
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
