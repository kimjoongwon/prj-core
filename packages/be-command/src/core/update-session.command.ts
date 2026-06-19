import type { UpdateSessionCommandInput } from "./update-session.input";
export class UpdateSessionCommand {
	constructor(
		readonly timelineId: string,
		readonly sessionId: string,
		readonly input: UpdateSessionCommandInput,
	) {}
}
