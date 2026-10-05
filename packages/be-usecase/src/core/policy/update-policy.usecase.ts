import { PolicyAggregate } from "@cocrepo/aggregate";
import { UpdatePolicyCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdatePolicyCommand)
export class UpdatePolicyUseCase {
	constructor(private readonly policyService: PolicyAggregate) {}

	execute(command: UpdatePolicyCommand): Promise<unknown> {
		return this.policyService.updatePolicy(command.policyId, command);
	}
}
