import { Timeline } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { SessionDto } from "./session.dto";

export class TimelineDto extends EntityResponseType(Timeline, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceSeq",
		"createdBySeq",
		"name",
		"description",
		"sessions",
	] as const,
	relations: {
		sessions: () => SessionDto,
	},
}) {
	declare sessions?: SessionDto[];
}
