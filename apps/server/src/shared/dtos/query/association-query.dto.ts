import { QueryDto } from '../../common/dtos/query.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional, UUIDFieldOptional } from '../../../decorators/field.decorators';

export class AssociationQueryDto extends QueryDto {
  @UUIDFieldOptional()
  groupId: string;

  @UUIDFieldOptional()
  serviceId: string;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}
