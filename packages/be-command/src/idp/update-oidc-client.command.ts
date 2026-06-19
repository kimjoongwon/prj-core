import type { UpdateOidcClientCommandInput } from "./update-oidc-client.input";
export class UpdateOidcClientCommand {
	constructor(
		readonly oidcClientId: string,
		readonly input: UpdateOidcClientCommandInput,
	) {}
}
