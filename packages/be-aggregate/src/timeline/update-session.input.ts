export interface UpdateSessionInput {
	name?: string;
	description?: string | null;
	type?: string;
	startDateTime?: Date | null;
	endDateTime?: Date | null;
	recurringDayOfWeek?: string | null;
	repeatCycleType?: string | null;
}
