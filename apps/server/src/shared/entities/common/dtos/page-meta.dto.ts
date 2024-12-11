import { PaginationUtil } from '@shared/utils';
import { NumberField, BooleanField } from '../../../decorators';
import { PageQueryDto } from './page-query.dto';

interface IPageMetaDtoParameters {
  pageQueryDto: PageQueryDto;
  itemCount: number;
}

export class PageMetaDto {
  @NumberField()
  readonly skip: number;

  @NumberField()
  readonly take: number;

  @NumberField()
  readonly itemCount: number;

  @NumberField()
  readonly pageCount: number;

  @BooleanField()
  readonly hasPreviousPage: boolean;

  @BooleanField()
  readonly hasNextPage: boolean;

  constructor(skip?: number, take?: number, itemCount: number = 0) {
    const page = PaginationUtil.getPage({ skip, take });
    this.skip = skip;
    this.take = take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.pageCount;
  }
}
