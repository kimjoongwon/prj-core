export interface UpdateSessionCommandInput {
	type?: string;
	repeatCycleType?: string | null;
	startDateTime?: Date | null;
	endDateTime?: Date | null;
	recurringDayOfWeek?: string | null;
	name?: string;
	description?: string | null;
}
