import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UpdateTemplateDto } from './update-template.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';

class TemplateSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class TemplateQueryDto extends IntersectionType(
  PartialType(UpdateTemplateDto),
  TemplateSortOrder,
  PageQueryDto,
) {}
