import { OidcClientAggregateRoot } from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
import { LogoutWithCookieCommand } from "@cocrepo/command";
import { Token } from "@cocrepo/constant";
import { TokenService, TokenStorageService } from "@cocrepo/service";
import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
	clearOidcProviderCookies,
	resolveOidcClient,
} from "./auth-oidc.support";
import {
	decodeAccessToken,
	resolveClientIdFromSessionId,
	toProtocolClientConfig,
} from "./auth-support";

@CommandHandler(LogoutWithCookieCommand)
export class LogoutWithCookieUseCase
	implements ICommandHandler<LogoutWithCookieCommand>
{
	private readonly logger = new Logger(LogoutWithCookieUseCase.name);

	constructor(
		private readonly oidcClientService: OidcClientAggregateRoot,
		private readonly oidcClient: OidcClient,
		private readonly tokenStorageService: TokenStorageService,
		private readonly tokenService: TokenService,
	) {}

	async execute(command: LogoutWithCookieCommand): Promise<boolean> {
		if (command.accessToken) {
			const clientId = resolveClientIdFromSessionId(command.sessionId);
			const client = await resolveOidcClient(this.oidcClientService, clientId, {
				requireActive: false,
				requireAuthShell: false,
			});
			await this.oidcClient.revokeToken(
				command.accessToken,
				toProtocolClientConfig(client),
			);

			try {
				const payload = decodeAccessToken(command.accessToken);
				const expSeconds = (payload as { exp?: number }).exp ?? 0;
				const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
				if (remainingSeconds > 0) {
					await this.tokenStorageService.addToBlacklist(
						command.accessToken,
						remainingSeconds,
					);
				}

				if (command.sessionId) {
					await this.tokenStorageService.deleteSession(
						payload.sub,
						command.sessionId,
					);
				} else {
					await this.tokenStorageService.deleteRefreshToken(payload.sub);
				}
			} catch (error) {
				this.logger.warn(`로그아웃 토큰 정리 실패: ${error}`);
			}
		}

		this.tokenService.clearTokenCookies(command.res);
		command.res.clearCookie(Token.SESSION_ID);
		command.res.clearCookie("tenantId");
		command.res.clearCookie("workspaceId");
		clearOidcProviderCookies(command.res);

		return true;
	}
}
