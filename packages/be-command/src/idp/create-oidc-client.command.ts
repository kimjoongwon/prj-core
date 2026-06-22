import type { CreateOidcClientCommandInput } from "@cocrepo/input";
export class CreateOidcClientCommand implements CreateOidcClientCommandInput {
	readonly skipConsent?: CreateOidcClientCommandInput["skipConsent"];
	readonly name!: CreateOidcClientCommandInput["name"];
	readonly clientId!: CreateOidcClientCommandInput["clientId"];
	readonly clientSecret!: CreateOidcClientCommandInput["clientSecret"];
	readonly redirectUris!: CreateOidcClientCommandInput["redirectUris"];
	readonly loginUrl!: CreateOidcClientCommandInput["loginUrl"];
	readonly defaultReturnTo!: CreateOidcClientCommandInput["defaultReturnTo"];
	readonly grantTypes!: CreateOidcClientCommandInput["grantTypes"];
	readonly responseTypes!: CreateOidcClientCommandInput["responseTypes"];
	readonly tokenEndpointAuthMethod!: CreateOidcClientCommandInput["tokenEndpointAuthMethod"];
	readonly scope!: CreateOidcClientCommandInput["scope"];
	readonly isFirstParty!: CreateOidcClientCommandInput["isFirstParty"];
	readonly loginUi!: CreateOidcClientCommandInput["loginUi"];
	readonly logoUri!: CreateOidcClientCommandInput["logoUri"];
	readonly policyUri!: CreateOidcClientCommandInput["policyUri"];
	readonly tosUri!: CreateOidcClientCommandInput["tosUri"];

	constructor(input: CreateOidcClientCommandInput) {
		Object.assign(this, input);
	}
}
