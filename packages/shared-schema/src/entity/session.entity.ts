import { $Enums, Session as SessionEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { SessionDto } from "../dto/session.dto";
import { AbstractEntity } from "./abstract.entity";
import { Program } from "./program.entity";
import { Timeline } from "./timeline.entity";

@UseDto(SessionDto)
export class Session
	extends AbstractEntity<SessionDto>
	implements SessionEntity
{
	type: $Enums.SessionTypes;
	repeatCycleType: $Enums.RepeatCycleTypes | null;
	startDateTime: Date | null;
	endDateTime: Date | null;
	recurringDayOfWeek: $Enums.RecurringDayOfWeek | null;
	timelineId: string;
	name: string;
	description: string | null;

	programs?: Program[];
	timeline?: Timeline;
}
