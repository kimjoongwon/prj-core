import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { GetUserPoliciesQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetUserPoliciesQuery)
export class GetUserPoliciesUseCase
	implements IQueryHandler<GetUserPoliciesQuery>
{
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregate,
	) {}

	execute(query: GetUserPoliciesQuery): Promise<unknown> {
		return this.policyAssignmentService.getUserPolicies(query.userId);
	}
}
