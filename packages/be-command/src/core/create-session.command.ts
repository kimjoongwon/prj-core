import type { CreateSessionCommandInput } from "@cocrepo/input";
export class CreateSessionCommand implements CreateSessionCommandInput {
	readonly name!: CreateSessionCommandInput["name"];
	readonly description!: CreateSessionCommandInput["description"];
	readonly type!: CreateSessionCommandInput["type"];
	readonly repeatCycleType!: CreateSessionCommandInput["repeatCycleType"];
	readonly startDateTime!: CreateSessionCommandInput["startDateTime"];
	readonly endDateTime!: CreateSessionCommandInput["endDateTime"];
	readonly recurringDayOfWeek!: CreateSessionCommandInput["recurringDayOfWeek"];
	readonly timelineId!: CreateSessionCommandInput["timelineId"];

	constructor(timelineId: string, input: CreateSessionCommandInput) {
		Object.assign(this, input);
		this.timelineId = timelineId;
	}
}
