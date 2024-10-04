import {
  ClassField,
  DateField,
  NumberField,
  StringField,
  UUIDField,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ReservationDto } from '../../reservations/dto/reservation.dto';
import { TimelineDto } from '../../timelines/dto';
import { TimelineItem } from '../timeline-item.entity';

export class TimelineItemDto extends AbstractDto implements TimelineItem {
  @UUIDFieldOptional()
  timelineId: string | null;

  @StringField()
  title: string;

  @DateField()
  startDateTime: Date;

  @DateField()
  endDateTime: Date;

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

  @ClassField(() => TimelineDto, { nullable: true, swagger: false })
  timeline: TimelineDto | null;

  @ClassField(() => ReservationDto, { isArray: true, nullable: true })
  reservations: ReservationDto[] | null;
}
