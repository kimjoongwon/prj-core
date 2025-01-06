import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from '../../common/dtos/query.dto';
import { Association } from '../association.entity';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';

class AssociationOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  typeSortOrder?: Prisma.SortOrder;
}

export class AssociationPageQueryDto extends IntersectionType(
  PartialType(Association),
  AssociationOrderBy,
  QueryDto,
) {}
