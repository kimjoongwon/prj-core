import { PaginationUtil } from '@shared/utils';
import { NumberFieldOptional } from '../../../decorators';
import { PageMetaDto } from './page-meta.dto';

export class PageQueryDto {
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

  toArgs<T>() {
    return PaginationUtil.toArgs(this) as T;
  }

  toTotalCountArgs<T>(includeRemovedItems = false) {
    const args = PaginationUtil.toArgs(this).include;
    delete args.where;
    delete args.include;
    delete args.skip;
    delete args.take;
    delete args.orderBy;
    if (!includeRemovedItems) {
      args.where.removedAt = null;
    }
    return args as T;
  }

  toPageMetaDto(itemCount: number) {
    return new PageMetaDto(this.skip, this.take, itemCount);
  }
}
