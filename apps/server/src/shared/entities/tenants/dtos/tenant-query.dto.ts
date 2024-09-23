import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { Tenant } from '../tenant.entity';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';

class TenantOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder?: Prisma.SortOrder;
}

export class TenantPageQueryDto extends IntersectionType(
  PartialType(Tenant),
  TenantOrderBy,
  PageQueryDto,
) {}
