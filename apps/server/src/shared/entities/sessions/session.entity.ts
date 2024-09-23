import { AbstractEntity } from '../common';
import { $Enums, Session as SessionEntity } from '@prisma/client';
export class Session extends AbstractEntity implements SessionEntity {
  name: string;
  tenantId: string;
  baseDate: Date;
  endDate: Date;
  recurringDayOfTheWeek: $Enums.RecurringDayOfTheWeek[];
  repeatCycle: number;
  repeatCycleType: $Enums.RepeatCycleTypes;
  type: $Enums.SessionTypes;
}
