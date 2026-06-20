import { SubmitInteractionLoginCommand } from "@cocrepo/command";
import {
	IDP_INTERACTION_LOGIN_SERVICE,
	type InteractionLoginPort,
	InteractionService,
	OidcRedirectUrlService,
} from "@cocrepo/service";
import { resolveHttpClientIp, resolveHttpUserAgent } from "@cocrepo/toolkit";
import { Inject } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { buildInteractionLoginErrorResponse } from "./interaction-login-error.response";

@CommandHandler(SubmitInteractionLoginCommand)
export class SubmitInteractionLoginUseCase {
	constructor(
		private readonly interactionService: InteractionService,
		@Inject(IDP_INTERACTION_LOGIN_SERVICE)
		private readonly interactionLoginService: InteractionLoginPort,
		private readonly oidcRedirectUrlService: OidcRedirectUrlService,
	) {}

	async execute(command: SubmitInteractionLoginCommand) {
		const result = await this.interactionLoginService.validateUser(
			command.input.email,
			command.input.password,
			resolveHttpClientIp(command.req),
			resolveHttpUserAgent(command.req),
		);

		if (!result.success) {
			return {
				statusCode:
					result.error === "ACCOUNT_LOCKED_TEMPORARY" ||
					result.error === "ACCOUNT_LOCKED_PERMANENT"
						? 403
						: 401,
				body: buildInteractionLoginErrorResponse(result),
			};
		}

		const loginResult = await this.interactionService.completeLogin(
			command.req,
			command.res,
			result.userId!,
			command.input.remember || false,
		);

		return {
			statusCode: 200,
			body: {
				redirectTo: this.oidcRedirectUrlService.toAbsolute(
					loginResult.redirectTo,
				),
				mustChangePassword: result.mustChangePassword,
			},
		};
	}
}
