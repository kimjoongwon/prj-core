import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { Assignment } from '../assignment.entity';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';

class AssignmentOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  typeSortOrder?: Prisma.SortOrder;
}

export class AssignmentPageQueryDto extends IntersectionType(
  PartialType(Assignment),
  AssignmentOrderBy,
  PageQueryDto,
) {}
