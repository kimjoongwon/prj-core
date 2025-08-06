import { $Enums, Role } from "@prisma/client";
import { ClassField, EnumField } from "../decorator/field.decorators";
import { AbstractDto } from "./abstract.dto";
import { RoleAssociationDto } from "./role-association.dto";
import { RoleClassificationDto } from "./role-classification.dto";

export class RoleDto extends AbstractDto implements Role {
	@EnumField(() => $Enums.Roles)
	name: $Enums.Roles;

	@ClassField(() => RoleClassificationDto, { nullable: true, isArray: true })
	classifications?: RoleClassificationDto[];

	@ClassField(() => RoleAssociationDto, { nullable: true, isArray: true })
	associations?: RoleAssociationDto[];
}
