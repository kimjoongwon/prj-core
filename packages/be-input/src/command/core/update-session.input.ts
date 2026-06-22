export interface UpdateSessionCommandInput {
	type?: string;
	repeatCycleType?: string;
	startDateTime?: Date | null;
	endDateTime?: Date | null;
	recurringDayOfWeek?: string | null;
	name?: string;
	description?: string | null;
}
