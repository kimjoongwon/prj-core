import { AbilityAggregate } from "@cocrepo/aggregate";
import { UpdateAbilityCommand } from "@cocrepo/command";
import { ABILITY_ERRORS } from "@cocrepo/constant";
import { NotFoundException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateAbilityCommand)
export class UpdateAbilityUseCase {
	constructor(private readonly abilitiesService: AbilityAggregate) {}

	async execute(command: UpdateAbilityCommand): Promise<unknown> {
		const existing = await this.abilitiesService.getAbilityById(
			command.abilityId,
		);
		if (!existing) {
			throw new NotFoundException(ABILITY_ERRORS.NOT_FOUND);
		}
		return this.abilitiesService.updateAbility(command.abilityId, command);
	}
}
