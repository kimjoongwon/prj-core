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

  toArgs(tenantId?: string) {
    const args = PaginationUtil.toArgs(this);
    args.where = {
      ...args.where,
      tenantId,
    };
    return args;
  }

  toPageMetaDto(itemCount: number) {
    return new PageMetaDto(this.skip, this.take, itemCount);
  }
}
