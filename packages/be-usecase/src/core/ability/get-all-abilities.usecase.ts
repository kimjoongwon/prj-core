import { AbilityAggregate } from "@cocrepo/aggregate";
import { GetAllAbilitiesQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAllAbilitiesQuery)
export class GetAllAbilitiesUseCase
	implements IQueryHandler<GetAllAbilitiesQuery>
{
	constructor(private readonly abilitiesService: AbilityAggregate) {}

	execute(): Promise<unknown> {
		return this.abilitiesService.getAllAbilities();
	}
}
