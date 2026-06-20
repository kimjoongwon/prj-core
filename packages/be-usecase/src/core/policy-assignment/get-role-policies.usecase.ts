import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { GetRolePoliciesQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRolePoliciesQuery)
export class GetRolePoliciesUseCase
	implements IQueryHandler<GetRolePoliciesQuery>
{
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregate,
	) {}

	execute(query: GetRolePoliciesQuery): Promise<unknown> {
		return this.policyAssignmentService.getRolePolicies(query.roleId);
	}
}
