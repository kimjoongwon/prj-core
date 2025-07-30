import { PartialType } from "@nestjs/swagger";
import { CreateRoleAssociationDto } from "../create/create-role-association.dto";

export class UpdateRoleAssociationDto extends PartialType(
	CreateRoleAssociationDto,
) {}
