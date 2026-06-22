import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { SyncUserPoliciesCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncUserPoliciesCommand)
export class SyncUserPoliciesUseCase {
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregate,
	) {}

	execute(command: SyncUserPoliciesCommand): Promise<unknown> {
		return this.policyAssignmentService.syncUserPolicies(
			command.userId,
			command.userPolicies,
		);
	}
}
