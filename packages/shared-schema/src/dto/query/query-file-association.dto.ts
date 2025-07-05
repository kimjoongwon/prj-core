import { Prisma } from '@prisma/client';
import { UUIDFieldOptional, EnumFieldOptional } from '../../decorator/field.decorators';
import { QueryDto } from './query.dto';

export class QueryFileAssociationDto extends QueryDto {
  @UUIDFieldOptional()
  userId: string;

  @UUIDFieldOptional()
  fileId: string;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}
