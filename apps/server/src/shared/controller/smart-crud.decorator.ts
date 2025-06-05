import { Type } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

/**
 * CRUD 컨트롤러를 위한 스마트 데코레이터
 */
export function SmartCrud(entityName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const lowerEntityName = entityName.toLowerCase();
    
    // 메서드명을 동적으로 변경
    const prototype = constructor.prototype;
    
    // create 메서드
    if (prototype.create) {
      const originalCreate = prototype.create;
      prototype[`create${entityName}`] = originalCreate;
      
      // ApiOperation 데코레이터 적용
      ApiOperation({ 
        operationId: `create${entityName}`, 
        summary: `Create ${lowerEntityName}` 
      })(prototype, `create${entityName}`, Object.getOwnPropertyDescriptor(prototype, `create${entityName}`));
    }
    
    // getById 메서드
    if (prototype.getById) {
      const originalGetById = prototype.getById;
      prototype[`get${entityName}ById`] = originalGetById;
      
      ApiOperation({ 
        operationId: `get${entityName}ById`, 
        summary: `Get ${lowerEntityName} by ID` 
      })(prototype, `get${entityName}ById`, Object.getOwnPropertyDescriptor(prototype, `get${entityName}ById`));
    }
    
    // updateById 메서드
    if (prototype.updateById) {
      const originalUpdateById = prototype.updateById;
      prototype[`update${entityName}ById`] = originalUpdateById;
      
      ApiOperation({ 
        operationId: `update${entityName}ById`, 
        summary: `Update ${lowerEntityName} by ID` 
      })(prototype, `update${entityName}ById`, Object.getOwnPropertyDescriptor(prototype, `update${entityName}ById`));
    }
    
    // removeById 메서드
    if (prototype.removeById) {
      const originalRemoveById = prototype.removeById;
      prototype[`remove${entityName}ById`] = originalRemoveById;
      
      ApiOperation({ 
        operationId: `remove${entityName}ById`, 
        summary: `Soft delete ${lowerEntityName} by ID` 
      })(prototype, `remove${entityName}ById`, Object.getOwnPropertyDescriptor(prototype, `remove${entityName}ById`));
    }
    
    // deleteById 메서드
    if (prototype.deleteById) {
      const originalDeleteById = prototype.deleteById;
      prototype[`delete${entityName}ById`] = originalDeleteById;
      
      ApiOperation({ 
        operationId: `delete${entityName}ById`, 
        summary: `Hard delete ${lowerEntityName} by ID` 
      })(prototype, `delete${entityName}ById`, Object.getOwnPropertyDescriptor(prototype, `delete${entityName}ById`));
    }
    
    // getManyByQuery 메서드
    if (prototype.getManyByQuery) {
      const originalGetManyByQuery = prototype.getManyByQuery;
      prototype[`getMany${entityName}sByQuery`] = originalGetManyByQuery;
      
      ApiOperation({ 
        operationId: `getMany${entityName}sByQuery`, 
        summary: `Get ${lowerEntityName}s by query` 
      })(prototype, `getMany${entityName}sByQuery`, Object.getOwnPropertyDescriptor(prototype, `getMany${entityName}sByQuery`));
    }
    
    return constructor;
  };
}
