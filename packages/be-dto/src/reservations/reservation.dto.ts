import { Reservation } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";
import { ProgramDto } from "../program.dto";
import { SessionDto } from "../session.dto";
import { TimelineDto } from "../timeline.dto";
import { UserDto } from "../user.dto";

export class ReservationDto extends EntityResponseType(Reservation, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"createdById",
		"userId",
		"timelineId",
		"sessionId",
		"programId",
		"occurrenceStartAt",
		"status",
		"memo",
		"idempotencyKey",
		"waitlistPosition",
		"confirmedAt",
		"canceledAt",
		"cancelReason",
		"user",
		"timeline",
		"session",
		"program",
	],
	relations: {
		user: () => UserDto,
		timeline: () => TimelineDto,
		session: () => SessionDto,
		program: () => ProgramDto,
	},
}) {
	declare user?: UserDto;
	declare timeline?: TimelineDto;
	declare session?: SessionDto;
	declare program?: ProgramDto;
}
