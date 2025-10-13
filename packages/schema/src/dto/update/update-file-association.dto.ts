import { PartialType } from "@nestjs/swagger";
import { CreateFileAssociationDto } from "../create/create-file-association.dto";

export class UpdateFileAssociationDto extends PartialType(
	CreateFileAssociationDto,
) {}
