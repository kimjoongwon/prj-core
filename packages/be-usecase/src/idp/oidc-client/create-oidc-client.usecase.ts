import { OidcClientAggregate } from "@cocrepo/aggregate";
import { CreateOidcClientCommand } from "@cocrepo/command";
import { OidcProviderService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateOidcClientCommand)
export class CreateOidcClientUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcProviderService: OidcProviderService,
	) {}

	async execute(command: CreateOidcClientCommand): Promise<unknown> {
		const input = command.input;
		const client = await this.oidcClientService.create({
			clientId: input.clientId,
			clientSecret: input.clientSecret,
			name: input.name,
			redirectUris: input.redirectUris,
			loginUrl: input.loginUrl,
			defaultReturnTo: input.defaultReturnTo,
			grantTypes: input.grantTypes,
			responseTypes: input.responseTypes,
			tokenEndpointAuthMethod: input.tokenEndpointAuthMethod,
			scope: input.scope,
			isFirstParty: input.isFirstParty,
			skipConsent: input.skipConsent,
			loginUi: input.loginUi,
			logoUri: input.logoUri,
			policyUri: input.policyUri,
			tosUri: input.tosUri,
		});
		await this.oidcProviderService.reload();
		return client;
	}
}
