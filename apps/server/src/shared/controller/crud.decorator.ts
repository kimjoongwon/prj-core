import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

export const CRUD_ENTITY_KEY = 'crud_entity';
export const CRUD_CONFIG_KEY = 'crud_config';

export interface CrudConfig {
  entityName: string;
  tag?: string;
  enabledEndpoints?: {
    create?: boolean;
    getById?: boolean;
    updateById?: boolean;
    removeById?: boolean;
    deleteById?: boolean;
    getManyByQuery?: boolean;
  };
}

/**
 * Query DTO 클래스의 메타데이터를 기반으로 ApiQuery 데코레이터를 자동 적용
 */
function applyAutoApiQuery(prototype: any, methodName: string, queryDtoClass: any) {
  if (!queryDtoClass) return;

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

        ApiQuery(queryOptions)(
          prototype,
          methodName,
          Object.getOwnPropertyDescriptor(prototype, methodName) || {
            value: prototype[methodName],
            writable: true,
            enumerable: false,
            configurable: true,
          },
        );
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

          ApiQuery(queryOptions)(
            prototype,
            methodName,
            Object.getOwnPropertyDescriptor(prototype, methodName) || {
              value: prototype[methodName],
              writable: true,
              enumerable: false,
              configurable: true,
            },
          );
        }
      });

      parentClass = Object.getPrototypeOf(parentClass);
    }
  } catch (error) {
    console.warn(`CrudController: Query DTO 메타데이터 적용 실패 (${methodName})`, error);
  }
}

/**
 * CRUD 컨트롤러 자동 설정 데코레이터
 * @param config CRUD 설정
 */
export function CrudController(config: CrudConfig) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const entityName = config.entityName;
    const lowerEntityName = entityName.toLowerCase();

    // 메타데이터 설정
    SetMetadata(CRUD_CONFIG_KEY, config)(constructor);

    // 클래스 레벨에서 ApiTags 적용
    if (config.tag) {
      ApiTags(config.tag)(constructor);
    }

    // 프로토타입에서 메서드를 찾아서 ApiOperation 데코레이터 적용
    const prototype = constructor.prototype;

    // 메서드별 ApiOperation 설정
    const methodConfigs = [
      { name: 'create', operationId: `create${entityName}`, summary: `Create ${lowerEntityName}` },
      {
        name: 'getById',
        operationId: `get${entityName}ById`,
        summary: `Get ${lowerEntityName} by ID`,
      },
      {
        name: 'updateById',
        operationId: `update${entityName}ById`,
        summary: `Update ${lowerEntityName} by ID`,
      },
      {
        name: 'removeById',
        operationId: `remove${entityName}ById`,
        summary: `Soft delete ${lowerEntityName} by ID`,
      },
      {
        name: 'deleteById',
        operationId: `delete${entityName}ById`,
        summary: `Hard delete ${lowerEntityName} by ID`,
      },
      {
        name: 'getManyByQuery',
        operationId: `get${entityName}sByQuery`,
        summary: `Get ${lowerEntityName}s by query`,
      },
    ];

    methodConfigs.forEach(({ name, operationId, summary }) => {
      // 메서드가 존재하고 함수인지 확인
      if (typeof prototype[name] === 'function') {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, name) || {
          value: prototype[name],
          writable: true,
          enumerable: false,
          configurable: true,
        };

        ApiOperation({
          operationId,
          summary,
        })(prototype, name, descriptor);

        // getManyByQuery 메서드의 경우 자동으로 Query DTO 스웨거 적용
        if (name === 'getManyByQuery') {
          // 런타임에 queryDtoClass를 찾아서 적용
          setTimeout(() => {
            try {
              const instance = new constructor();
              const queryDtoClass = (instance as any).queryDtoClass;
              if (queryDtoClass) {
                applyAutoApiQuery(prototype, name, queryDtoClass);
              }
            } catch (error) {
              console.warn(`CrudController: queryDtoClass 자동 적용 실패 (${entityName})`, error);
            }
          }, 0);
        }
      }
    });

    return constructor;
  };
}
