import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

/**
 * Query DTO의 각 속성을 OpenAPI에 자동으로 표시하는 간단한 팩토리 함수
 *
 * @param queryDtoClass Query DTO 클래스
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * export class YourController extends AutoBaseController<...> {
 *   @Get()
 *   @SimpleApiQueryDto(QueryYourEntityDto)
 *   async getManyByQuery(@Query() query: QueryYourEntityDto) {
 *     return super.getManyByQuery(query);
 *   }
 * }
 * ```
 */
export function SimpleApiQueryDto<T>(queryDtoClass: Type<T>) {
  const queries: any[] = [];

  try {
    // Swagger metadata에서 속성 정보를 추출
    const properties =
      Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, queryDtoClass) || [];
    const propertiesMap = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, queryDtoClass) || {};

    // 각 속성에 대해 ApiQuery 생성
    properties.forEach((propertyKey: string) => {
      const property = propertiesMap[propertyKey];
      if (property) {
        const queryOptions: any = {
          name: propertyKey,
          required: property.required || false,
          type: property.type || 'string',
          description: property.description || propertyKey,
        };

        // 추가 옵션들 설정
        if (property.minimum !== undefined) queryOptions.minimum = property.minimum;
        if (property.maximum !== undefined) queryOptions.maximum = property.maximum;
        if (property.example !== undefined) queryOptions.example = property.example;
        if (property.enum) queryOptions.enum = property.enum;

        queries.push(ApiQuery(queryOptions));
      }
    });

    // 상위 클래스의 속성들도 확인 (상속된 QueryDto의 경우)
    let parentClass = Object.getPrototypeOf(queryDtoClass);
    while (parentClass && parentClass !== Object && parentClass.name !== 'Object') {
      const parentProperties =
        Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, parentClass) || [];
      const parentPropertiesMap =
        Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, parentClass) || {};

      parentProperties.forEach((propertyKey: string) => {
        // 이미 추가된 속성은 스킵
        if (properties.includes(propertyKey)) return;

        const property = parentPropertiesMap[propertyKey];
        if (property) {
          const queryOptions: any = {
            name: propertyKey,
            required: property.required || false,
            type: property.type || 'string',
            description: property.description || propertyKey,
          };

          if (property.minimum !== undefined) queryOptions.minimum = property.minimum;
          if (property.maximum !== undefined) queryOptions.maximum = property.maximum;
          if (property.example !== undefined) queryOptions.example = property.example;
          if (property.enum) queryOptions.enum = property.enum;

          queries.push(ApiQuery(queryOptions));
        }
      });

      parentClass = Object.getPrototypeOf(parentClass);
    }

    // 메타데이터가 없는 경우 기본 파라미터만 추가
    if (queries.length === 0) {
      const commonQueryParams = [
        {
          name: 'skip',
          required: false,
          type: 'number',
          description: '건너뛸 항목 수 (페이징)',
          minimum: 0,
          example: 0,
        },
        {
          name: 'take',
          required: false,
          type: 'number',
          description: '가져올 항목 수 (페이징)',
          minimum: 1,
          maximum: 100,
          example: 10,
        },
      ];

      commonQueryParams.forEach((param) => {
        queries.push(ApiQuery(param));
      });
    }
  } catch (error) {
    console.warn('SimpleApiQueryDto: 메타데이터 추출 실패, 기본 파라미터만 추가합니다.', error);

    // 에러 발생 시 기본 파라미터만 추가
    const commonQueryParams = [
      {
        name: 'skip',
        required: false,
        type: 'number',
        description: '건너뛸 항목 수 (페이징)',
        minimum: 0,
        example: 0,
      },
      {
        name: 'take',
        required: false,
        type: 'number',
        description: '가져올 항목 수 (페이징)',
        minimum: 1,
        maximum: 100,
        example: 10,
      },
    ];

    commonQueryParams.forEach((param) => {
      queries.push(ApiQuery(param));
    });
  }

  return applyDecorators(...queries);
}
