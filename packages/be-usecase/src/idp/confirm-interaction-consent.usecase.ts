import { ConfirmInteractionConsentCommand } from "@cocrepo/command";
import { InteractionService } from "@cocrepo/service";
import { ConfigService } from "@nestjs/config";
import { CommandHandler } from "@nestjs/cqrs";
import { toAbsoluteOidcUrl } from "./idp-local.support";

@CommandHandler(ConfirmInteractionConsentCommand)
export class ConfirmInteractionConsentUseCase {
	constructor(
		private readonly interactionService: InteractionService,
		private readonly configService: ConfigService,
	) {}

	async execute(command: ConfirmInteractionConsentCommand) {
		const consentResult = await this.interactionService.processConsent(
			command.req,
			command.res,
		);
		return {
			redirectTo: toAbsoluteOidcUrl(
				this.configService,
				consentResult.redirectTo,
			),
		};
	}
}
