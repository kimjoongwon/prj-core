import { EnumFieldOptional } from 'src/shared/decorators';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UpdateSessionDto } from './update-session.dto';
import { Prisma } from '@prisma/client';

class SessionSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
  @EnumFieldOptional(() => Prisma.SortOrder)
  name: Prisma.SortOrder;
}

export class SessionQueryDto extends IntersectionType(
  PartialType(UpdateSessionDto),
  SessionSortOrder,
  PageQueryDto,
) {}
