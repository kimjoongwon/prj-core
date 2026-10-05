export class GetAuthLoginRedirectCommand {
	constructor(
		readonly returnTo: string | undefined,
		/** OIDC client identifier from external IdP protocol. */
		readonly clientId: string,
		readonly prompt?: string,
	) {}
}
