import { QueryDto } from '../../common/dtos/query.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';

class TemplateSortOrder extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class TemplateQueryDto extends TemplateSortOrder {}
