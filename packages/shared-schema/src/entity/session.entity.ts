import { $Enums, Session as SessionEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { SessionDto } from "../dto/session.dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(SessionDto)
export class Session extends AbstractEntity<SessionDto> implements SessionEntity {
  recurringMonth: number;
  name: string;
  label: string;
  type: $Enums.SessionTypes;
  startTime: Date;
  endTime: Date;
  timelineId: string;
  repeatCycleType: $Enums.RepeatCycleTypes;
  baseDate: Date;
  startDateTime: Date;
  endDateTime: Date;
  recurringDayOfWeek: $Enums.RecurringDayOfWeek;
}
