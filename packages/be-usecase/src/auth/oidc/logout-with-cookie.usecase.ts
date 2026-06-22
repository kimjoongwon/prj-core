import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
import { LogoutWithCookieCommand } from "@cocrepo/command";
import { Token } from "@cocrepo/constant";
import { TokenService, TokenStorageService } from "@cocrepo/service";
import { Logger } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { clearOidcProviderCookies } from "./clear-oidc-provider-cookies";
import { decodeAccessToken } from "./decode-access-token";
import { extractBearerToken } from "./extract-bearer-token";
import { resolveClientIdFromSessionId } from "./resolve-client-id-from-session-id";
import { resolveOidcClient } from "./resolve-oidc-client";
import { toProtocolClientConfig } from "./to-protocol-client-config";

@CommandHandler(LogoutWithCookieCommand)
export class LogoutWithCookieUseCase {
	private readonly logger = new Logger(LogoutWithCookieUseCase.name);

	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcClient: OidcClient,
		private readonly tokenStorageService: TokenStorageService,
		private readonly tokenService: TokenService,
	) {}

	async execute(command: LogoutWithCookieCommand): Promise<boolean> {
		const accessToken =
			command.accessTokenCookie ??
			extractBearerToken(command.authorizationHeader);
		if (accessToken) {
			const clientId = resolveClientIdFromSessionId(command.sessionId);
			const client = await resolveOidcClient(this.oidcClientService, clientId, {
				requireActive: false,
				requireLoginPage: false,
			});
			await this.oidcClient.revokeToken(
				accessToken,
				toProtocolClientConfig(client),
			);

			try {
				const payload = decodeAccessToken(accessToken);
				const expSeconds = (payload as { exp?: number }).exp ?? 0;
				const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
				if (remainingSeconds > 0) {
					await this.tokenStorageService.addToBlacklist(
						accessToken,
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
