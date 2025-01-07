import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../decorators/field.decorators';
import { QueryDto } from './query.dto';

export class ServiceQueryDto extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
  nameSortOrder?: Prisma.SortOrder;
}
