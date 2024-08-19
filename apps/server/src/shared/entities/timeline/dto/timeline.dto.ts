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
  sessionId: string;

  @DateField()
  date: Date;

  @UUIDFieldOptional()
  timelineItemId: string | null;

  @ClassField(() => TimelineItemDto, { nullable: true })
  timelineItem: TimelineItemDto | null;
}
