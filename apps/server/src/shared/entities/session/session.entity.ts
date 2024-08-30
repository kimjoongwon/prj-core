import { AbstractEntity } from '../common';
import { $Enums, Session as SessionEntity } from '@prisma/client';
export class Session extends AbstractEntity implements SessionEntity {
  tenantId: string;
  name: string;
  tenancyId: string;
  type: $Enums.SessionTypes;
  repeatCycle: number;
  repeatCycleType: $Enums.RepeatCycleTypes;
  recurringDayOfTheWeek: $Enums.RecurringDayOfTheWeek[];
  endType: $Enums.SessionEndTypes;
  endOnDate: Date;
  endAfterOccurrences: number;
}
