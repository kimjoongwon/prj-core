export class DeleteOidcClientCommand {
	/** OIDC client identifier from external IdP protocol. */
	constructor(readonly oidcClientId: string) {}
}
