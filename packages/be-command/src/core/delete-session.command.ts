export class DeleteSessionCommand {
	constructor(
		readonly timelineSeq: bigint,
		readonly sessionSeq: bigint,
	) {}
}
