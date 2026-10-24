export class DeleteProgramCommand {
	constructor(
		readonly sessionSeq: bigint,
		readonly programSeq: bigint,
	) {}
}
