import { Type } from '@nestjs/common';
import { ApiQueryDto } from './api-query-dto.decorator';

/**
 * AutoBaseController를 상속받는 클래스에 자동으로 Query DTO 메타데이터를 적용하는 클래스 데코레이터
 *
 * @param queryDtoClass Query DTO 클래스
 */
export function AutoQueryMetadata<T>(queryDtoClass: Type<T>) {
  return function <TFunction extends Function>(target: TFunction): TFunction {
    // getManyByQuery 메서드에 ApiQueryDto 데코레이터 적용
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, 'getManyByQuery');
    if (descriptor) {
      const apiQueryDecorator = ApiQueryDto(queryDtoClass);
      apiQueryDecorator(target.prototype, 'getManyByQuery', descriptor);
    }

    return target;
  };
}
