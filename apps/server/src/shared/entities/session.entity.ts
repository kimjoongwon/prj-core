import { UseDto } from '../decorators/use-dto.decorator';
import { SessionDto } from '../dtos/session.dto';
import { AbstractEntity } from './abstract.entity';
import { $Enums, Session as SessionEntity } from '@prisma/client';

@UseDto(SessionDto)
export class Session extends AbstractEntity<SessionDto> implements SessionEntity {
  recurringDayOfWeek: $Enums.RecurringDayOfTheWeek;
  recurringMonth: number;
  name: string;
  type: $Enums.SessionTypes;
  startTime: Date;
  endTime: Date;
  timelineId: string;
  repeatCycleType: $Enums.RepeatCycleTypes;
  baseDate: Date;
  startDateTime: Date;
  endDateTime: Date;
  recurringDayOfTheWeek: $Enums.RecurringDayOfTheWeek;
}
