import type { UpdateSessionCommandInput } from "@cocrepo/input";
export class UpdateSessionCommand implements UpdateSessionCommandInput {
	readonly type?: UpdateSessionCommandInput["type"];
	readonly repeatCycleType?: UpdateSessionCommandInput["repeatCycleType"];
	readonly startDateTime?: UpdateSessionCommandInput["startDateTime"];
	readonly endDateTime?: UpdateSessionCommandInput["endDateTime"];
	readonly recurringDayOfWeek?: UpdateSessionCommandInput["recurringDayOfWeek"];
	readonly name?: UpdateSessionCommandInput["name"];
	readonly description?: UpdateSessionCommandInput["description"];

	constructor(
		readonly timelineId: string,
		readonly sessionId: string,
		input: UpdateSessionCommandInput,
	) {
		Object.assign(this, input);
	}
}
