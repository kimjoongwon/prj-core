import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { UpdateAbilityDto } from './update-ability.dto';

export class AbilityPageQueryDto extends UpdateAbilityDto {
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
