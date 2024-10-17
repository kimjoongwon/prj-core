import { UUIDField, ClassField, DateField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Timeline } from '../timeline.entity';
import { TimelineItemDto } from '../../timeline-items/dto/timeline-item.dto';
export class TimelineDto extends AbstractDto implements Timeline {
  @DateField()
  date: Date;

  @UUIDField()
  tenantId: string;

  @UUIDField()
  sessionId: string;

  @ClassField(() => TimelineItemDto, { nullable: true, each: true })
  timelineItems: TimelineItemDto[] | null;
}
