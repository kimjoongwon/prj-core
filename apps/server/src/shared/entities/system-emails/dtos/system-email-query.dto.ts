import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UpdateSystemEmailDto } from './update-system-email.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';

class SystemEmailSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class SystemEmailQueryDto extends IntersectionType(
  PartialType(UpdateSystemEmailDto),
  SystemEmailSortOrder,
  PageQueryDto,
) {}
