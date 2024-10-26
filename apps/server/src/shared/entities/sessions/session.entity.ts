import { AbstractEntity } from '../common';
import { $Enums, Session as SessionEntity } from '@prisma/client';
export class Session extends AbstractEntity implements SessionEntity {
  startDate: Date;
  endDate: Date;
  timelineId: string;
  recurringDayOfTheWeek: $Enums.RecurringDayOfTheWeek[];
  repeatCycle: number;
  repeatCycleType: $Enums.RepeatCycleTypes;
  type: $Enums.SessionTypes;
}
