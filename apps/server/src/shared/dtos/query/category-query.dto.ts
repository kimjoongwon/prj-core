import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../decorators/field.decorators';
import { $Enums, Prisma } from '@prisma/client';
import { QueryDto } from './query.dto';

export class CategoryQueryDto extends QueryDto {
  @StringFieldOptional()
  name?: string;

  @EnumFieldOptional(() => $Enums.CategoryTypes)
  type?: $Enums.CategoryTypes;

  @StringFieldOptional()
  parentId?: string;

  @StringField()
  tenancyId: string;

  @StringFieldOptional()
  serviceId?: string;

  @EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
  nameSortOrder?: Prisma.SortOrder;
}
