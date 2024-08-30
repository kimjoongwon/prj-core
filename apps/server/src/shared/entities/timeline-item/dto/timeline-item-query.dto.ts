import { IntersectionType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';
import { UpdateTimelineItemDto } from './update-timeline-item.dto';

export class TimelineItemSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder: string;
}

export class TimelineItemQueryDto extends IntersectionType(
  PageQueryDto,
  TimelineItemSortOrder,
  UpdateTimelineItemDto,
) {}
