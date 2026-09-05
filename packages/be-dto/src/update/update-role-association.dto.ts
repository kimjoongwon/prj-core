import { RoleAssociation } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateRoleAssociationDto extends PartialType(
	PickType(RoleAssociation, ["roleId", "groupId"] as const),
) {}
