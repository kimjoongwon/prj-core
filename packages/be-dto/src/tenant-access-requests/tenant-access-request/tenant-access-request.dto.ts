import { TenantAccessRequest } from "@cocrepo/entity";
import { EntityResponseType } from "../../mapped-types";
import { RoleDto } from "../../role.dto";
import { SpaceDto } from "../../space.dto";
import { TenantDto } from "../../tenant.dto";
import { UserDto } from "../../user.dto";

export class TenantAccessRequestDto extends EntityResponseType(
	TenantAccessRequest,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"requesterId",
			"spaceId",
			"requestedRoleId",
			"previousRoleId",
			"reason",
			"status",
			"reviewerId",
			"reviewComment",
			"reviewedAt",
			"appliedTenantId",
			"requester",
			"reviewer",
			"space",
			"requestedRole",
			"previousRole",
			"appliedTenant",
		] as const,
		relations: {
			requester: () => UserDto,
			reviewer: () => UserDto,
			space: () => SpaceDto,
			requestedRole: () => RoleDto,
			previousRole: () => RoleDto,
			appliedTenant: () => TenantDto,
		},
	},
) {
	declare requester?: UserDto;
	declare reviewer?: UserDto | null;
	declare space?: SpaceDto;
	declare requestedRole?: RoleDto;
	declare previousRole?: RoleDto | null;
	declare appliedTenant?: TenantDto | null;
}
