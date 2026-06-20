import { PolicyAggregate } from "@cocrepo/aggregate";
import { CreatePolicyCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreatePolicyCommand)
export class CreatePolicyUseCase {
	constructor(private readonly policyService: PolicyAggregate) {}

	execute(command: CreatePolicyCommand): Promise<unknown> {
		return this.policyService.createPolicy(command.input);
	}
}
