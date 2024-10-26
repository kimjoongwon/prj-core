import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Session } from '../session.entity';
import {
  EnumField,
  NumberField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';

export class SessionDto extends AbstractDto implements Session {
  @StringField()
  name: string;

  @UUIDField()
  timelineId: string;

  @UUIDField()
  tenantId: string;

  @EnumField(() => $Enums.SessionTypes)
  type: $Enums.SessionTypes;

  @NumberField()
  repeatCycle: number;

  @EnumField(() => $Enums.RepeatCycleTypes)
  repeatCycleType: $Enums.RepeatCycleTypes;

  @EnumField(() => $Enums.RecurringDayOfTheWeek, { each: true })
  recurringDayOfTheWeek: $Enums.RecurringDayOfTheWeek[];

  @StringField({ nullable: true })
  endDate: Date | null;

  @StringField({ nullable: true })
  startDate: Date | null;
}
