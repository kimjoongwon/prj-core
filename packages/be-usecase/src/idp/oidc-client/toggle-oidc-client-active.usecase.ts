import { OidcClientAggregate } from "@cocrepo/aggregate";
import { ToggleActiveOidcClientCommand } from "@cocrepo/command";
import { OidcProviderService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ToggleActiveOidcClientCommand)
export class ToggleOidcClientActiveUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcProviderService: OidcProviderService,
	) {}

	async execute(command: ToggleActiveOidcClientCommand): Promise<unknown> {
		const client = await this.oidcClientService.toggleActive(
			command.oidcClientId,
		);
		await this.oidcProviderService.reload();
		return client;
	}
}
