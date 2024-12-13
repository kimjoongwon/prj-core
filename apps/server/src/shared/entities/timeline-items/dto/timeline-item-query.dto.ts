import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from '../../common/dtos/query.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';
import { UpdateTimelineItemDto } from './update-timeline-item.dto';

export class TimelineItemSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder?: string;
}

export class TimelineItemQueryDto extends IntersectionType(
  PartialType(UpdateTimelineItemDto),
  TimelineItemSortOrder,
  QueryDto,
) {}
