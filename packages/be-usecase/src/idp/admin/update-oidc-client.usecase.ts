import { OidcClientAggregate } from "@cocrepo/aggregate";
import { UpdateOidcClientCommand } from "@cocrepo/command";
import { OidcProviderService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateOidcClientCommand)
export class UpdateOidcClientUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcProviderService: OidcProviderService,
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
