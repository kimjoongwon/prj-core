import { SubmitInteractionLoginCommand } from "@cocrepo/command";
import {
	InteractionLoginService,
	InteractionService,
	OidcRedirectUrlService,
} from "@cocrepo/service";
import { resolveHttpClientIp, resolveHttpUserAgent } from "@cocrepo/toolkit";
import { CommandHandler } from "@nestjs/cqrs";
import { buildInteractionLoginErrorResponse } from "./interaction-login-error.response";

@CommandHandler(SubmitInteractionLoginCommand)
export class SubmitInteractionLoginUseCase {
	constructor(
		private readonly interactionService: InteractionService,
		private readonly interactionLoginService: InteractionLoginService,
		private readonly oidcRedirectUrlService: OidcRedirectUrlService,
	) {}

	async execute(command: SubmitInteractionLoginCommand) {
		const result = await this.interactionLoginService.validateUser(
			command.email,
			command.password,
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
			command.remember || false,
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
