import { NumberFieldOptional } from '../../../decorators';
import { PaginationMananger } from '../../../utils';

export class PageQueryDto {
  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly skip?: number = 0;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take?: number = 10;

  toArgs(tenantId?: string) {
    const args = PaginationMananger.toArgs(this);
    args.where = {
      ...args.where,
      tenantId,
    };
    return args;
  }
}
