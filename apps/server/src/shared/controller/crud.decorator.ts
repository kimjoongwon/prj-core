import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';

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
      }
    });

    return constructor;
  };
}
