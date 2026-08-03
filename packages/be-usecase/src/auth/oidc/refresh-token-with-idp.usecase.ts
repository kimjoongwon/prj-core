import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
import { RefreshTokenWithIdpCommand } from "@cocrepo/command";
import {
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import type { AuthSessionResult } from "./auth-session.result";
import { decodeAccessToken } from "./decode-access-token";
import { resolveClientIdFromSessionId } from "./resolve-client-id-from-session-id";
import { resolveOidcClient } from "./resolve-oidc-client";
import { toProtocolClientConfig } from "./to-protocol-client-config";

@CommandHandler(RefreshTokenWithIdpCommand)
export class RefreshTokenWithIdpUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcClient: OidcClient,
		private readonly usersService: UserService,
		private readonly tokenStorageService: TokenStorageService,
		private readonly tokenService: TokenService,
	) {}

	async execute(
		command: RefreshTokenWithIdpCommand,
	): Promise<AuthSessionResult> {
		const refreshToken =
			command.refreshTokenCookie || command.refreshTokenHeader;
		if (!refreshToken) {
			throw new UnauthorizedException("리프레시 토큰이 존재하지 않습니다");
		}

		const clientId = resolveClientIdFromSessionId(command.sessionId);
		const client = await resolveOidcClient(this.oidcClientService, clientId, {
			requireActive: false,
			requireLoginPage: false,
		});
		const tokenResponse = await this.oidcClient.refreshTokens(
			refreshToken,
			toProtocolClientConfig(client),
		);
		const payload = decodeAccessToken(tokenResponse.access_token);
		const user = await (
			this.usersService as UserService & {
				findByUserIdWithTenants: (
					userId: string,
				) => ReturnType<UserService["getByIdWithTenants"]>;
			}
		).findByUserIdWithTenants(payload.sub);

		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		if (command.sessionId) {
			const newRefreshToken = tokenResponse.refresh_token || refreshToken;
			await this.tokenStorageService.updateSession(
				payload.sub,
				command.sessionId,
				newRefreshToken,
			);
		}

		this.tokenService.setAccessTokenCookie(
			command.res,
			tokenResponse.access_token,
		);
		if (tokenResponse.refresh_token) {
			this.tokenService.setRefreshTokenCookie(
				command.res,
				tokenResponse.refresh_token,
			);
		}

		const now = Date.now();
		return {
			accessToken: tokenResponse.access_token,
			refreshToken: tokenResponse.refresh_token || refreshToken,
			accessTokenExpiresAt: now + tokenResponse.expires_in * 1000,
			refreshTokenExpiresAt: now + 30 * 24 * 60 * 60 * 1000,
			user,
		};
	}
}
