import { NumberFieldOptional } from '../../decorator';
import { PaginationUtil } from '../../lib/PaginationUtil';
import { PageMetaDto } from './page-meta.dto';
import { defaultsDeep, merge } from 'lodash';

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

  toArgs<T>(rawArgs?: T) {
    const args = PaginationUtil.toArgs(this);
    const newArgs = defaultsDeep(args, {
      orderBy: {
        createdAt: 'desc',
      },
    });

    // rawArgs가 있으면 newArgs를 rawArgs로 덮어쓰기 (모든 nested depth에서 동작)
    if (rawArgs) {
      return merge({}, newArgs, rawArgs) as T;
    }

    return {
      ...newArgs,
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
