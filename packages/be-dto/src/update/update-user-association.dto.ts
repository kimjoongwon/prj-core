import { PartialType } from "@nestjs/swagger";
import { CreateUserAssociationDto } from "../create/create-user-association.dto";

export class UpdateUserAssociationDto extends PartialType(
	CreateUserAssociationDto,
) {}
