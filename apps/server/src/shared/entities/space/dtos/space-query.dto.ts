import { EnumFieldOptional } from 'src/shared/decorators';
import { Prisma } from '@prisma/client';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common';
import { UpdateSpaceDto } from './update-space.dto';

class SpaceSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder?: Prisma.SortOrder;
}

export class SpaceQueryDto extends IntersectionType(
  PartialType(UpdateSpaceDto),
  SpaceSortOrder,
  PageQueryDto,
) {}
