import { HandleOidcCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";
import { OidcProviderService } from "@cocrepo/service";

@CommandHandler(HandleOidcCommand)
export class HandleOidcUseCase {
	constructor(
		private readonly oidcProviderService: OidcProviderService,
	) {}

	async execute(command: HandleOidcCommand): Promise<void> {
		const provider = this.oidcProviderService.getProvider();
		const callback = provider.callback();
		command.req.url = command.req.url.replace(/^\/oidc/, "") || "/";
		await callback(command.req, command.res);
	}
}
