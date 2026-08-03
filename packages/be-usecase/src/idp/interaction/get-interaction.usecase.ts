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
		const clientId =
			typeof interaction.params.client_id === "string"
				? interaction.params.client_id
				: undefined;
		const client = clientId
			? await this.interactionService.findClient(clientId)
			: undefined;

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
