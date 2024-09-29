import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { TemplateDto } from './template.dto';

class TemplateSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class TemplateQueryDto extends IntersectionType(
  PartialType(TemplateDto),
  TemplateSortOrder,
  PageQueryDto,
) {}
