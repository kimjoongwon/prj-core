import { QueryDto } from '../../common/dtos/query.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UpdateEmailDto } from './update-email.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';

class EmailSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class EmailQueryDto extends IntersectionType(
  PartialType(UpdateEmailDto),
  EmailSortOrder,
  QueryDto,
) {}
