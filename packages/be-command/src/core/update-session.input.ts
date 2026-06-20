import type { ProgramDto, TimelineDto } from "@cocrepo/dto";

export interface UpdateSessionCommandInput {
	type?: string;
	repeatCycleType?: string;
	startDateTime?: Date;
	endDateTime?: Date;
	recurringDayOfWeek?: string;
	timelineId?: string;
	name?: string;
	description?: string;
	programs?: ProgramDto[];
	timeline?: TimelineDto;
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	removedAt?: Date;
}
