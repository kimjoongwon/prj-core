export class DeleteSessionCommand {
	constructor(
		readonly timelineId: string,
		readonly sessionId: string,
	) {}
}
