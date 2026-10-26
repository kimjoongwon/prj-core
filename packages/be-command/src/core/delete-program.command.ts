export class DeleteProgramCommand {
	constructor(
		readonly sessionId: bigint,
		readonly programId: bigint,
	) {}
}
