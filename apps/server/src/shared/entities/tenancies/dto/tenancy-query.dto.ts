import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { Tenancy } from '../tenancy.entity';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';

class TenancyOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  typeSortOrder?: Prisma.SortOrder;
}

export class TenancyQueryDto extends IntersectionType(
  PartialType(Tenancy),
  TenancyOrderBy,
  PageQueryDto,
) {}
