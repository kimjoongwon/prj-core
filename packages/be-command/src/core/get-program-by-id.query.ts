export class GetProgramByIdQuery {
	constructor(
		readonly sessionId: bigint,
		readonly programId: bigint,
	) {}
}
