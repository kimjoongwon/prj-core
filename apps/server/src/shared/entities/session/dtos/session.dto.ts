import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Session } from '../session.entity';
import {
  ClassField,
  EnumField,
  NumberField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { TimelineDto } from '../../timeline/dto';

export class SessionDto extends AbstractDto implements Session {
  @UUIDField()
  tenantId: string;

  @StringField()
  name: string;

  @UUIDField()
  tenancyId: string;

  @EnumField(() => $Enums.SessionTypes)
  type: $Enums.SessionTypes;

  @NumberField()
  repeatCycle: number;

  @EnumField(() => $Enums.RepeatCycleTypes)
  repeatCycleType: $Enums.RepeatCycleTypes;

  @EnumField(() => $Enums.RecurringDayOfTheWeek, { each: true })
  recurringDayOfTheWeek: $Enums.RecurringDayOfTheWeek[];

  @EnumField(() => $Enums.SessionEndTypes)
  endType: $Enums.SessionEndTypes;

  @StringField({ nullable: true })
  endOnDate: Date | null;

  @NumberField({ nullable: true })
  endAfterOccurrences: number | null;

  @ClassField(() => TimelineDto, { isArray: true, nullable: true, each: true })
  timelines: TimelineDto[] | null;
}
