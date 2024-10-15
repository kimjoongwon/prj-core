import { NumberFieldOptional } from '../../../decorators';
import { PaginationMananger } from '../../../utils';
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
    const args = PaginationMananger.toArgs(this);
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
