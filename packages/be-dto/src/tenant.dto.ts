import { Tenant } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { RoleDto } from "./role.dto";
import { SpaceDto } from "./space.dto";
import { UserDto } from "./user.dto";

export class TenantDto extends EntityResponseType(Tenant, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"roleId",
		"userId",
		"spaceId",
		"user",
		"space",
		"role",
	] as const,
	relations: {
		user: () => UserDto,
		space: () => SpaceDto,
		role: () => RoleDto,
	},
}) {
	declare user?: UserDto;
	declare space?: SpaceDto;
	declare role?: RoleDto;
}
