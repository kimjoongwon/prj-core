import {
  ClassField,
  DateField,
  NumberField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ReservationDto } from '../../reservation/dto';
import { TimelineDto } from '../../timeline/dto';
import { TimelineItem } from '../timeline-item.entity';

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

  @UUIDField()
  tenantId: string;

  @ClassField(() => TimelineDto, { nullable: true, each: true, swagger: false })
  timeline: TimelineDto | null;

  @ClassField(() => ReservationDto, { each: true, isArray: true, nullable: true })
  reservations: ReservationDto[] | null;
}
