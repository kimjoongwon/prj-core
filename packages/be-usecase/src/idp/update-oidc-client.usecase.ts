import { OidcClientAggregate } from "@cocrepo/aggregate";
import { UpdateOidcClientCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IDP_OIDC_PROVIDER_SERVICE, type OidcProviderPort } from "./idp.ports";

@CommandHandler(UpdateOidcClientCommand)
export class UpdateOidcClientUseCase
	implements ICommandHandler<UpdateOidcClientCommand>
{
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		@Inject(IDP_OIDC_PROVIDER_SERVICE)
		private readonly oidcProviderService: OidcProviderPort,
	) {}

	async execute(command: UpdateOidcClientCommand): Promise<unknown> {
		const client = await this.oidcClientService.update(
			command.oidcClientId,
			command.input,
		);
		await this.oidcProviderService.reload();
		return client;
	}
}
