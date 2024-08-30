import { EnumField, StringField, UUIDField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Reservation } from '../reservation.entity';
import { $Enums } from '@prisma/client';

export class ReservationDto extends AbstractDto implements Reservation {
  @EnumField(() => $Enums.ReservationStatus)
  status: $Enums.ReservationStatus;

  @UUIDField()
  userId: string;

  @UUIDField()
  timelineItemId: string;

  @UUIDField()
  tenantId: string;
}
