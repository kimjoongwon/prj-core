import type {
	RecurringDayOfWeek,
	RepeatCycleTypes,
	SessionTypes,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Program } from "./program.entity";
import type { Timeline } from "./timeline.entity";

export class Session extends AbstractEntity {
	/** 공개 식별자 ULID */
	sessionId!: string;

	type!: SessionTypes;
	repeatCycleType!: RepeatCycleTypes | null;
	startDateTime!: Date | null;
	endDateTime!: Date | null;
	recurringDayOfWeek!: RecurringDayOfWeek | null;
	timelineId!: bigint;
	name!: string;
	description!: string | null;

	programs?: Program[];
	timeline?: Timeline;
}
