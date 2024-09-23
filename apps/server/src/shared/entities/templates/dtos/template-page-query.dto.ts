import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { Template } from '../template.entity';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';

class TemplateOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  typeSortOrder?: Prisma.SortOrder;
}

export class TemplatePageQueryDto extends IntersectionType(
  PartialType(Template),
  TemplateOrderBy,
  PageQueryDto,
) {}
