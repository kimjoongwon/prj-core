import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { SyncRolePoliciesDto, SyncUserPoliciesDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyAssignmentFacade {
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregate,
	) {}

	getRolePolicies(roleId: string): Promise<unknown> {
		return this.policyAssignmentService.getRolePolicies(roleId);
	}

	syncRolePolicies(
		roleId: string,
		rolePolicies: SyncRolePoliciesDto["rolePolicies"],
	): Promise<unknown> {
		return this.policyAssignmentService.syncRolePolicies(roleId, rolePolicies);
	}

	getUserPolicies(userId: string): Promise<unknown> {
		return this.policyAssignmentService.getUserPolicies(userId);
	}

	syncUserPolicies(
		userId: string,
		userPolicies: SyncUserPoliciesDto["userPolicies"],
	): Promise<unknown> {
		return this.policyAssignmentService.syncUserPolicies(userId, userPolicies);
	}
}
