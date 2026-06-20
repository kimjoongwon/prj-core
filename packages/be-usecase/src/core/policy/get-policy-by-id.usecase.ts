import { PolicyAggregate } from "@cocrepo/aggregate";
import { GetPolicyByIdQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetPolicyByIdQuery)
export class GetPolicyByIdUseCase {
	constructor(private readonly policyService: PolicyAggregate) {}

	execute(query: GetPolicyByIdQuery): Promise<unknown> {
		return this.policyService.getPolicyById(query.policyId);
	}
}
