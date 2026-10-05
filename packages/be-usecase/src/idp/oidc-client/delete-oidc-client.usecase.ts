import { OidcClientAggregate } from "@cocrepo/aggregate";
import { DeleteOidcClientCommand } from "@cocrepo/command";
import { OidcProviderService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteOidcClientCommand)
export class DeleteOidcClientUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcProviderService: OidcProviderService,
	) {}

	async execute(command: DeleteOidcClientCommand): Promise<void> {
		await this.oidcClientService.remove(command.oidcClientId);
		await this.oidcProviderService.reload();
	}
}
