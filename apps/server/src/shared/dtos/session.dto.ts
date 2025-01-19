import { $Enums, Session } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import {
  DateField,
  EnumField,
  NumberField,
  StringField,
  UUIDField,
} from '../decorators/field.decorators';

export class SessionDto extends AbstractDto implements Session {
  @DateField()
  baseDate: Date;

  @DateField()
  startDateTime: Date;

  @DateField()
  endDateTime: Date;

  @StringField()
  name: string;

  @EnumField(() => $Enums.SessionTypes)
  type: $Enums.SessionTypes;

  @DateField()
  startTime: Date;

  @DateField()
  endTime: Date;

  @UUIDField()
  timelineId: string;

  @EnumField(() => $Enums.RecurringDayOfTheWeek)
  recurringDayOfTheWeek: $Enums.RecurringDayOfTheWeek[];

  @NumberField()
  repeatCycle: number;

  @EnumField(() => $Enums.RepeatCycleTypes)
  repeatCycleType: $Enums.RepeatCycleTypes;
}
