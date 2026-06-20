import { OidcClientAggregate } from "@cocrepo/aggregate";
import { DeleteOidcClientCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import {
	IDP_OIDC_PROVIDER_SERVICE,
	type OidcProviderPort,
} from "@cocrepo/service";

@CommandHandler(DeleteOidcClientCommand)
export class DeleteOidcClientUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		@Inject(IDP_OIDC_PROVIDER_SERVICE)
		private readonly oidcProviderService: OidcProviderPort,
	) {}

	async execute(command: DeleteOidcClientCommand): Promise<void> {
		await this.oidcClientService.remove(command.oidcClientId);
		await this.oidcProviderService.reload();
	}
}
