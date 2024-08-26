import { NumberField, BooleanField } from '../../../decorators';
import { PaginationMananger } from '../../../utils';
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

  constructor({ pageQueryDto, itemCount }: IPageMetaDtoParameters) {
    const { skip, take } = pageQueryDto;
    const page = PaginationMananger.getPage({ skip, take });
    this.skip = skip;
    this.take = take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.pageCount;
  }
}
