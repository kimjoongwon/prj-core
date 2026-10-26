export class DeleteTaskCommand {
	constructor(
		readonly taskId: bigint,
		readonly spaceId: bigint,
	) {}
}
