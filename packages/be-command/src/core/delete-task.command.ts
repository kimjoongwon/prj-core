export class DeleteTaskCommand {
	constructor(
		readonly taskId: string,
		readonly spaceId: string,
	) {}
}
