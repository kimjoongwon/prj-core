import { OidcClientAggregateRoot } from "@cocrepo/aggregate";
import { CreateOidcClientCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IDP_OIDC_PROVIDER_SERVICE, type OidcProviderPort } from "./idp.ports";

@CommandHandler(CreateOidcClientCommand)
export class CreateOidcClientUseCase
	implements ICommandHandler<CreateOidcClientCommand>
{
	constructor(
		private readonly oidcClientService: OidcClientAggregateRoot,
		@Inject(IDP_OIDC_PROVIDER_SERVICE)
		private readonly oidcProviderService: OidcProviderPort,
	) {}

	async execute(command: CreateOidcClientCommand): Promise<unknown> {
		const dto = command.dto;
		const client = await this.oidcClientService.create({
			clientId: dto.clientId,
			clientSecret: dto.clientSecret,
			name: dto.name,
			redirectUris: dto.redirectUris,
			loginUrl: dto.loginUrl,
			defaultReturnTo: dto.defaultReturnTo,
			grantTypes: dto.grantTypes,
			responseTypes: dto.responseTypes,
			tokenEndpointAuthMethod: dto.tokenEndpointAuthMethod,
			scope: dto.scope,
			isFirstParty: dto.isFirstParty,
			skipConsent: dto.skipConsent,
			loginUi: dto.loginUi,
			logoUri: dto.logoUri,
			policyUri: dto.policyUri,
			tosUri: dto.tosUri,
		});
		await this.oidcProviderService.reload();
		return client;
	}
}
