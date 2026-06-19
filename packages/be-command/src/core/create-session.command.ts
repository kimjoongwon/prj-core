import type { CreateSessionCommandInput } from "./create-session.input";
export class CreateSessionCommand {
	constructor(
		readonly timelineId: string,
		readonly input: CreateSessionCommandInput,
	) {}
}
