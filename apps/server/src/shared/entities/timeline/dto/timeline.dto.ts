import {
  DateField,
  UUIDField,
  ClassField,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Timeline } from '../timeline.entity';
import { TimelineItemDto } from '../../timeline-item/dto/timeline-item.dto';
export class TimelineDto extends AbstractDto implements Timeline {
  @UUIDField()
  tenantId: string;

  @UUIDField()
  sessionId: string;

  @DateField()
  date: Date;

  @UUIDFieldOptional()
  timelineItemId: string | null;

  @ClassField(() => TimelineItemDto, { nullable: true, each: true, isArray: true })
  timelineItem: TimelineItemDto[] | null;
}
