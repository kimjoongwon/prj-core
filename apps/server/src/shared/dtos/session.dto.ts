import { $Enums, Session } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import {
  DateFieldOptional,
  EnumField,
  EnumFieldOptional,
  NumberFieldOptional,
  StringField,
  UUIDFieldOptional,
} from '../decorators/field.decorators';

export class SessionDto extends AbstractDto implements Session {
  @StringField()
  name: string;

  @EnumField(() => $Enums.SessionTypes)
  type: $Enums.SessionTypes;

  @DateFieldOptional()
  startDateTime: Date | null;

  @DateFieldOptional()
  endDateTime: Date | null;

  @UUIDFieldOptional({ nullable: true })
  timelineId: string | null;

  @EnumFieldOptional(() => $Enums.RepeatCycleTypes, { nullable: true })
  repeatCycleType: $Enums.RepeatCycleTypes | null;

  @EnumFieldOptional(() => $Enums.RecurringDayOfTheWeek, { nullable: true })
  recurringDayOfWeek: $Enums.RecurringDayOfTheWeek | null;

  @NumberFieldOptional({ nullable: true })
  recurringMonth: number | null;
}
