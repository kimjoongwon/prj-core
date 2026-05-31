import { GetInteractionQuery } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { IDP_INTERACTION_SERVICE, type InteractionPort } from "./idp.ports";

@QueryHandler(GetInteractionQuery)
export class GetInteractionUseCase
	implements IQueryHandler<GetInteractionQuery>
{
	private readonly isDev =
		process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "staging";

	constructor(
		@Inject(IDP_INTERACTION_SERVICE)
		private readonly interactionService: InteractionPort,
	) {}

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
