import { AbortInteractionCommand } from "@cocrepo/command";
import { InteractionService, OidcRedirectUrlService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(AbortInteractionCommand)
export class AbortInteractionUseCase {
	constructor(
		private readonly interactionService: InteractionService,
		private readonly oidcRedirectUrlService: OidcRedirectUrlService,
	) {}

	async execute(command: AbortInteractionCommand) {
		const abortResult = await this.interactionService.abortInteraction(
			command.req,
			command.res,
		);
		return {
			redirectTo: this.oidcRedirectUrlService.toAbsolute(
				abortResult.redirectTo,
			),
		};
	}
}
