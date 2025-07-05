import { Prisma } from '@prisma/client';
import { UUIDFieldOptional, EnumFieldOptional } from '../../decorator/field.decorators';
import { QueryDto } from './query.dto';

export class QuerySpaceAssociationDto extends QueryDto {
  @UUIDFieldOptional()
  spaceId: string;

  @UUIDFieldOptional()
  groupId: string;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}
