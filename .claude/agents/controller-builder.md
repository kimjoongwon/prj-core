---
name: 컨트롤러-빌더
description: NestJS REST Controller를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# Controller Builder

NestJS REST Controller를 생성하는 전문가입니다.

## 역할

- 새로운 Controller 클래스 생성
- REST API 엔드포인트 구현
- DTO ↔ Entity 변환 처리
- Module 및 라우팅 설정

---

## 파일 위치

```
apps/server/src/shared/controller/resources/{entity}.controller.ts
apps/server/src/module/{entity}.module.ts
```

---

## Controller 기본 템플릿

```typescript
import { ApiResponseEntity } from "@cocrepo/decorator";
import {
  Create{Entity}Dto,
  Query{Entity}Dto,
  Update{Entity}Dto,
  {Entity}Dto,
} from "@cocrepo/dto";
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

---

## Module 템플릿

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

---

## 라우팅 등록 (app.module.ts)

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

## 핵심 데코레이터

### 클래스 레벨

```typescript
@ApiTags("USERS")           // Swagger 그룹화
@Controller()               // 라우트 기본 경로 (RouterModule에서 설정)
```

### 메서드 레벨

```typescript
@Post()                     // POST 요청
@Get()                      // GET 요청
@Get(":id")                 // GET 요청 (경로 파라미터)
@Patch(":id")               // PATCH 요청
@Delete(":id")              // DELETE 요청

@HttpCode(HttpStatus.OK)    // 응답 상태 코드 (200)
@ApiResponseEntity(Dto, Status)  // Swagger 응답 문서
```

### 파라미터 레벨

```typescript
@Body() dto: CreateDto      // 요청 본문
@Param("id") id: string     // URL 파라미터
@Query() query: QueryDto    // 쿼리 스트링
@Req() req: Request         // Express Request 객체
```

---

## REST API 패턴

| HTTP 메서드 | 경로 | 설명 |
|------------|------|------|
| `POST` | `/api/v1/{entities}` | 생성 |
| `GET` | `/api/v1/{entities}` | 목록 조회 |
| `GET` | `/api/v1/{entities}/:id` | 단일 조회 |
| `PATCH` | `/api/v1/{entities}/:id` | 수정 |
| `PATCH` | `/api/v1/{entities}/:id/removedAt` | 소프트 삭제 |
| `DELETE` | `/api/v1/{entities}/:id` | 물리 삭제 |

---

## DTO → Service 파라미터 변환

### Create DTO 변환

```typescript
// Controller
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

### Update DTO 변환

```typescript
// Controller
@Patch(":id")
async updateById(@Param("id") id: string, @Body() dto: UpdateUserDto) {
  const data = {
    ...(dto.name !== undefined && { name: dto.name }),
    ...(dto.email !== undefined && { email: dto.email }),
  };
  return this.service.updateById(id, data);
}
```

### Query DTO 변환

```typescript
// Controller
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

---

## 응답 래핑

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

---

## 체크리스트

- [ ] `@ApiTags()` 데코레이터 추가
- [ ] `@Controller()` 데코레이터 추가
- [ ] Service 주입
- [ ] Logger 초기화
- [ ] 각 메서드에 `@HttpCode(HttpStatus.OK)` 추가
- [ ] 각 메서드에 `@ApiResponseEntity()` 추가
- [ ] Module 파일 생성
- [ ] `app.module.ts`에 Module import
- [ ] RouterModule에 경로 등록

---

## 관련 파일

- Service: `packages/service/src/resources/{entity}.service.ts`
- Repository: `packages/repository/src/repositories/{entity}.repository.ts`
- DTO: `packages/dto/src/{entity}.dto.ts`
- Module: `apps/server/src/module/{entity}.module.ts`
- App Module: `apps/server/src/module/app.module.ts`
