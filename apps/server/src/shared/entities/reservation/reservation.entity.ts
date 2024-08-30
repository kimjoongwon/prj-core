import { $Enums, Reservation as ReservationEntity } from '@prisma/client';
import { AbstractEntity } from '../common';

export class Reservation extends AbstractEntity implements ReservationEntity {
  tenantId: string;
  status: $Enums.ReservationStatus;
  userId: string;
  timelineItemId: string;
}
