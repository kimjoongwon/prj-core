import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from 'src/shared/decorators';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { AbilityDto } from './ability.dto';
import { PageOptionsDto } from '../../common';
import { toPrismaArgs } from '../../common/dtos/page-option.dto';

class AbilityOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  typeSortOrder?: Prisma.SortOrder;
  @EnumFieldOptional(() => Prisma.SortOrder)
  roleIdSortOrder?: Prisma.SortOrder;
  @EnumFieldOptional(() => Prisma.SortOrder)
  actionSortOrder?: Prisma.SortOrder;
  @EnumFieldOptional(() => Prisma.SortOrder)
  subjectIdSortOrder?: Prisma.SortOrder;
  @EnumFieldOptional(() => Prisma.SortOrder)
  conditionsSortOrder?: Prisma.SortOrder;
  @EnumFieldOptional(() => Prisma.SortOrder)
  descriptionSortOrder?: Prisma.SortOrder;
}

class AbilityQuery extends IntersectionType(
  PartialType(AbilityDto),
  AbilityOrderBy,
  PageOptionsDto,
) {}

export class AbilityPageQuery extends AbilityQuery {
  toArgs(): Prisma.AbilityFindManyArgs {
    return toPrismaArgs(this);
  }
}
