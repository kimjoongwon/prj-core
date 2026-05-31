import { PolicyAggregateRoot } from "@cocrepo/aggregate";
import { SyncPolicyAbilitiesCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncPolicyAbilitiesCommand)
export class SyncPolicyAbilitiesUseCase
	implements ICommandHandler<SyncPolicyAbilitiesCommand>
{
	constructor(private readonly policyService: PolicyAggregateRoot) {}

	execute(command: SyncPolicyAbilitiesCommand): Promise<unknown> {
		return this.policyService.syncPolicyAbilities(
			command.policyId,
			command.abilityIds,
		);
	}
}
