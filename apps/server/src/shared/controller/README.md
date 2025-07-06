# Base Controller 사용 가이드

이 프로젝트는 NestJS에서 OpenAPI가 적용된 추상화된 base controller를 제공합니다.

## 기본 Base Controller (`BaseController`)

### 사용법

```typescript
import { Controller, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity } from '../decorator';
import { BaseController } from './base.controller';

@ApiTags('YOUR-RESOURCE')
@Controller()
export class YourController extends BaseController<
  YourDto,
  CreateYourDto,
  UpdateYourDto,
  YourQueryDto,
  YourService
> {
  protected readonly dtoClass = YourDto;

  constructor(protected readonly service: YourService) {
    super();
  }

  // OpenAPI 문서화를 위한 데코레이터 재정의
  @ApiResponseEntity(YourDto, HttpStatus.OK)
  async create(createDto: CreateYourDto) {
    return super.create(createDto);
  }

  @ApiResponseEntity(YourDto, HttpStatus.OK)
  async getById(id: string) {
    return super.getById(id);
  }

  // ... 다른 메서드들
}
```

### 제공되는 엔드포인트

- `POST /` - 리소스 생성
- `GET /:id` - ID로 리소스 조회
- `PATCH /:id` - 리소스 수정
- `PATCH /:id/removedAt` - 리소스 소프트 삭제
- `DELETE /:id` - 리소스 물리적 삭제
- `GET /` - 쿼리로 리소스 목록 조회

## 고급 Base Controller (`AdvancedBaseController`)

### 특징

- 엔드포인트 활성화/비활성화 옵션
- 커스텀 인증 설정
- 유연한 구성 옵션
- 향상된 타입 안전성

### 사용법

```typescript
import { Controller, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdvancedBaseController } from './advanced-base.controller';

@ApiTags('YOUR-RESOURCE-ADVANCED')
@Controller()
export class YourAdvancedController extends AdvancedBaseController<
  YourDto,
  CreateYourDto,
  UpdateYourDto,
  YourQueryDto,
  YourService
> {
  protected readonly dtoClass = YourDto;

  constructor(protected readonly service: YourService) {
    super({
      tag: 'YOUR-RESOURCE-ADVANCED',
      defaultRoles: ['user'], // 기본 인증 역할
      enabledEndpoints: {
        create: true,
        getById: true,
        updateById: true,
        removeById: true,
        deleteById: false, // 물리적 삭제 비활성화
        getManyByQuery: true,
      },
    });
  }

  // 데코레이터 재정의
  @Auth([])
  @ApiResponseEntity(YourDto, HttpStatus.OK)
  async create(createDto: CreateYourDto) {
    return super.create(createDto);
  }

  // 커스텀 엔드포인트 추가 가능
  @Get('custom')
  @Auth(['admin'])
  @ApiResponseEntity(YourDto, HttpStatus.OK)
  async customEndpoint() {
    return this.createSuccessResponse('커스텀 엔드포인트 성공', []);
  }
}
```

### 구성 옵션

```typescript
interface BaseControllerOptions {
  /** API 태그 이름 */
  tag?: string;
  /** 기본 인증 역할 */
  defaultRoles?: any[];
  /** 사용할 ID 파라미터 이름 (기본값: 'id') */
  idParam?: string;
  /** 활성화할 엔드포인트들 */
  enabledEndpoints?: {
    create?: boolean;
    getById?: boolean;
    updateById?: boolean;
    removeById?: boolean;
    deleteById?: boolean;
    getManyByQuery?: boolean;
  };
}
```

## 타입 요구사항

### Service 타입 요구사항

서비스는 다음 메서드들을 구현해야 합니다:

```typescript
interface BaseService<TCreateDto, TUpdateDto, TQueryDto> {
  create(dto: TCreateDto): Promise<any>;
  getById(id: string): Promise<any>;
  updateById(id: string, dto: TUpdateDto): Promise<any>;
  removeById(id: string): Promise<any>;
  deleteById(id: string): Promise<any>;
  getManyByQuery(query: TQueryDto): Promise<{ items: any[]; count: number }>;
}
```

### Query DTO 요구사항

Query DTO는 페이지네이션을 위한 `toPageMetaDto` 메서드를 구현해야 합니다:

```typescript
interface BaseQueryDto {
  toPageMetaDto(count: number): PageMetaDto;
}
```

## 장점

1. **코드 재사용성**: 반복적인 CRUD 코드를 줄입니다
2. **일관성**: 모든 컨트롤러에서 일관된 API 구조를 유지합니다
3. **OpenAPI 지원**: 자동으로 Swagger 문서가 생성됩니다
4. **타입 안전성**: TypeScript의 강력한 타입 체크를 활용합니다
5. **유연성**: 필요에 따라 개별 엔드포인트를 오버라이드할 수 있습니다

## 예시 프로젝트

`role-classifications.controller.ts`와 `advanced-role-classifications.controller.ts` 파일을 참고하여 실제 구현 예시를 확인할 수 있습니다.
