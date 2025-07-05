import { $Enums, Session } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import {
  DateFieldOptional,
  EnumField,
  EnumFieldOptional,
  NumberFieldOptional,
  StringField,
  UUIDField,
  UUIDFieldOptional,
} from '../decorator/field.decorators';
import { Transform } from 'class-transformer';
import { SessionTypes } from '../enum/session-types.enum';
import { RepeatCycleTypes } from '../enum/repeat-cycle-types.enum';

export class SessionDto extends AbstractDto implements Session {
  @StringField()
  name: string;

  @StringField()
  label: string;

  @EnumField(() => $Enums.SessionTypes)
  @Transform(({ value }) => SessionTypes.findName(value))
  type: $Enums.SessionTypes;

  @DateFieldOptional()
  startDateTime: Date | null;

  @DateFieldOptional()
  endDateTime: Date | null;

  @UUIDField()
  timelineId: string;

  @EnumFieldOptional(() => $Enums.RepeatCycleTypes, { nullable: true })
  @Transform(({ value }) => RepeatCycleTypes.findName(value))
  repeatCycleType: $Enums.RepeatCycleTypes | null;

  @EnumFieldOptional(() => $Enums.RecurringDayOfWeek, { nullable: true })
  recurringDayOfWeek: $Enums.RecurringDayOfWeek | null;

  @NumberFieldOptional({ nullable: true })
  recurringMonth: number | null;
}
