import { Prisma } from '@prisma/client';
import { UUIDFieldOptional, EnumFieldOptional } from '../../decorator/field.decorators';
import { QueryDto } from './query.dto';

export class AssociationQueryDto extends QueryDto {
  @UUIDFieldOptional()
  groupId: string;

  @UUIDFieldOptional()
  serviceId: string;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}
