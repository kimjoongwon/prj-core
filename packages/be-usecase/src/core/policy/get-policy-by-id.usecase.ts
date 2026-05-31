import { PolicyAggregateRoot } from "@cocrepo/aggregate";
import { GetPolicyByIdQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetPolicyByIdQuery)
export class GetPolicyByIdUseCase implements IQueryHandler<GetPolicyByIdQuery> {
	constructor(private readonly policyService: PolicyAggregateRoot) {}

	execute(query: GetPolicyByIdQuery): Promise<unknown> {
		return this.policyService.getPolicyById(query.policyId);
	}
}
