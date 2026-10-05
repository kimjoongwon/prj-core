import { Session } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { ProgramDto } from "./program.dto";
import { TimelineDto } from "./timeline.dto";

export class SessionDto extends EntityResponseType(Session, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"type",
		"repeatCycleType",
		"startDateTime",
		"endDateTime",
		"recurringDayOfWeek",
		"timelineId",
		"name",
		"description",
		"programs",
		"timeline",
	] as const,
	relations: {
		programs: () => ProgramDto,
		timeline: () => TimelineDto,
	},
}) {
	declare programs?: ProgramDto[];
	declare timeline?: TimelineDto;
}
