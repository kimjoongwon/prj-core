import { Type } from '@nestjs/common';
import { ApiQueryDto } from './api-query-dto.decorator';

/**
 * Query DTO 클래스를 기반으로 getManyByQuery 메서드에 자동으로 ApiQuery 데코레이터를 적용하는 함수
 *
 * @param queryDtoClass Query DTO 클래스
 * @returns 데코레이터 함수
 */
export function ApplyQueryDtoDecorators<T>(queryDtoClass: Type<T>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // ApiQueryDto 데코레이터를 적용
    const apiQueryDecorator = ApiQueryDto(queryDtoClass);
    apiQueryDecorator(target, propertyKey, descriptor);

    return descriptor;
  };
}

/**
 * AutoBaseController를 상속받는 클래스에서 사용할 수 있는 헬퍼 함수
 * queryDtoClass를 기반으로 getManyByQuery 메서드를 자동으로 설정합니다.
 */
export function setupAutoQueryDecorators<T>(targetClass: any, queryDtoClass: Type<T>) {
  const descriptor = Object.getOwnPropertyDescriptor(targetClass.prototype, 'getManyByQuery');
  if (descriptor) {
    ApplyQueryDtoDecorators(queryDtoClass)(targetClass.prototype, 'getManyByQuery', descriptor);
  }
}
