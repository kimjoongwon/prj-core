export class ExecutePasswordResetCommand {
	constructor(
		readonly token: string,
		readonly password: string,
	) {}
}
