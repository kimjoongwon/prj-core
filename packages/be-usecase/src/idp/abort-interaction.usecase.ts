import { AbortInteractionCommand } from "@cocrepo/command";
import { InteractionService } from "@cocrepo/service";
import { ConfigService } from "@nestjs/config";
import { CommandHandler } from "@nestjs/cqrs";
import { toAbsoluteOidcUrl } from "./idp-local.support";

@CommandHandler(AbortInteractionCommand)
export class AbortInteractionUseCase {
	constructor(
		private readonly interactionService: InteractionService,
		private readonly configService: ConfigService,
	) {}

	async execute(command: AbortInteractionCommand) {
		const abortResult = await this.interactionService.abortInteraction(
			command.req,
			command.res,
		);
		return {
			redirectTo: toAbsoluteOidcUrl(this.configService, abortResult.redirectTo),
		};
	}
}
