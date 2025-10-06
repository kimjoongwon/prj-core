import { $Enums, Role } from "@prisma/client";
import { ClassField, EnumField } from "../decorator/field";
import { AbstractDto } from "./abstract.dto";
import { RoleAssociationDto } from "./role-association.dto";
import { RoleClassificationDto } from "./role-classification.dto";

export class RoleDto extends AbstractDto implements Role {
	@EnumField(() => $Enums.Roles)
	name: $Enums.Roles;

	@ClassField(() => RoleClassificationDto, { nullable: true })
	classification?: RoleClassificationDto;

	@ClassField(() => RoleAssociationDto, { nullable: true, isArray: true })
	associations?: RoleAssociationDto[];
}
