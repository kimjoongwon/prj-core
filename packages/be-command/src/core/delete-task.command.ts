export class DeleteTaskCommand {
	constructor(
		readonly taskSeq: bigint,
		readonly spaceSeq: bigint,
	) {}
}
