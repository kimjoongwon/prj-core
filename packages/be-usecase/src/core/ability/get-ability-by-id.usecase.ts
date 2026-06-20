import { AbilityAggregate } from "@cocrepo/aggregate";
import { GetAbilityByIdQuery } from "@cocrepo/command";
import { ABILITY_ERRORS } from "@cocrepo/constant";
import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAbilityByIdQuery)
export class GetAbilityByIdUseCase
	implements IQueryHandler<GetAbilityByIdQuery>
{
	constructor(private readonly abilitiesService: AbilityAggregate) {}

	async execute(query: GetAbilityByIdQuery): Promise<unknown> {
		const ability = await this.abilitiesService.getAbilityById(query.abilityId);
		if (!ability) {
			throw new NotFoundException(ABILITY_ERRORS.NOT_FOUND);
		}
		return ability;
	}
}
