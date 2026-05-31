import { AbilityAggregateRoot } from "@cocrepo/aggregate";
import { CreateAbilityCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateAbilityCommand)
export class CreateAbilityUseCase
	implements ICommandHandler<CreateAbilityCommand>
{
	constructor(private readonly abilitiesService: AbilityAggregateRoot) {}

	execute(command: CreateAbilityCommand): Promise<unknown> {
		return this.abilitiesService.createAbility(command.data);
	}
}
