export class GetAuthLoginRedirectCommand {
	constructor(
		readonly returnTo: string | undefined,
		readonly clientId: string,
		readonly prompt?: string,
	) {}
}
