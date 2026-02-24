export interface CreateSessionInput {
	name: string;
	type: string;
	description?: string | null;
	startDateTime?: Date | null;
	endDateTime?: Date | null;
	recurringDayOfWeek?: string | null;
	repeatCycleType?: string | null;
}
