import type { UpdateOidcClientCommandInput } from "@cocrepo/input";
export class UpdateOidcClientCommand implements UpdateOidcClientCommandInput {
	readonly name?: UpdateOidcClientCommandInput["name"];
	readonly skipConsent?: UpdateOidcClientCommandInput["skipConsent"];
	readonly clientSecret?: UpdateOidcClientCommandInput["clientSecret"];
	readonly redirectUris?: UpdateOidcClientCommandInput["redirectUris"];
	readonly loginUrl?: UpdateOidcClientCommandInput["loginUrl"];
	readonly defaultReturnTo?: UpdateOidcClientCommandInput["defaultReturnTo"];
	readonly grantTypes?: UpdateOidcClientCommandInput["grantTypes"];
	readonly responseTypes?: UpdateOidcClientCommandInput["responseTypes"];
	readonly tokenEndpointAuthMethod?: UpdateOidcClientCommandInput["tokenEndpointAuthMethod"];
	readonly scope?: UpdateOidcClientCommandInput["scope"];
	readonly isFirstParty?: UpdateOidcClientCommandInput["isFirstParty"];
	readonly loginUi?: UpdateOidcClientCommandInput["loginUi"];
	readonly logoUri?: UpdateOidcClientCommandInput["logoUri"];
	readonly policyUri?: UpdateOidcClientCommandInput["policyUri"];
	readonly tosUri?: UpdateOidcClientCommandInput["tosUri"];

	constructor(
		readonly oidcClientId: string,
		input: UpdateOidcClientCommandInput,
	) {
		Object.assign(this, input);
	}
}
