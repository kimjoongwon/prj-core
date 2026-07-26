import { PolicyAggregate } from "@cocrepo/aggregate";
import { SyncPolicyEntriesCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncPolicyEntriesCommand)
export class SyncPolicyEntriesUseCase {
	constructor(private readonly policyService: PolicyAggregate) {}

	execute(command: SyncPolicyEntriesCommand): Promise<unknown> {
		return this.policyService.syncPolicyEntries(
			command.policyId,
			command.entries.map((entry) => entry.abilityId),
		);
	}
}
