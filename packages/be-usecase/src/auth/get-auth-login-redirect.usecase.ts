import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
import { GetAuthLoginRedirectCommand } from "@cocrepo/command";
import { TokenStorageService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";
import { resolveOidcClient } from "./auth-oidc.support";
import { toProtocolClientConfig } from "./auth-support";

@CommandHandler(GetAuthLoginRedirectCommand)
export class GetAuthLoginRedirectUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcClient: OidcClient,
		private readonly tokenStorageService: TokenStorageService,
	) {}

	async execute(command: GetAuthLoginRedirectCommand) {
		const client = await resolveOidcClient(
			this.oidcClientService,
			command.clientId,
		);
		const authorizationOptions = command.prompt
			? { prompt: command.prompt }
			: undefined;
		const authorizationRequest = this.oidcClient.createAuthorizationRequest(
			toProtocolClientConfig(client),
			command.returnTo,
			authorizationOptions,
		);

		await this.tokenStorageService.saveOidcState(
			authorizationRequest.state,
			authorizationRequest.codeVerifier,
			600,
			command.returnTo,
			client.clientId,
		);
		return authorizationRequest.authorizationUrl;
	}
}
