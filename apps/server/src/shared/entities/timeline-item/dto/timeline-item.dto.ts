import { ClassField } from 'src/shared/decorators/field.decorators';
import { DateField, NumberField, StringField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TimelineItem } from '../timeline-item.entity';
import { TimelineDto } from '../../timeline/dto';

export class TimelineItemDto extends AbstractDto implements TimelineItem {
  @StringField()
  title: string;

  @DateField()
  startDateTime: Date;

  @DateField()
  endDateTime: Date;

  @StringField()
  timelineId: string;

  @StringField()
  description: string;

  @StringField()
  address: string;

  @NumberField()
  maxCapacity: number;

  @NumberField()
  minCapacity: number;

  @ClassField(() => TimelineDto, { nullable: true })
  timeline: TimelineDto | null;
}
