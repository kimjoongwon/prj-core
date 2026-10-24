export class GetTaskRoutinesQuery {
	constructor(
		readonly taskSeq: bigint,
		readonly spaceSeq: bigint,
	) {}
}
