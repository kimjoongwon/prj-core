import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dtos/page-option.dto';
import { Session } from '../session.entity';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';

class SessionOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  typeSortOrder?: Prisma.SortOrder;
}

export class SessionPageQueryDto extends IntersectionType(
  PartialType(Session),
  SessionOrderBy,
  PageOptionsDto,
) {}
