import { AbilityAggregate } from "@cocrepo/aggregate";
import { GetAllAbilitiesQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAllAbilitiesQuery)
export class GetAllAbilitiesUseCase {
	constructor(private readonly abilitiesService: AbilityAggregate) {}

	execute(): Promise<unknown> {
		return this.abilitiesService.getAllAbilities();
	}
}
