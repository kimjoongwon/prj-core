import { ConfirmInteractionConsentCommand } from "@cocrepo/command";
import { InteractionService, OidcRedirectUrlService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ConfirmInteractionConsentCommand)
export class ConfirmInteractionConsentUseCase {
	constructor(
		private readonly interactionService: InteractionService,
		private readonly oidcRedirectUrlService: OidcRedirectUrlService,
	) {}

	async execute(command: ConfirmInteractionConsentCommand) {
		const consentResult = await this.interactionService.processConsent(
			command.req,
			command.res,
		);
		return {
			redirectTo: this.oidcRedirectUrlService.toAbsolute(
				consentResult.redirectTo,
			),
		};
	}
}
