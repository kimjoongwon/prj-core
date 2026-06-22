import { AbilityAggregate } from "@cocrepo/aggregate";
import { CreateAbilityCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateAbilityCommand)
export class CreateAbilityUseCase {
	constructor(private readonly abilitiesService: AbilityAggregate) {}

	execute(command: CreateAbilityCommand): Promise<unknown> {
		return this.abilitiesService.createAbility(command);
	}
}
