import { BigIntIdField } from "@cocrepo/decorator/field";
import { User } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { ProfileDto } from "./profile.dto";
import { TenantDto } from "./tenant.dto";
import { UserAssociationDto } from "./user-association.dto";
import { UserClassificationDto } from "./user-classification.dto";

export class UserDto extends EntityResponseType(User, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"email",
		"name",
		"phone",
		"failedLoginAttempts",
		"lockedUntil",
		"isPermanentlyLocked",
		"mustChangePassword",
		"passwordChangedAt",
		"lastLoginAt",
		"lastLoginIp",
		"isActive",
		"currentTenantId",
		"profiles",
		"tenants",
		"associations",
		"classification",
	] as const,
	relations: {
		profiles: () => ProfileDto,
		tenants: () => TenantDto,
		associations: () => UserAssociationDto,
		classification: () => UserClassificationDto,
	},
	extraFields: ["spaceId"],
}) {
	@BigIntIdField({ description: "소속 공간 ID" })
	spaceId: bigint;

	declare profiles?: ProfileDto[];
	declare tenants?: TenantDto[];
	declare associations?: UserAssociationDto[];
	declare classification?: UserClassificationDto;
}
