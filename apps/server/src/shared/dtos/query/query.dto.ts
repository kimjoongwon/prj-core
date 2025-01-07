import { PaginationUtil } from '@shared/utils';
import { NumberFieldOptional } from '../../decorators';
import { PageMetaDto } from './page-meta.dto';

export class QueryDto {
  @NumberFieldOptional({
    minimum: 1,
    default: undefined,
    int: true,
  })
  readonly skip?: number = undefined;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: undefined,
    int: true,
  })
  readonly take?: number = undefined;

  toArgs<T>(include?: any) {
    const args = PaginationUtil.toArgs(this);
    return {
      ...args,
      include,
    } as T;
  }

  toCountArgs<T>(includeRemovedItems = false) {
    const args = PaginationUtil.toArgs(this);
    delete args.include;
    delete args.skip;
    delete args.take;
    delete args.orderBy;
    if (!includeRemovedItems) {
      args.where = {
        ...args.where,
        removedAt: null,
      };
    }
    return args as T;
  }

  toPageMetaDto(totalCount: number) {
    return new PageMetaDto(this.skip, this.take, totalCount);
  }
}
