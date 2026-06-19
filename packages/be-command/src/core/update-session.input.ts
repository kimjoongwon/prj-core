export interface UpdateSessionCommandInput {
	type?: string;
	repeatCycleType?: string;
	startDateTime?: Date;
	endDateTime?: Date;
	recurringDayOfWeek?: string;
	timelineId?: string;
	name?: string;
	description?: string;
	programs?: any[];
	timeline?: any;
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	removedAt?: Date;
}
