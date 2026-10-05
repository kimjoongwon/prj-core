import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
import { HandleOidcCallbackCommand } from "@cocrepo/command";
import { AUTH_ERRORS } from "@cocrepo/constant";
import {
	AuthCacheService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";
import type { AuthCallbackResponse } from "./auth-callback.response";
import { buildLoginRedirectUrl } from "./build-login-redirect-url";
import { getClientRedirects } from "./get-client-redirects";
import { handleOidcCallback } from "./handle-oidc-callback";

@CommandHandler(HandleOidcCallbackCommand)
export class HandleOidcCallbackUseCase {
	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcClient: OidcClient,
		private readonly tokenStorageService: TokenStorageService,
		private readonly authCacheService: AuthCacheService,
		private readonly usersService: UserService,
		private readonly tokenService: TokenService,
	) {}

	async execute(
		command: HandleOidcCallbackCommand,
	): Promise<AuthCallbackResponse> {
		const clientRedirects = await getClientRedirects(
			this.oidcClientService,
			command.clientId,
		);

		if (command.error) {
			if (!clientRedirects.loginUrl) {
				return {
					kind: "send",
					statusCode: 400,
					body: command.errorDescription || command.error,
				};
			}

			return {
				kind: "redirect",
				url: buildLoginRedirectUrl(
					clientRedirects.loginUrl,
					command.errorDescription || command.error,
				),
			};
		}

		try {
			const callbackResult = await handleOidcCallback({
				code: command.code,
				state: command.state,
				req: command.req,
				res: command.res,
				tokenStorageService: this.tokenStorageService,
				oidcClientService: this.oidcClientService,
				oidcClient: this.oidcClient,
				usersService: this.usersService,
				authCacheService: this.authCacheService,
				tokenService: this.tokenService,
			});

			return {
				kind: "redirect",
				url: callbackResult.returnTo || callbackResult.defaultReturnTo,
			};
		} catch (_error) {
			if (!clientRedirects.loginUrl) {
				return {
					kind: "send",
					statusCode: 401,
					body: AUTH_ERRORS.OIDC_CALLBACK_FAILED,
				};
			}

			return {
				kind: "redirect",
				url: buildLoginRedirectUrl(
					clientRedirects.loginUrl,
					AUTH_ERRORS.OIDC_CALLBACK_FAILED,
				),
			};
		}
	}
}
