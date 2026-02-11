import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { RoleAssociationDto } from "../role-association.dto";

export class CreateRoleAssociationDto extends OmitType(RoleAssociationDto, [
	...COMMON_ENTITY_FIELDS,
	"group",
]) {}
