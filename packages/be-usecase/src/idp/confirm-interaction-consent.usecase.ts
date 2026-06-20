import { ConfirmInteractionConsentCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler } from "@nestjs/cqrs";
import { IDP_INTERACTION_SERVICE, type InteractionPort } from "./idp.ports";
import { toAbsoluteOidcUrl } from "./idp-local.support";

@CommandHandler(ConfirmInteractionConsentCommand)
export class ConfirmInteractionConsentUseCase {
	constructor(
		@Inject(IDP_INTERACTION_SERVICE)
		private readonly interactionService: InteractionPort,
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
