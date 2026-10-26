export class GetTaskRoutinesQuery {
	constructor(
		readonly taskId: bigint,
		readonly spaceId: bigint,
	) {}
}
