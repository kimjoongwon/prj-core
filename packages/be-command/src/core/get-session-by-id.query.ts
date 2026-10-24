export class GetSessionByIdQuery {
	constructor(
		readonly timelineSeq: bigint,
		readonly sessionSeq: bigint,
	) {}
}
