export class GetSessionByIdQuery {
	constructor(
		readonly timelineId: bigint,
		readonly sessionId: bigint,
	) {}
}
