import { Type, applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import 'reflect-metadata';

/**
 * AutoBaseController에서 사용할 동적 Query DTO Swagger 데코레이터
 * 컨트롤러의 queryDtoClass 프로퍼티를 기반으로 자동으로 ApiQuery를 생성합니다.
 */
export function AutoSwaggerQuery(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  // 메서드 실행은 그대로 유지
  descriptor.value = function (...args: any[]) {
    return originalMethod.apply(this, args);
  };

  // 즉시 실행하여 메타데이터 적용
  process.nextTick(() => {
    try {
      // 프로토타입에서 queryDtoClass 정보 찾기
      const queryDtoClass = target.constructor.prototype.queryDtoClass || target.queryDtoClass;

      if (queryDtoClass) {
        applyQueryDtoMetadata(target.constructor, propertyKey, queryDtoClass);
      } else {
        // queryDtoClass가 없는 경우 기본 파라미터만 적용
        applyBasicQueryMetadata(target.constructor, propertyKey);
      }
    } catch (error) {
      console.warn('AutoSwaggerQuery: queryDtoClass를 찾을 수 없습니다.', error);
      // 에러가 발생해도 기본 파라미터는 적용
      applyBasicQueryMetadata(target.constructor, propertyKey);
    }
  });

  return descriptor;
}

/**
 * 기본 페이징 파라미터만 적용하는 함수
 */
function applyBasicQueryMetadata(targetClass: any, methodName: string) {
  const commonQueryParams = [
    {
      name: 'skip',
      required: false,
      type: 'number',
      description: '건너뛸 항목 수 (페이징)',
      minimum: 0,
    },
    {
      name: 'take',
      required: false,
      type: 'number',
      description: '가져올 항목 수 (페이징)',
      minimum: 1,
      maximum: 100,
    },
  ];

  const queries = commonQueryParams.map((param) => ApiQuery(param));
  const combinedDecorator = applyDecorators(...queries);

  combinedDecorator(
    targetClass,
    methodName,
    Object.getOwnPropertyDescriptor(targetClass.prototype, methodName)!,
  );
}

/**
 * Query DTO 클래스를 기반으로 ApiQuery 메타데이터를 동적으로 적용
 */
function applyQueryDtoMetadata(targetClass: any, methodName: string, queryDtoClass: Type<any>) {
  try {
    const queries: any[] = [];

    // Swagger 메타데이터에서 속성 정보 추출
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

    // 상위 클래스의 속성들도 확인 (상속된 DTO의 경우)
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

    // 메타데이터가 없는 경우 기본 페이징 파라미터만 추가
    if (queries.length === 0) {
      const commonQueryParams = [
        {
          name: 'skip',
          required: false,
          type: 'number',
          description: '건너뛸 항목 수 (페이징)',
          minimum: 0,
        },
        {
          name: 'take',
          required: false,
          type: 'number',
          description: '가져올 항목 수 (페이징)',
          minimum: 1,
          maximum: 100,
        },
      ];

      commonQueryParams.forEach((param) => {
        queries.push(ApiQuery(param));
      });
    }

    // 모든 ApiQuery 데코레이터를 해당 메서드에 적용
    const combinedDecorator = applyDecorators(...queries);
    combinedDecorator(
      targetClass,
      methodName,
      Object.getOwnPropertyDescriptor(targetClass.prototype, methodName)!,
    );
  } catch (error) {
    console.warn('AutoSwaggerQuery: 메타데이터 적용 실패', error);
  }
}
