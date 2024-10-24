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
import { TimelineItem } from '../timeline-item.entity';

export class TimelineItemDto extends AbstractDto implements TimelineItem {
  @UUIDField()
  sessionId: string;

  @StringField()
  title: string;

  @DateField()
  startDateTime: Date;

  @DateField()
  endDateTime: Date;

  @StringField()
  address: string;

  @NumberField()
  maxCapacity: number;

  @NumberField()
  minCapacity: number;

  @UUIDField()
  tenantId: string;

  @ClassField(() => ReservationDto, { isArray: true, nullable: true })
  reservations: ReservationDto[] | null;
}
