export class GetProgramByIdQuery {
	constructor(
		readonly sessionId: string,
		readonly programId: string,
	) {}
}
