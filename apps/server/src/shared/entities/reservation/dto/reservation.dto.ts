import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Reservation } from '../reservation.entity';
import { EnumField, StringField } from 'src/shared/decorators';
import { $Enums } from '@prisma/client';

export class ReservationDto extends AbstractDto implements Reservation {
  @EnumField(() => $Enums.ReservationStatus)
  status: $Enums.ReservationStatus;

  @StringField()
  userId: string;

  @StringField()
  timelineItemId: string;
}
