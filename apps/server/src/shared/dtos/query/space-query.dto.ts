import { Prisma } from '@prisma/client';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from '../../common';
import { UpdateSpaceDto } from './update-space.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';

class SpaceSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder?: Prisma.SortOrder;
}

export class SpaceQueryDto extends IntersectionType(
  PartialType(UpdateSpaceDto),
  SpaceSortOrder,
  QueryDto,
) {}
