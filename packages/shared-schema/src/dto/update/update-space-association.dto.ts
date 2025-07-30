import { PartialType } from "@nestjs/swagger";
import { CreateSpaceAssociationDto } from "../create/create-space-association.dto";

export class UpdateSpaceAssociationDto extends PartialType(
	CreateSpaceAssociationDto,
) {}
