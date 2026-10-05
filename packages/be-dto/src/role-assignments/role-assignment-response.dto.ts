import { RoleAssignment } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";
import { PolicyResponseDto } from "../policies/policy-response.dto";

export class RoleAssignmentResponseDto extends EntityResponseType(
	RoleAssignment,
	{
		pick: [
			"id",
			"roleId",
			"policyId",
			"isActive",
			"priority",
			"createdAt",
			"updatedAt",
			"removedAt",
			"policy",
		] as const,
		relations: { policy: () => PolicyResponseDto },
	},
) {
	declare policy?: PolicyResponseDto;
}
