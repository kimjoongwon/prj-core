import { PolicyAggregate } from "@cocrepo/aggregate";
import { SyncPolicyAbilitiesCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncPolicyAbilitiesCommand)
export class SyncPolicyAbilitiesUseCase {
	constructor(private readonly policyService: PolicyAggregate) {}

	execute(command: SyncPolicyAbilitiesCommand): Promise<unknown> {
		return this.policyService.syncPolicyAbilities(
			command.policyId,
			command.abilityIds,
		);
	}
}
