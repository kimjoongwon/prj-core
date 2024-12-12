import { PaginationUtil } from '@shared/utils';
import { NumberField, BooleanField } from '../../../decorators';
export class PageMetaDto {
  @NumberField()
  readonly skip: number;

  @NumberField()
  readonly take: number;

  @NumberField()
  readonly totalCount: number;

  @NumberField()
  readonly pageCount: number;

  @BooleanField()
  readonly hasPreviousPage: boolean;

  @BooleanField()
  readonly hasNextPage: boolean;

  constructor(skip?: number, take?: number, totalCount: number = 0) {
    const page = PaginationUtil.getPage({ skip, take });
    this.skip = skip;
    this.take = take;
    this.totalCount = totalCount;
    this.pageCount = Math.ceil(totalCount / this.take);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.pageCount;
  }
}
