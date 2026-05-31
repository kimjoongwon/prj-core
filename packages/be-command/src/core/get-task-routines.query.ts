export class GetTaskRoutinesQuery {
	constructor(
		readonly taskId: string,
		readonly spaceId: string,
	) {}
}
