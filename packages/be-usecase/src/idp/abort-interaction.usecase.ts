import { AbortInteractionCommand } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IDP_INTERACTION_SERVICE, type InteractionPort } from "./idp.ports";
import { toAbsoluteOidcUrl } from "./idp-local.support";

@CommandHandler(AbortInteractionCommand)
export class AbortInteractionUseCase
	implements ICommandHandler<AbortInteractionCommand>
{
	constructor(
		@Inject(IDP_INTERACTION_SERVICE)
		private readonly interactionService: InteractionPort,
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
