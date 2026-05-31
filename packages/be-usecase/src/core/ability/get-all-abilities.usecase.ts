import { AbilityAggregateRoot } from "@cocrepo/aggregate";
import { GetAllAbilitiesQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAllAbilitiesQuery)
export class GetAllAbilitiesUseCase
	implements IQueryHandler<GetAllAbilitiesQuery>
{
	constructor(private readonly abilitiesService: AbilityAggregateRoot) {}

	execute(): Promise<unknown> {
		return this.abilitiesService.getAllAbilities();
	}
}
