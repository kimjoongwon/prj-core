import {
	RecurringDayOfWeek,
	RepeatCycleTypes,
	Session as SessionEntity,
	SessionTypes,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Program } from "./program.entity";
import { Timeline } from "./timeline.entity";

export class Session extends AbstractEntity implements SessionEntity {
	type!: SessionTypes;
	repeatCycleType!: RepeatCycleTypes | null;
	startDateTime!: Date | null;
	endDateTime!: Date | null;
	recurringDayOfWeek!: RecurringDayOfWeek | null;
	timelineId!: string;
	name!: string;
	description!: string | null;

	programs?: Program[];
	timeline?: Timeline;
}
