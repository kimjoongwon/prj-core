import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';

class AssignmentSortOrder extends PageQueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class AssignmentQueryDto extends AssignmentSortOrder {}
