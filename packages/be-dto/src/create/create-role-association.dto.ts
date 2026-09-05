import { RoleAssociation } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateRoleAssociationDto extends PickType(RoleAssociation, [
	"roleId",
	"groupId",
] as const) {}
