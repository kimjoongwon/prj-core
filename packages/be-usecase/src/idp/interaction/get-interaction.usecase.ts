import { GetInteractionQuery } from "@cocrepo/command";
import { InteractionService } from "@cocrepo/service";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetInteractionQuery)
export class GetInteractionUseCase {
	private readonly isDev =
		process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "staging";

	constructor(private readonly interactionService: InteractionService) {}

	async execute(query: GetInteractionQuery) {
		const interaction = await this.interactionService.getInteractionDetails(
			query.req,
			query.res,
		);
		const client = await this.interactionService.findClient(
			interaction.params.client_id as string,
		);

		return {
			type: interaction.prompt.name,
			uid: query.uid,
			client: client
				? {
						clientId: client.clientId,
						name: client.name,
						logoUri: client.logoUri,
						loginUi: client.loginUi ?? null,
					}
				: null,
			prompt: interaction.prompt,
			params: interaction.params,
			session: interaction.session,
			isDev: this.isDev,
		};
	}
}
