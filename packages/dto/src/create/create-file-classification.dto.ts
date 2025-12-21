import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { FileClassificationDto } from "../file-classification.dto";

export class CreateFileClassificationDto extends OmitType(
	FileClassificationDto,
	[...COMMON_ENTITY_FIELDS, "category", "file"],
) {}
