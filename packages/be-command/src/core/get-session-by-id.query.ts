export class GetSessionByIdQuery {
	constructor(
		readonly timelineId: string,
		readonly sessionId: string,
	) {}
}
