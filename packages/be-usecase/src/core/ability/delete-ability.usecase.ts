import { AbilityAggregateRoot } from "@cocrepo/aggregate";
import { DeleteAbilityCommand } from "@cocrepo/command";
import { ABILITY_ERRORS } from "@cocrepo/constant";
import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteAbilityCommand)
export class DeleteAbilityUseCase
	implements ICommandHandler<DeleteAbilityCommand>
{
	constructor(private readonly abilitiesService: AbilityAggregateRoot) {}

	async execute(command: DeleteAbilityCommand): Promise<unknown> {
		const existing = await this.abilitiesService.getAbilityById(
			command.abilityId,
		);
		if (!existing) {
			throw new NotFoundException(ABILITY_ERRORS.NOT_FOUND);
		}
		return this.abilitiesService.deleteAbility(command.abilityId);
	}
}
