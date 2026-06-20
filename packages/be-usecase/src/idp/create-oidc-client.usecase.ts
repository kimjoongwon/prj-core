import { OidcClientAggregate } from "@cocrepo/aggregate";
import { CreateOidcClientCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { IDP_OIDC_PROVIDER_SERVICE, type OidcProviderPort } from "./idp.ports";

@CommandHandler(CreateOidcClientCommand)
export class CreateOidcClientUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		@Inject(IDP_OIDC_PROVIDER_SERVICE)
		private readonly oidcProviderService: OidcProviderPort,
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
