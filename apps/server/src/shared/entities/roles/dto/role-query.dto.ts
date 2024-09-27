import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';
import { RoleDto } from './role.dto';
import { PaginationMananger } from '../../../utils';

class RoleOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder?: Prisma.SortOrder;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder?: Prisma.SortOrder;
}

export class RoleQueryDto extends IntersectionType(
  PartialType(RoleDto),
  RoleOrderBy,
  PageQueryDto,
) {
  toArgs() {
    const args = PaginationMananger.toArgs(this);
    return args;
  }
}
