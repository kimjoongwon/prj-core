# AutoBaseController 사용 가이드

## 개요

`AutoBaseController`와 `@CrudController` 데코레이터를 사용하면 단순히 상속만으로 orval 호환 CRUD API를 생성할 수 있습니다.

## 기본 사용법

```typescript
import { Controller, Type } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AutoBaseController, CrudController } from './auto-base.controller';
import {
  CreateYourEntityDto,
  UpdateYourEntityDto,
  QueryYourEntityDto,
  YourEntityDto,
} from '../dto';
import { YourEntitiesService } from '../service';

@ApiTags('YOUR-ENTITIES')
@CrudController({
  entityName: 'YourEntity', // 필수: 엔티티명 (PascalCase)
  tag: 'YOUR-ENTITIES', // 선택: Swagger 태그
})
@Controller()
export class YourEntitiesController extends AutoBaseController<
  YourEntityDto,
  CreateYourEntityDto,
  UpdateYourEntityDto,
  QueryYourEntityDto,
  YourEntitiesService
> {
  protected readonly service: YourEntitiesService;
  protected readonly dtoClass: Type<YourEntityDto> = YourEntityDto;
  protected readonly entityName: string = 'YourEntity';

  constructor(service: YourEntitiesService) {
    super();
    this.service = service;
  }
}
```

## 자동 생성되는 API

위 설정만으로 다음 API들이 자동으로 생성됩니다:

### HTTP 엔드포인트

- `POST /` - 엔티티 생성
- `GET /:id` - ID로 엔티티 조회
- `PATCH /:id` - 엔티티 수정
- `PATCH /:id/removedAt` - 소프트 삭제
- `DELETE /:id` - 물리적 삭제
- `GET /` - 쿼리로 목록 조회

### orval 호환 함수명

- `createYourEntity`
- `getYourEntityById`
- `updateYourEntityById`
- `removeYourEntityById`
- `deleteYourEntityById`
- `getManyYourEntitiesByQuery`

## 고급 설정

특정 엔드포인트만 활성화하고 싶다면:

```typescript
@CrudController({
  entityName: 'YourEntity',
  tag: 'YOUR-ENTITIES',
  enabledEndpoints: {
    create: true,
    getById: true,
    updateById: true,
    removeById: false,    // 소프트 삭제 비활성화
    deleteById: false,    // 물리적 삭제 비활성화
    getManyByQuery: true
  }
})
```

## 장점

1. **코드 단순성**: 상속만으로 완전한 CRUD API 생성
2. **orval 호환**: 자동으로 고유한 함수명 생성
3. **일관성**: 모든 컨트롤러가 동일한 패턴
4. **타입 안전성**: TypeScript 완전 지원
5. **OpenAPI 자동화**: Swagger 문서 자동 생성

## 기존 BaseController와의 차이

| 구분       | 기존 BaseController    | AutoBaseController                       |
| ---------- | ---------------------- | ---------------------------------------- |
| 함수명     | create, getById (중복) | createWorkspace, getWorkspaceById (고유) |
| 설정       | 수동 오버라이드 필요   | 데코레이터만 추가                        |
| orval 호환 | ❌ 함수명 중복 문제    | ✅ 고유 함수명 생성                      |
| 코드량     | 많음 (각 메서드 정의)  | 적음 (상속만)                            |
