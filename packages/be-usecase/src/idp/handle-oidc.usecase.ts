import { HandleOidcCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IDP_OIDC_PROVIDER_SERVICE, type OidcProviderPort } from "./idp.ports";

@CommandHandler(HandleOidcCommand)
export class HandleOidcUseCase implements ICommandHandler<HandleOidcCommand> {
	constructor(
		@Inject(IDP_OIDC_PROVIDER_SERVICE)
		private readonly oidcProviderService: OidcProviderPort,
	) {}

	async execute(command: HandleOidcCommand): Promise<void> {
		const provider = this.oidcProviderService.getProvider();
		const callback = provider.callback();
		command.req.url = command.req.url.replace(/^\/oidc/, "") || "/";
		await callback(command.req, command.res);
	}
}
