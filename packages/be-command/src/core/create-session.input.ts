export interface CreateSessionCommandInput {
	name: string;
	description: string;
	type: string;
	repeatCycleType: string;
	startDateTime: Date;
	endDateTime: Date;
	recurringDayOfWeek: string;
	timelineId: string;
}
