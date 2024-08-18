import { DateField, StringField, UUIDField } from 'src/shared/decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Timeline } from '../timeline.entity';
import { ClassField } from 'src/shared/decorators/field.decorators';
import { TimelineItemDto } from '../../timeline-item/dto/timeline-item.dto';

export class TimelineDto extends AbstractDto implements Timeline {
  @StringField()
  name: string;

  @UUIDField()
  sessionId: string;

  @DateField()
  date: Date;

  @ClassField(() => TimelineItemDto, { nullable: true })
  timelineItem: TimelineItemDto | null;
}
