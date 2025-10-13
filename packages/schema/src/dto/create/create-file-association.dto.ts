import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant/entity-common-fields";
import { FileAssociationDto } from "../file-association.dto";

export class CreateFileAssociationDto extends OmitType(FileAssociationDto, [
	...COMMON_ENTITY_FIELDS,
	"file",
]) {}
