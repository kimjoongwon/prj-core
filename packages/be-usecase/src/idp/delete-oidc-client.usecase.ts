import { OidcClientAggregateRoot } from "@cocrepo/aggregate";
import { DeleteOidcClientCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IDP_OIDC_PROVIDER_SERVICE, type OidcProviderPort } from "./idp.ports";

@CommandHandler(DeleteOidcClientCommand)
export class DeleteOidcClientUseCase
	implements ICommandHandler<DeleteOidcClientCommand>
{
	constructor(
		private readonly oidcClientService: OidcClientAggregateRoot,
		@Inject(IDP_OIDC_PROVIDER_SERVICE)
		private readonly oidcProviderService: OidcProviderPort,
	) {}

	async execute(command: DeleteOidcClientCommand): Promise<void> {
		await this.oidcClientService.remove(command.oidcClientId);
		await this.oidcProviderService.reload();
	}
}
