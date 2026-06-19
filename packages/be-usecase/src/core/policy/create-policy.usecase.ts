import { PolicyAggregateRoot } from "@cocrepo/aggregate";
import { CreatePolicyCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreatePolicyCommand)
export class CreatePolicyUseCase
	implements ICommandHandler<CreatePolicyCommand>
{
	constructor(private readonly policyService: PolicyAggregateRoot) {}

	execute(command: CreatePolicyCommand): Promise<unknown> {
		return this.policyService.createPolicy(command.input);
	}
}
