import { DateField, StringField, UUIDField } from 'src/shared/decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Timeline } from '../timeline.entity';
import { ClassField, UUIDFieldOptional } from 'src/shared/decorators/field.decorators';
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
