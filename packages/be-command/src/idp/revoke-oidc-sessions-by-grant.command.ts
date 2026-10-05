export class RevokeOidcSessionsByGrantCommand {
	/** OIDC grant identifier from external protocol context. */
	constructor(readonly grantId: string) {}
}
