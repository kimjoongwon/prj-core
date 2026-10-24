import type { CreateSessionCommandInput } from "@cocrepo/input";
export class CreateSessionCommand implements CreateSessionCommandInput {
	readonly name!: CreateSessionCommandInput["name"];
	readonly description?: CreateSessionCommandInput["description"];
	readonly type!: CreateSessionCommandInput["type"];
	readonly repeatCycleType?: CreateSessionCommandInput["repeatCycleType"];
	readonly startDateTime?: CreateSessionCommandInput["startDateTime"];
	readonly endDateTime?: CreateSessionCommandInput["endDateTime"];
	readonly recurringDayOfWeek?: CreateSessionCommandInput["recurringDayOfWeek"];
	readonly timelineSeq!: CreateSessionCommandInput["timelineSeq"];

	constructor(timelineSeq: bigint, input: CreateSessionCommandInput) {
		Object.assign(this, input);
		this.timelineSeq = timelineSeq;
	}
}
