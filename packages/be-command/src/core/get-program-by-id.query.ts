export class GetProgramByIdQuery {
	constructor(
		readonly sessionSeq: bigint,
		readonly programSeq: bigint,
	) {}
}
