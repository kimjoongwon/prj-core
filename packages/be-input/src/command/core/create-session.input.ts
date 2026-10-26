export interface CreateSessionCommandInput {
	name: string;
	description?: string | null;
	type: string;
	repeatCycleType?: string | null;
	startDateTime?: Date | null;
	endDateTime?: Date | null;
	recurringDayOfWeek?: string | null;
	timelineId: bigint;
}
