import { OidcClientAggregate } from "@cocrepo/aggregate";
import { ToggleActiveOidcClientCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { IDP_OIDC_PROVIDER_SERVICE, type OidcProviderPort } from "./idp.ports";

@CommandHandler(ToggleActiveOidcClientCommand)
export class ToggleOidcClientActiveUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		@Inject(IDP_OIDC_PROVIDER_SERVICE)
		private readonly oidcProviderService: OidcProviderPort,
	) {}

	async execute(command: ToggleActiveOidcClientCommand): Promise<unknown> {
		const client = await this.oidcClientService.toggleActive(
			command.oidcClientId,
		);
		await this.oidcProviderService.reload();
		return client;
	}
}
