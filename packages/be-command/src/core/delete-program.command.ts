export class DeleteProgramCommand {
	constructor(
		readonly sessionId: string,
		readonly programId: string,
	) {}
}
