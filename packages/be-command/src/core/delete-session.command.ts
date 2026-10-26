export class DeleteSessionCommand {
	constructor(
		readonly timelineId: bigint,
		readonly sessionId: bigint,
	) {}
}
