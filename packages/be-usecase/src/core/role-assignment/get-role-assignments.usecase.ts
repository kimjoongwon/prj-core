import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { GetRolePoliciesQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRolePoliciesQuery)
export class GetRolePoliciesUseCase {
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregate,
	) {}

	execute(query: GetRolePoliciesQuery): Promise<unknown> {
		return this.policyAssignmentService.getRolePolicies(query.roleId);
	}
}
